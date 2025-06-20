import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const RealTimeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  
  // Simular recebimento de notificações (em um app real, isso seria via WebSockets)
  useEffect(() => {
    // Exemplo de notificações
    const sampleNotifications = [
      {
        id: 1,
        type: 'tour_created',
        title: 'Novo Tour Disponível',
        message: 'Seu Angel criou o tour "Mercado Ver-o-Peso"',
        time: '10 minutos atrás',
        read: false,
        link: '/visitor/tour/1'
      },
      {
        id: 2,
        type: 'tour_updated',
        title: 'Tour Atualizado',
        message: 'Seu Angel atualizou informações do tour "Museu Emílio Goeldi"',
        time: '1 hora atrás',
        read: false,
        link: '/visitor/tour/3'
      },
      {
        id: 3,
        type: 'message',
        title: 'Nova Mensagem',
        message: 'Você recebeu uma nova mensagem do seu Angel',
        time: '2 horas atrás',
        read: true,
        link: '/visitor/messages'
      }
    ];
    
    setNotifications(sampleNotifications);
    setUnreadCount(sampleNotifications.filter(n => !n.read).length);
  }, []);
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    
    if (!showDropdown) {
      // Marcar como lidas quando abrir dropdown
      const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
  };
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'tour_created':
        return 'fas fa-map-marked-alt';
      case 'tour_updated':
        return 'fas fa-edit';
      case 'message':
        return 'fas fa-envelope';
      default:
        return 'fas fa-bell';
    }
  };
  
  return (
    <div className="notification-widget">
      <button 
        className="btn btn-link position-relative"
        onClick={toggleDropdown}
      >
        <i className="fas fa-bell"></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
            {unreadCount}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h6 className="mb-0">Notificações</h6>
          </div>
          
          <div className="notification-body">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <Link 
                  key={notification.id}
                  to={notification.link}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                >
                  <div className="notification-icon">
                    <i className={getNotificationIcon(notification.type)}></i>
                  </div>
                  <div className="notification-content">
                    <h6 className="notification-title">{notification.title}</h6>
                    <p className="notification-message">{notification.message}</p>
                    <small className="notification-time">{notification.time}</small>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-3">
                <i className="fas fa-bell-slash mb-2"></i>
                <p className="mb-0">Nenhuma notificação</p>
              </div>
            )}
          </div>
          
          <div className="notification-footer">
            <Link to="/visitor/notifications" className="btn btn-sm btn-outline-primary w-100">
              Ver Todas
            </Link>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .notification-widget {
          position: relative;
        }
        
        .notification-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          width: 320px;
          background: white;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          z-index: 1000;
        }
        
        .notification-header {
          padding: 12px 15px;
          border-bottom: 1px solid #eee;
        }
        
        .notification-body {
          max-height: 320px;
          overflow-y: auto;
        }
        
        .notification-item {
          display: flex;
          padding: 12px 15px;
          border-bottom: 1px solid #f5f5f5;
          text-decoration: none;
          color: inherit;
          transition: background-color 0.2s;
        }
        
        .notification-item:hover {
          background-color: #f8f9fa;
        }
        
        .notification-item.unread {
          background-color: #f0f7ff;
        }
        
        .notification-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(22, 160, 133, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          margin-right: 15px;
          flex-shrink: 0;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-title {
          font-size: 14px;
          margin-bottom: 2px;
        }
        
        .notification-message {
          font-size: 13px;
          color: #6c757d;
          margin-bottom: 2px;
        }
        
        .notification-time {
          font-size: 12px;
          color: #adb5bd;
        }
        
        .notification-footer {
          padding: 12px 15px;
          border-top: 1px solid #eee;
        }
      `}</style>
    </div>
  );
};

export default RealTimeNotifications;