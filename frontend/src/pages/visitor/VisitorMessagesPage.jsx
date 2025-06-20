import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

const VisitorMessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [angelInfo, setAngelInfo] = useState({});
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/visitor/messages');
        setMessages(response.data.data.messages || []);
        setAngelInfo({
          id: response.data.data.angelId,
          name: response.data.data.angelName
        });
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar mensagens:', error);
        setError('Não foi possível carregar as mensagens. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchMessages();
    
    // Poll for new messages every 30 seconds
    const interval = setInterval(() => {
      fetchNewMessages();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    // Scroll to bottom whenever messages change
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const fetchNewMessages = async () => {
    try {
      const response = await api.get('/visitor/messages');
      setMessages(response.data.data.messages || []);
    } catch (error) {
      console.error('Erro ao buscar novas mensagens:', error);
    }
  };
  
  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) {
      return;
    }
    
    try {
      setSending(true);
      
      await api.post('/visitor/messages', {
        content: newMessage
      });
      
      // Add the message to the UI immediately
      const newMessageObj = {
        id: Date.now(), // Temporary ID
        content: newMessage,
        isFromVisitor: true,
        created_at: new Date().toISOString(),
        formattedDate: new Date().toLocaleString()
      };
      
      setMessages([...messages, newMessageObj]);
      setNewMessage('');
      setSending(false);
      
      // Scroll to bottom
      scrollToBottom();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError('Não foi possível enviar a mensagem. Tente novamente.');
      setSending(false);
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando suas mensagens...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Mensagens</h1>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body">
          {/* Angel Info */}
          <div className="angel-header p-3 mb-3 border-bottom">
            <div className="d-flex align-items-center">
              <div className="avatar-circle me-3">
                <i className="fas fa-user-tie"></i>
              </div>
              <div>
                <h5 className="mb-0">{angelInfo.name}</h5>
                <small className="text-muted">Seu Angel</small>
              </div>
            </div>
          </div>
          
          {/* Messages */}
          <div className="messages-container">
            {messages.length > 0 ? (
              <div className="messages">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`message ${message.isFromVisitor ? 'outgoing' : 'incoming'}`}
                  >
                    <div className="message-content">
                      <p>{message.content}</p>
                      <div className="message-time">
                        <small className="text-muted">
                          {formatDate(message.created_at)}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="text-center p-5">
                <i className="fas fa-comment-dots fa-3x mb-3 text-muted"></i>
                <h4>Nenhuma mensagem</h4>
                <p className="text-muted">
                  Comece a conversar com seu Angel enviando uma mensagem abaixo.
                </p>
              </div>
            )}
          </div>
          
          {/* Message Input */}
          <div className="messages-footer p-3 border-top mt-3">
            {error && (
              <div className="alert alert-danger py-2 mb-2" role="alert">
                {error}
              </div>
            )}
            <form onSubmit={handleSendMessage}>
              <div className="input-group">
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Digite sua mensagem..." 
                  value={newMessage}
                  onChange={handleNewMessageChange}
                  disabled={sending}
                />
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={!newMessage.trim() || sending}
                >
                  {sending ? (
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  ) : (
                    <i className="fas fa-paper-plane"></i>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      {/* Tips */}
      <div className="card border-0 shadow-sm mt-4">
        <div className="card-body">
          <h5 className="card-title">
            <i className="fas fa-lightbulb me-2 text-warning"></i>
            Dicas de Comunicação
          </h5>
          <div className="row g-3 mt-2">
            <div className="col-md-4">
              <div className="d-flex">
                <div className="tip-icon me-3">
                  <i className="fas fa-bell"></i>
                </div>
                <div>
                  <h6>Resposta Rápida</h6>
                  <p className="small text-muted mb-0">
                    Seu Angel geralmente responde em até 2 horas durante o dia.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex">
                <div className="tip-icon me-3">
                  <i className="fas fa-language"></i>
                </div>
                <div>
                  <h6>Idioma</h6>
                  <p className="small text-muted mb-0">
                    Comunique-se no idioma configurado em seu perfil para melhor compreensão.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex">
                <div className="tip-icon me-3">
                  <i className="fas fa-exclamation-circle"></i>
                </div>
                <div>
                  <h6>Emergências</h6>
                  <p className="small text-muted mb-0">
                    Para emergências, use os contatos da seção de Emergência.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .avatar-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: rgba(22, 160, 133, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary-color);
          font-size: 1.2rem;
        }
        
        .messages-container {
          height: 400px;
          overflow-y: auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        
        .messages {
          display: flex;
          flex-direction: column;
        }
        
        .message {
          max-width: 70%;
          margin-bottom: 20px;
          display: flex;
        }
        
        .message.incoming {
          align-self: flex-start;
        }
        
        .message.outgoing {
          align-self: flex-end;
        }
        
        .message-content {
          padding: 10px 15px;
          border-radius: 18px;
          position: relative;
        }
        
        .incoming .message-content {
          background-color: white;
          border: 1px solid #e0e0e0;
          border-top-left-radius: 5px;
        }
        
        .outgoing .message-content {
          background-color: var(--primary-color);
          color: white;
          border-top-right-radius: 5px;
        }
        
        .message-content p {
          margin-bottom: 5px;
        }
        
        .message-time {
          text-align: right;
        }
        
        .outgoing .message-time {
          color: rgba(255, 255, 255, 0.7);
        }
        
        .tip-icon {
          width: 36px;
          height: 36px;
          background-color: rgba(22, 160, 133, 0.1);
          color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </div>
  );
};

export default VisitorMessagesPage;