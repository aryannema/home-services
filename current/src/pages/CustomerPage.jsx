import { useState, useCallback } from 'react';
import {
  HiOutlineArrowPath,
  HiOutlinePencilSquare,
  HiOutlinePlusCircle,
  HiOutlineStar,
  HiOutlineCheckCircle,
  HiOutlineXMark,
  HiOutlineChevronDown,
  HiOutlineChevronUp,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineBanknotes,
  HiOutlineInboxStack,
  HiOutlineTrash,
  HiOutlineCircleStack,
} from 'react-icons/hi2';
import Badge from '../components/Badge';
import * as HS from '../utils/storage';

export default function CustomerPage() {
  const [customerName, setCustomerName] = useState(HS.getCustomerName());
  const [jobs, setJobs] = useState(() => loadMyJobs());
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [tick, setTick] = useState(0);

  const [form, setForm] = useState({ category: '', title: '', description: '', location: '', date: '', budget: '' });

  function loadMyJobs() {
    return HS.getJobs()
      .filter((j) => j.customerName === HS.getCustomerName())
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  }

  const refresh = useCallback(() => {
    setCustomerName(HS.getCustomerName());
    setJobs(loadMyJobs());
    setTick((t) => t + 1);
  }, []);

  const handleEditName = () => {
    const name = prompt('Customer name:', customerName);
    if (!name?.trim()) return;
    HS.setCustomerName(name.trim());
    refresh();
  };

  const handleSubmitJob = (e) => {
    e.preventDefault();
    const result = HS.createJob({ ...form, budget: Number(form.budget || 0) || null });
    if (!result.ok) { alert(result.message); return; }
    setForm({ category: '', title: '', description: '', location: '', date: '', budget: '' });
    setSelectedJobId(result.jobId);
    setShowForm(false);
    refresh();
  };

  const handleSeed = () => { HS.seedSampleData(); refresh(); };
  const handleClear = () => {
    if (!confirm('Clear jobs and offers?')) return;
    HS.resetAll();
    setSelectedJobId(null);
    refresh();
  };

  const selectedJob = selectedJobId ? HS.getJob(selectedJobId) : null;
  const offers = selectedJobId ? HS.getOffersForJob(selectedJobId).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)) : [];

  const handleAcceptOffer = (offerId) => { HS.acceptOffer(selectedJobId, offerId); refresh(); };
  const handleMarkCompleted = () => {
    if (!selectedJob) return;
    if (selectedJob.status !== 'Booked') { alert('You can mark completed only after booking is confirmed.'); return; }
    HS.updateJobStatus(selectedJobId, 'Completed');
    refresh();
  };

  const [reviewForm, setReviewForm] = useState({ rating: '5', comment: '' });
  const handleSubmitReview = () => {
    if (!selectedJob?.acceptedOfferId) return;
    const accepted = HS.getOffer(selectedJob.acceptedOfferId);
    if (!accepted) return;
    HS.createReview({ providerName: accepted.providerName, customerName: HS.getCustomerName(), jobId: selectedJob.id, rating: Number(reviewForm.rating), comment: reviewForm.comment });
    setReviewForm({ rating: '5', comment: '' });
    alert('Review submitted!');
  };

  const statusVariant = (s) => s === 'Completed' ? 'ok' : s === 'Booked' ? 'booked' : 'neutral';

  return (
    <div className="container page">
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar__left">
          <h2 className="topbar__title">Customer Dashboard</h2>
          <span className="pill pill--name">{customerName}</span>
        </div>
        <div className="topbar__actions">
          <button className="icon-btn" onClick={handleEditName} title="Edit name"><HiOutlinePencilSquare size={18} /></button>
          <button className="icon-btn" onClick={refresh} title="Refresh"><HiOutlineArrowPath size={18} /></button>
          <button className="btn btn--primary btn--sm" onClick={() => setShowForm((s) => !s)}>
            {showForm ? <><HiOutlineChevronUp size={15} /> Close Form</> : <><HiOutlinePlusCircle size={15} /> New Job</>}
          </button>
        </div>
      </div>

      {/* Collapsible Job Form */}
      {showForm && (
        <div className="card card--accent slide-down">
          <h3 className="card__title"><HiOutlinePlusCircle size={18} /> Create a Job Post</h3>
          <form onSubmit={handleSubmitJob} className="form">
            <div className="form-grid-3">
              <div className="field">
                <label>Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                  <option value="">Select...</option>
                  <option>Plumber</option>
                  <option>Electrician</option>
                  <option>Tutor</option>
                </select>
              </div>
              <div className="field">
                <label>Location</label>
                <input type="text" placeholder="e.g., Vellore" required value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
              </div>
              <div className="field">
                <label>Preferred Date</label>
                <input type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
              </div>
            </div>
            <div className="field">
              <label>Title</label>
              <input type="text" placeholder="e.g., Fix kitchen sink leak" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="row-2">
              <div className="field">
                <label>Description</label>
                <textarea rows={3} placeholder="Details about the job..." required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="field">
                <label>Budget (Rs.) — optional</label>
                <input type="number" min="0" placeholder="e.g., 500" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} />
                <p className="field__hint">Leave blank if no specific budget.</p>
              </div>
            </div>
            <div className="form-footer">
              <button className="btn btn--primary" type="submit">Post Job</button>
              <button className="btn btn--ghost" type="button" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Master-Detail */}
      <div className="master-detail">
        {/* Jobs List */}
        <div className="panel panel--list">
          <div className="panel__header">
            <h3 className="panel__title"><HiOutlineInboxStack size={17} /> My Requests</h3>
            <span className="count-badge">{jobs.length}</span>
          </div>
          <div className="list">
            {jobs.length === 0 ? (
              <div className="empty-state">
                <HiOutlineInboxStack size={28} />
                <p>No jobs yet. Click <strong>New Job</strong> above to create one.</p>
              </div>
            ) : (
              jobs.map((job) => {
                const offersCount = HS.getOffersForJob(job.id).length;
                return (
                  <button
                    key={job.id}
                    className={`list-item ${selectedJobId === job.id ? 'list-item--selected' : ''}`}
                    onClick={() => setSelectedJobId(job.id)}
                  >
                    <div className="list-item__top">
                      <span className="list-item__title">{job.title}</span>
                      <Badge variant={statusVariant(job.status)}>{job.status}</Badge>
                    </div>
                    <div className="list-item__meta">
                      <span><HiOutlineMapPin size={12} /> {job.location}</span>
                      <span>{job.category}</span>
                      {offersCount > 0 && <span className="offers-count">{offersCount} offer{offersCount > 1 ? 's' : ''}</span>}
                    </div>
                  </button>
                );
              })
            )}
          </div>
          <div className="panel__footer">
            <button className="btn btn--outline btn--sm" onClick={handleSeed}><HiOutlineCircleStack size={14} /> Seed</button>
            <button className="btn btn--danger-outline btn--sm" onClick={handleClear}><HiOutlineTrash size={14} /> Clear</button>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="panel panel--detail">
          {!selectedJob ? (
            <div className="empty-state empty-state--large">
              <HiOutlineInboxStack size={36} />
              <p>Select a job from the list to see details and offers.</p>
            </div>
          ) : (
            <>
              <div className="detail-header">
                <div>
                  <h3 className="detail-header__title">{selectedJob.title}</h3>
                  <div className="detail-meta">
                    <span><HiOutlineMapPin size={13} /> {selectedJob.location}</span>
                    <span><HiOutlineClock size={13} /> {HS.prettyDate(selectedJob.date)}</span>
                    {selectedJob.budget && <span><HiOutlineBanknotes size={13} /> Rs.{selectedJob.budget}</span>}
                    <Badge variant="neutral">{selectedJob.category}</Badge>
                  </div>
                </div>
                <div className="detail-header__right">
                  <Badge variant={statusVariant(selectedJob.status)}>{selectedJob.status}</Badge>
                  <button className="icon-btn icon-btn--sm" onClick={() => setSelectedJobId(null)} title="Close"><HiOutlineXMark size={16} /></button>
                </div>
              </div>

              <div className="desc-box">{selectedJob.description}</div>

              {/* Offers */}
              <div className="offers-section">
                <h4 className="section-label">Offers ({offers.length})</h4>
                {offers.length === 0 ? (
                  <div className="empty-state">
                    <p>No offers yet. Ask someone to open the Provider page and send an offer.</p>
                  </div>
                ) : (
                  <div className="offer-list">
                    {offers.map((of_) => (
                      <div key={of_.id} className={`offer-card ${of_.status === 'Accepted' ? 'offer-card--accepted' : ''}`}>
                        <div className="offer-card__header">
                          <div className="offer-card__provider">{of_.providerName}</div>
                          <div className="offer-card__price">Rs.{of_.price}</div>
                        </div>
                        <p className="offer-card__msg">{of_.message}</p>
                        <div className="offer-card__footer">
                          <span className="offer-card__eta"><HiOutlineClock size={13} /> ETA: {of_.eta || '—'}</span>
                          {of_.status === 'Pending' && selectedJob.status === 'Open' ? (
                            <button className="btn btn--primary btn--sm" onClick={() => handleAcceptOffer(of_.id)}>
                              <HiOutlineCheckCircle size={15} /> Accept
                            </button>
                          ) : (
                            <Badge variant={of_.status === 'Accepted' ? 'ok' : of_.status === 'Rejected' ? 'danger' : 'neutral'}>{of_.status}</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="detail-actions">
                {selectedJob.status === 'Booked' && (
                  <button className="btn btn--primary btn--sm" onClick={handleMarkCompleted}>
                    <HiOutlineCheckCircle size={15} /> Mark as Completed
                  </button>
                )}
              </div>

              {/* Review */}
              {selectedJob.status === 'Completed' && selectedJob.acceptedOfferId && (
                <div className="review-box">
                  <h4 className="section-label"><HiOutlineStar size={15} /> Leave a Review</h4>
                  <div className="row-2">
                    <div className="field">
                      <label>Rating</label>
                      <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}>
                        <option>5</option><option>4</option><option>3</option><option>2</option><option>1</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>Comment</label>
                      <input placeholder="Quick feedback..." value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} />
                    </div>
                  </div>
                  <button className="btn btn--primary btn--sm" onClick={handleSubmitReview}><HiOutlineStar size={14} /> Submit Review</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
