import { Link, useLocation } from 'react-router-dom';
import { HiOutlineSun, HiOutlineMoon, HiOutlineHome, HiOutlineUser, HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { dark, toggle } = useTheme();
  const { pathname } = useLocation();

  const links = [
    { to: '/', label: 'Home', Icon: HiOutlineHome },
    { to: '/customer', label: 'Customer', Icon: HiOutlineUser },
    { to: '/provider', label: 'Provider', Icon: HiOutlineWrenchScrewdriver },
  ];

  return (
    <header className="header">
      <div className="container header__inner">
        <Link to="/" className="brand">
          <span className="brand__logo">HS</span>
          <span className="brand__name">HomeServ</span>
        </Link>

        <nav className="nav">
          {links.map(({ to, label, Icon }) => (
            <Link
              key={to}
              to={to}
              className={`nav-pill ${pathname === to ? 'nav-pill--active' : ''}`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>

        <button className="theme-toggle" onClick={toggle} aria-label="Toggle theme">
          {dark ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
        </button>
      </div>
    </header>
  );
}
