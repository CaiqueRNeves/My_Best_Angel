import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ userType, isOpen, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };
  
  // Menu items based on user type
  const menuItems = userType === 'angel' 
    ? [
        { to: '/angel/dashboard', icon: 'fa-tachometer-alt', text: 'Dashboard' },
        { to: '/angel/tours', icon: 'fa-map-marked-alt', text: 'Meus Tours' },
        { to: '/angel/create-tour', icon: 'fa-plus-circle', text: 'Novo Tour' },
        { to: '/angel/visitors', icon: 'fa-users', text: 'Meus Visitantes' },
        { to: '/angel/messages', icon: 'fa-envelope', text: 'Mensagens' },
        { to: '/angel/insights', icon: 'fa-chart-line', text: 'Insights' },
        { to: '/angel/profile', icon: 'fa-user', text: 'Perfil' },
      ]
    : [
        { to: '/visitor/dashboard', icon: 'fa-tachometer-alt', text: 'Dashboard' },
        { to: '/visitor/available-tours', icon: 'fa-map-marked-alt', text: 'Tours Disponíveis' },
        { to: '/visitor/messages', icon: 'fa-envelope', text: 'Mensagens' },
        { to: '/visitor/profile', icon: 'fa-user', text: 'Perfil' },
      ];
  
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-collapsed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <img src="/logo.png" alt="MyBestAngel" />
          <span className="logo-text">MyBestAngel</span>
        </div>
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <i className={`fas ${isOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
        </div>
      </div>
      
      <div className="sidebar-menu">
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <Link to={item.to} className={isActive(item.to)}>
                <span className="menu-icon">
                  <i className={`fas ${item.icon}`}></i>
                </span>
                <span className="menu-text">{item.text}</span>
              </Link>
            </li>
          ))}
          <li>
            <a href="#" onClick={(e) => { e.preventDefault(); logout(); }}>
              <span className="menu-icon">
                <i className="fas fa-sign-out-alt"></i>
              </span>
              <span className="menu-text">Sair</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div className="user-info">
        <img src={user?.profile_image || '/assets/default-avatar.png'} alt={user?.name} />
        <div className="user-details">
          <h6 className="mb-0">{user?.name}</h6>
          <small>{userType === 'angel' ? 'Guia' : 'Visitante'}</small>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;