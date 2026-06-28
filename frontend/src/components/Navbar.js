import { NavLink } from 'react-router-dom';
import './Navbar.css';

const links = [
  { to: '/',          label: 'Dashboard', icon: '▦' },
  { to: '/cars',      label: 'Cars',      icon: '◈' },
  { to: '/dealers',   label: 'Dealers',   icon: '◉' },
  { to: '/customers', label: 'Customers', icon: '◎' },
  { to: '/sales',     label: 'Sales',     icon: '◆' },
  { to: '/feedback',  label: 'Feedback',  icon: '◇' },
];

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">⬡</span>
        <div>
          <div className="brand-name">AutoSales</div>
          <div className="brand-sub">Management System</div>
        </div>
      </div>
      <ul className="nav-links">
        {links.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="navbar-footer">
        <div className="db-status">
          <span className="dot"></span>
          PostgreSQL connected
        </div>
      </div>
    </nav>
  );
}
