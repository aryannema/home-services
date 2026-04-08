import { useNavigate } from 'react-router-dom';
import {
  HiOutlineUserCircle,
  HiOutlineWrenchScrewdriver,
  HiOutlineClipboardDocumentList,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCheckBadge,
  HiOutlineArrowPath,
  HiOutlineCircleStack,
  HiOutlineTrash,
  HiOutlineArrowRight,
  HiOutlineLightBulb,
} from 'react-icons/hi2';
import * as HS from '../utils/storage';

const features = [
  { icon: HiOutlineClipboardDocumentList, label: 'Job Posts' },
  { icon: HiOutlineChatBubbleLeftRight, label: 'Quotes & Offers' },
  { icon: HiOutlineCheckBadge, label: 'Booking Flow' },
  { icon: HiOutlineArrowPath, label: 'Live Status' },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleSeed = () => {
    HS.seedSampleData();
    alert('Sample data added! Now open Customer/Provider pages and interact.');
  };

  const handleReset = () => {
    if (!confirm('This will clear jobs/offers and demo profile names. Continue?')) return;
    HS.resetAll();
    alert('Data cleared!');
  };

  return (
    <div className="container page">
      {/* Hero */}
      <section className="hero-center">
        <span className="hero-chip">localStorage Demo &mdash; No Backend</span>
        <h1 className="hero-center__title">
          Find trusted help,<br /><span className="text-gradient">right when you need it.</span>
        </h1>
        <p className="hero-center__sub">
          Post a service request, receive competitive quotes, confirm bookings, and leave reviews &mdash; all inside your browser.
        </p>

        {/* Feature chips */}
        <div className="feature-strip">
          {features.map(({ icon: Icon, label }) => (
            <div key={label} className="feature-chip">
              <Icon size={18} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Role Cards */}
      <div className="role-row">
        <button className="role-card" onClick={() => navigate('/customer')}>
          <div className="role-card__icon-wrap role-card__icon-wrap--primary">
            <HiOutlineUserCircle size={32} />
          </div>
          <div className="role-card__body">
            <h3 className="role-card__title">Continue as Customer</h3>
            <p className="role-card__sub">Post requests &bull; Compare quotes &bull; Leave reviews</p>
          </div>
          <HiOutlineArrowRight size={20} className="role-card__arrow" />
        </button>

        <button className="role-card role-card--alt" onClick={() => navigate('/provider')}>
          <div className="role-card__icon-wrap role-card__icon-wrap--secondary">
            <HiOutlineWrenchScrewdriver size={32} />
          </div>
          <div className="role-card__body">
            <h3 className="role-card__title">Continue as Provider</h3>
            <p className="role-card__sub">Browse jobs &bull; Send quotes &bull; Track status</p>
          </div>
          <HiOutlineArrowRight size={20} className="role-card__arrow" />
        </button>
      </div>

      {/* Bottom bar */}
      <div className="home-actions">
        <div className="tip-box">
          <HiOutlineLightBulb size={18} />
          <span><strong>Tip:</strong> Open Customer &amp; Provider in two tabs to simulate real interactions.</span>
        </div>
        <div className="home-actions__btns">
          <button className="btn btn--outline btn--sm" onClick={handleSeed}>
            <HiOutlineCircleStack size={15} /> Seed Data
          </button>
          <button className="btn btn--danger-outline btn--sm" onClick={handleReset}>
            <HiOutlineTrash size={15} /> Reset
          </button>
        </div>
      </div>
    </div>
  );
}
