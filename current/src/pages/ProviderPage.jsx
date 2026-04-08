import { useState, useCallback } from 'react';
import {
  HiOutlineArrowPath,
  HiOutlinePencilSquare,
  HiOutlinePaperAirplane,
  HiOutlineXMark,
  HiOutlineFunnel,
  HiOutlineMagnifyingGlass,
  HiOutlineClock,
  HiOutlineMapPin,
  HiOutlineBanknotes,
  HiOutlineBriefcase,
  HiOutlineChatBubbleBottomCenterText,
} from 'react-icons/hi2';
import Badge from '../components/Badge';
import * as HS from '../utils/storage';

export default function ProviderPage() {
  const [providerName, setProviderName] = useState(HS.getProviderName());
  const [filterCat, setFilterCat] = useState('');
  const [filterLoc, setFilterLoc] = useState('');
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [tick, setTick] = useState(0);
  const [offerForm, setOfferForm] = useState({ price: '', eta: '', message: '' });

  const openJobs = HS.getJobs()
    .filter((j) => j.status === 'Open')
    .filter((j) => !filterCat || j.category === filterCat)
    .filter((j) => !filterLoc || (j.location || '').toLowerCase().includes(filterLoc.toLowerCase()))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const myOffers = HS.getOffers()
    .filter((o) => o.providerName === HS.getProviderName())
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const selectedJob = selectedJobId ? HS.getJob(selectedJobId) : null;

  const refresh = useCallback(() => {
    setProviderName(HS.getProviderName());
    setTick((t) => t + 1);
  }, []);

  const handleEditName = () => {
    const name = prompt('Provider name:', providerName);
    if (!name?.trim()) return;
    HS.setProviderName(name.trim());
    refresh();
  };

  const handleSubmitOffer = (e) => {
    e.preventDefault();
    if (!selectedJobId) return;
    const job = HS.getJob(selectedJobId);
    if (!job || job.status !== 'Open') { alert('This job is not open right now.'); return; }
    const result = HS.createOffer({ jobId: selectedJobId, providerName: HS.getProviderName(), price: Number(offerForm.price), eta: offerForm.eta, message: offerForm.message });
    if (!result.ok) { alert(result.message); return; }
    setOfferForm({ price: '', eta: '', message: '' });
    refresh();
    alert('Offer sent!');
  };

  const closePanel = () => {
    setSelectedJobId(null);
    setOfferForm({ price: '', eta: '', message: '' });
  };

  const offerVariant = (s) => s === 'Accepted' ? 'ok' : s === 'Rejected' ? 'danger' : 'neutral';

  return (
    <div className="container page">
      {/* Top bar */}
      <div className="topbar">
        <div className="topbar__left">
          <h2 className="topbar__title">Provider Dashboard</h2>
          <span className="pill pill--name">{providerName}</span>
        </div>
        <div className="topbar__actions">
          <button className="icon-btn" onClick={handleEditName} title="Edit name"><HiOutlinePencilSquare size={18} /></button>
          <button className="icon-btn" onClick={refresh} title="Refresh"><HiOutlineArrowPath size={18} /></button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <HiOutlineFunnel size={16} className="filter-bar__icon" />
        <select value={filterCat} onChange={(e) => setFilterCat(e.target.value)} className="filter-bar__select">
          <option value="">All Categories</option>
          <option>Plumber</option>
          <option>Electrician</option>
          <option>Tutor</option>
        </select>
        <div className="filter-bar__search">
          <HiOutlineMagnifyingGlass size={15} />
          <input placeholder="Search location..." value={filterLoc} onChange={(e) => setFilterLoc(e.target.value)} />
        </div>
        <span className="count-badge">{openJobs.length} open</span>
      </div>

      {/* Main content */}
      <div className="master-detail">
        {/* Job Cards Grid */}
        <div className="panel panel--list">
          <div className="panel__header">
            <h3 className="panel__title"><HiOutlineBriefcase size={17} /> Open Jobs</h3>
          </div>
          <div className="job-grid">
            {openJobs.length === 0 ? (
              <div className="empty-state">
                <HiOutlineBriefcase size={28} />
                <p>No matching open jobs right now.</p>
              </div>
            ) : (
              openJobs.map((j) => {
                const offersCount = HS.getOffersForJob(j.id).length;
                return (
                  <button
                    key={j.id}
                    className={`job-card ${selectedJobId === j.id ? 'job-card--selected' : ''}`}
                    onClick={() => setSelectedJobId(j.id)}
                  >
                    <div className="job-card__top">
                      <span className="job-card__title">{j.title}</span>
                      <Badge variant="neutral">{j.category}</Badge>
                    </div>
                    <div className="job-card__meta">
                      <span><HiOutlineMapPin size={12} /> {j.location}</span>
                      <span><HiOutlineClock size={12} /> {HS.prettyDate(j.date)}</span>
                    </div>
                    <div className="job-card__bottom">
                      {j.budget ? <span className="job-card__budget"><HiOutlineBanknotes size={13} /> Rs.{j.budget}</span> : <span />}
                      <span className="offers-count">{offersCount} offer{offersCount !== 1 ? 's' : ''}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Quote Panel */}
        <div className="panel panel--detail">
          {!selectedJob ? (
            <div className="empty-state empty-state--large">
              <HiOutlinePaperAirplane size={36} />
              <p>Select a job to send a quote.</p>
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
                  <Badge variant={selectedJob.status === 'Open' ? 'neutral' : 'booked'}>{selectedJob.status}</Badge>
                  <button className="icon-btn icon-btn--sm" onClick={closePanel} title="Close"><HiOutlineXMark size={16} /></button>
                </div>
              </div>

              <div className="desc-box">{selectedJob.description}</div>

              <form onSubmit={handleSubmitOffer} className="form quote-form">
                <h4 className="section-label"><HiOutlinePaperAirplane size={15} /> Your Quote</h4>
                <div className="form-grid-3">
                  <div className="field">
                    <label>Price (Rs.)</label>
                    <input type="number" min="1" placeholder="499" required value={offerForm.price} onChange={(e) => setOfferForm({ ...offerForm, price: e.target.value })} />
                  </div>
                  <div className="field">
                    <label>ETA</label>
                    <input placeholder="e.g., Today 6 PM" value={offerForm.eta} onChange={(e) => setOfferForm({ ...offerForm, eta: e.target.value })} />
                  </div>
                  <div className="field field--btn-row">
                    <button className="btn btn--primary" type="submit" disabled={selectedJob.status !== 'Open'}>
                      <HiOutlinePaperAirplane size={15} /> {selectedJob.status === 'Open' ? 'Send' : 'Closed'}
                    </button>
                  </div>
                </div>
                <div className="field">
                  <label>Message</label>
                  <textarea rows={2} placeholder="Short note about what you'll do..." required value={offerForm.message} onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })} />
                </div>
              </form>
            </>
          )}
        </div>
      </div>

      {/* My Offers */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="panel__header">
          <h3 className="panel__title"><HiOutlineChatBubbleBottomCenterText size={17} /> My Offers</h3>
          <span className="count-badge">{myOffers.length}</span>
        </div>
        {myOffers.length === 0 ? (
          <div className="empty-state">
            <p>No offers sent yet. Select an open job above and send a quote.</p>
          </div>
        ) : (
          <div className="offer-list">
            {myOffers.map((o) => {
              const job = HS.getJob(o.jobId);
              const jobTitle = job ? job.title : 'Job (deleted)';
              const jobMeta = job ? `${job.location} · ${job.category}` : '';
              return (
                <div key={o.id} className="offer-card">
                  <div className="offer-card__header">
                    <div>
                      <div className="offer-card__provider">{jobTitle}</div>
                      <div className="offer-card__sub">{jobMeta}</div>
                    </div>
                    <div className="offer-card__price">Rs.{o.price}</div>
                  </div>
                  <p className="offer-card__msg">{o.message}</p>
                  <div className="offer-card__footer">
                    <span className="offer-card__eta"><HiOutlineClock size={13} /> ETA: {o.eta || '—'}</span>
                    <Badge variant={offerVariant(o.status)}>{o.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
