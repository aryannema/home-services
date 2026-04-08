/* Home Services - localStorage data layer (ported from legacy app.js) */

const KEY = {
  customerName: 'hs_customerName',
  providerName: 'hs_providerName',
  jobs: 'hs_jobs',
  offers: 'hs_offers',
  reviews: 'hs_reviews',
};

function nowId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureDefaults() {
  if (!localStorage.getItem(KEY.customerName))
    localStorage.setItem(KEY.customerName, 'Aryan');
  if (!localStorage.getItem(KEY.providerName))
    localStorage.setItem(KEY.providerName, 'Ravi Services');
  if (!localStorage.getItem(KEY.jobs)) write(KEY.jobs, []);
  if (!localStorage.getItem(KEY.offers)) write(KEY.offers, []);
  if (!localStorage.getItem(KEY.reviews)) write(KEY.reviews, []);
}

export function resetAll() {
  write(KEY.jobs, []);
  write(KEY.offers, []);
  write(KEY.reviews, []);
}

// Names
export function getCustomerName() {
  return localStorage.getItem(KEY.customerName) || 'Customer';
}
export function setCustomerName(name) {
  localStorage.setItem(KEY.customerName, name);
}
export function getProviderName() {
  return localStorage.getItem(KEY.providerName) || 'Provider';
}
export function setProviderName(name) {
  localStorage.setItem(KEY.providerName, name);
}

// Jobs
export function getJobs() {
  return read(KEY.jobs, []);
}
export function getJob(id) {
  return getJobs().find((j) => j.id === id) || null;
}

export function createJob({ category, title, description, location, date, budget }) {
  if (!category || !title || !description || !location || !date) {
    return { ok: false, message: 'Please fill all required fields.' };
  }
  const jobs = getJobs();
  const jobId = nowId('job');
  jobs.push({
    id: jobId,
    customerName: getCustomerName(),
    category,
    title,
    description,
    location,
    date,
    budget: budget || null,
    status: 'Open',
    acceptedOfferId: null,
    createdAt: new Date().toISOString(),
  });
  write(KEY.jobs, jobs);
  return { ok: true, jobId };
}

export function updateJobStatus(jobId, status) {
  const jobs = getJobs();
  const idx = jobs.findIndex((j) => j.id === jobId);
  if (idx === -1) return false;
  jobs[idx].status = status;
  write(KEY.jobs, jobs);
  return true;
}

// Offers
export function getOffers() {
  return read(KEY.offers, []);
}
export function getOffer(id) {
  return getOffers().find((o) => o.id === id) || null;
}
export function getOffersForJob(jobId) {
  return getOffers().filter((o) => o.jobId === jobId);
}

export function createOffer({ jobId, providerName, price, message, eta }) {
  if (!jobId || !providerName || !price || !message) {
    return { ok: false, message: 'Please fill price and message.' };
  }
  const job = getJob(jobId);
  if (!job) return { ok: false, message: 'Job not found.' };
  if (job.status !== 'Open')
    return { ok: false, message: 'This job is not open for offers.' };

  const offers = getOffers();
  const offerId = nowId('offer');
  offers.push({
    id: offerId,
    jobId,
    providerName,
    price,
    message,
    eta: eta || '',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  });
  write(KEY.offers, offers);
  return { ok: true, offerId };
}

export function acceptOffer(jobId, offerId) {
  const jobs = getJobs();
  const jIdx = jobs.findIndex((j) => j.id === jobId);
  if (jIdx === -1) return false;

  jobs[jIdx].status = 'Booked';
  jobs[jIdx].acceptedOfferId = offerId;
  write(KEY.jobs, jobs);

  const offers = getOffers().map((o) => {
    if (o.jobId !== jobId) return o;
    if (o.id === offerId) return { ...o, status: 'Accepted' };
    return { ...o, status: 'Rejected' };
  });
  write(KEY.offers, offers);
  return true;
}

// Reviews
export function getReviews() {
  return read(KEY.reviews, []);
}
export function createReview({ providerName, customerName, jobId, rating, comment }) {
  const reviews = getReviews();
  reviews.push({
    id: nowId('review'),
    providerName,
    customerName,
    jobId,
    rating: Number(rating) || 5,
    comment: comment || '',
    createdAt: new Date().toISOString(),
  });
  write(KEY.reviews, reviews);
  return true;
}

// Utils
export function prettyDate(yyyyMmDd) {
  if (!yyyyMmDd) return '\u2014';
  const [y, m, d] = yyyyMmDd.split('-').map(Number);
  if (!y || !m || !d) return yyyyMmDd;
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function statusClass(status) {
  if (status === 'Completed') return 'ok';
  if (status === 'Booked') return 'booked';
  return 'neutral';
}

export function seedSampleData() {
  ensureDefaults();
  const jobs = getJobs();
  const offers = getOffers();
  if (jobs.length > 0) return;

  const customer = getCustomerName();
  const provider = getProviderName();

  const j1 = {
    id: nowId('job'),
    customerName: customer,
    category: 'Plumber',
    title: 'Fix kitchen sink leakage',
    description: 'Water is dripping under the sink. Need inspection + quick fix.',
    location: 'Vellore',
    date: new Date(Date.now() + 86400000).toISOString().slice(0, 10),
    budget: 700,
    status: 'Open',
    acceptedOfferId: null,
    createdAt: new Date().toISOString(),
  };

  const j2 = {
    id: nowId('job'),
    customerName: customer,
    category: 'Tutor',
    title: 'Need DSA tutor for arrays & strings',
    description: 'Looking for a tutor 3x/week. Help with basic problem solving.',
    location: 'Online',
    date: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    budget: 500,
    status: 'Open',
    acceptedOfferId: null,
    createdAt: new Date().toISOString(),
  };

  jobs.push(j1, j2);
  offers.push({
    id: nowId('offer'),
    jobId: j1.id,
    providerName: provider,
    price: 499,
    message: 'Can visit today evening. Includes inspection + minor seal replacement.',
    eta: 'Today 6 PM',
    status: 'Pending',
    createdAt: new Date().toISOString(),
  });

  write(KEY.jobs, jobs);
  write(KEY.offers, offers);
}
