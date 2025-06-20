import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const VisitorNotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Em uma aplicação real, buscaria as notificações do backend
    // Simulação de notificações para demonstração
    setTimeout(() => {
      const mockNotifications = [
        {
          id: 1,
          type: 'tour_created',
          title: 'Novo Tour Disponível',
          message: 'Seu Angel criou o tour "Mercado Ver-o-Peso"',
          time: '10/05/2025 14:30',
          read: true,
          link: '/visitor/tour/1'
        },
        {
          id: 2,
          type: 'tour_updated',
          title: 'Tour Atualizado',
          message: 'Seu Angel atualizou informações do tour "Museu Emílio Goeldi"',
          time: '09/05/2025 10:15',
          read: true,
          link: '/visitor/tour/3'
        },
        {
          id: 3,
          type: 'message',
          title: 'Nova Mensagem',
          message: 'Você recebeu uma nova mensagem do seu Angel',
          time: '08/05/2025 16:45',
          read: true,
          link: '/visitor/messages'
        },
        {
          id: 4,
          type: 'tour_reminder',
          title: 'Lembrete de Tour',
          message: 'Seu tour "Estação das Docas" está agendado para amanhã',
          time: '07/05/2025 09:00',
          read: false,
          link: '/visitor/tour/2'
        },
        {
          id: 5,
          type: 'tour_booking',
          title: 'Reserva Confirmada',
          message: 'Sua reserva para o tour "Basílica de Nazaré" foi confirmada',
          time: '05/05/2025 11:30',
          read: false,
          link: '/visitor/tour/4'
        }
      ];
      
      setNotifications(mockNotifications);
      setLoading(false);
    }, 800);
  }, []);
  
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'tour_created':
        return 'fas fa-map-marked-alt';
      case 'tour_updated':
        return 'fas fa-edit';
      case 'message':
        return 'fas fa-envelope';
      case 'tour_reminder':
        return 'fas fa-clock';
      case 'tour_booking':
        return 'fas fa-ticket-alt';
      default:
        return 'fas fa-bell';
    }
  };
  
  const markAsRead = (id) => {
    // Em uma aplicação real, enviaria uma requisição para o backend
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? {...notification, read: true} : notification
      )
    );
  };
  
  const markAllAsRead = () => {
    // Em uma aplicação real, enviaria uma requisição para o backend
    setNotifications(prev => 
      prev.map(notification => ({...notification, read: true}))
    );
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando notificações...</p>
        </div>
      </div>
    );
  }
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 mb-0">Notificações</h1>
          {unreadCount > 0 && (
            <p className="text-muted mb-0">
              Você tem {unreadCount} notificações não lidas
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            className="btn btn-outline-primary"
            onClick={markAllAsRead}
          >
            <i className="fas fa-check-double me-2"></i>
            Marcar todas como lidas
          </button>
        )}
      </div>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          {notifications.length > 0 ? (
            <div className="notifications-list">
              {notifications.map(notification => (
                <Link 
                  key={notification.id}
                  to={notification.link}
                  className={`notification-item ${!notification.read ? 'unread' : ''}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    <i className={getNotificationIcon(notification.type)}></i>
                  </div>
                  <div className="notification-content">
                    <h6 className="notification-title">{notification.title}</h6>
                    <p className="notification-message">{notification.message}</p>
                    <small className="notification-time">{notification.time}</small>
                  </div>
                  {!notification.read && (
                    <span className="unread-badge"></span>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center p-5">
              <i className="fas fa-bell-slash fa-3x mb-3 text-muted"></i>
              <h4>Nenhuma notificação</h4>
              <p className="text-muted">
                Você não tem notificações no momento.
              </p>
            </div>
          )}
        </div>
      </div>
      
      <style jsx>{`
        .notifications-list {
          max-height: 600px;
          overflow-y: auto;
        }
        
        .notification-item {
          display: flex;
          padding: 20px;
          border-bottom: 1px solid #f5f5f5;
          text-decoration: none;
          color: inherit;
          transition: background-color 0.2s;
          position: relative;
        }
        
        .notification-item:hover {
          background-color: #f8f9fa;
        }
        
        .notification-item.unread {
          background-color: #f0f7ff;
        }
        
        .notification-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(22, 160, 133, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          margin-right: 20px;
          flex-shrink: 0;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-title {
          font-size: 16px;
          margin-bottom: 5px;
        }
        
        .notification-message {
          font-size: 14px;
          color: #6c757d;
          margin-bottom: 5px;
        }
        
        .notification-time {
          font-size: 12px;
          color: #adb5bd;
        }
        
        .unread-badge {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--primary-color);
          position: absolute;
          top: 50%;
          right: 20px;
          transform: translateY(-50%);
        }
      `}</style>
    </div>
  );
};

export default VisitorNotificationsPage;