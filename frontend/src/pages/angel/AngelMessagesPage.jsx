import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

const AngelMessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get('/angel/messages');
        
        // Sort conversations by last message date
        const sortedConversations = response.data.data.conversations.sort((a, b) => {
          const lastMessageA = a.messages[a.messages.length - 1];
          const lastMessageB = b.messages[b.messages.length - 1];
          return new Date(lastMessageB.created_at) - new Date(lastMessageA.created_at);
        });
        
        setConversations(sortedConversations);
        
        // Select the first conversation if any exists
        if (sortedConversations.length > 0) {
          setSelectedVisitor(sortedConversations[0]);
          setMessages(sortedConversations[0].messages);
        }
        
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
      if (selectedVisitor) {
        fetchNewMessages(selectedVisitor.id);
      }
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
  
  const fetchNewMessages = async (visitorId) => {
    try {
      // In a real app, you would implement a way to fetch only new messages
      // For now, we'll just refetch all messages
      const response = await api.get('/angel/messages');
      
      const updatedConversations = response.data.data.conversations;
      setConversations(updatedConversations);
      
      // Update current conversation if we're viewing it
      if (selectedVisitor && selectedVisitor.id === visitorId) {
        const currentConversation = updatedConversations.find(c => c.id === visitorId);
        if (currentConversation) {
          setMessages(currentConversation.messages);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar novas mensagens:', error);
    }
  };
  
  const handleSelectVisitor = (visitor) => {
    setSelectedVisitor(visitor);
    setMessages(visitor.messages);
    setError(null);
  };
  
  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedVisitor) {
      return;
    }
    
    try {
      setSending(true);
      
      await api.post('/angel/messages', {
        visitorId: selectedVisitor.id,
        content: newMessage
      });
      
      // Add the message to the UI immediately
      const newMessageObj = {
        id: Date.now(), // Temporary ID
        content: newMessage,
        isFromAngel: true,
        created_at: new Date().toISOString(),
        formattedDate: new Date().toLocaleString()
      };
      
      setMessages([...messages, newMessageObj]);
      
      // Update conversations list
      setConversations(prevConversations => {
        const updatedConversations = [...prevConversations];
        const conversationIndex = updatedConversations.findIndex(c => c.id === selectedVisitor.id);
        
        if (conversationIndex !== -1) {
          updatedConversations[conversationIndex] = {
            ...updatedConversations[conversationIndex],
            messages: [...updatedConversations[conversationIndex].messages, newMessageObj]
          };
        }
        
        return updatedConversations;
      });
      
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
          <p className="mt-2">Carregando mensagens...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <h1 className="h3 mb-4">Mensagens</h1>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-0">
          <div className="row g-0">
            {/* Conversations List */}
            <div className="col-md-4 border-end">
              <div className="conversations-header">
                <h5 className="p-3 mb-0 border-bottom">Seus Visitantes</h5>
                <div className="p-3 border-bottom">
                  <div className="input-group">
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Buscar..."
                    />
                    <button className="btn btn-outline-secondary">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="conversations-list">
                {conversations.length > 0 ? (
                  conversations.map(visitor => (
                    <div 
                      key={visitor.id}
                      className={`conversation-item ${selectedVisitor?.id === visitor.id ? 'active' : ''}`}
                      onClick={() => handleSelectVisitor(visitor)}
                    >
                      <div className="conversation-avatar">
                        <div className="avatar-circle">
                          <i className="fas fa-user"></i>
                        </div>
                      </div>
                      <div className="conversation-details">
                        <div className="conversation-name">
                          <span>{visitor.name}</span>
                          {visitor.messages.some(m => !m.read && !m.isFromAngel) && (
                            <span className="badge bg-danger ms-2">Novo</span>
                          )}
                        </div>
                        <div className="conversation-last-message">
                          {visitor.messages.length > 0 ? (
                            <small className="text-truncate">
                              {visitor.messages[visitor.messages.length - 1].isFromAngel ? (
                                <span className="text-muted">Você: </span>
                              ) : null}
                              {visitor.messages[visitor.messages.length - 1].content}
                            </small>
                          ) : (
                            <small className="text-muted">Nenhuma mensagem</small>
                          )}
                        </div>
                      </div>
                      <div className="conversation-time">
                        {visitor.messages.length > 0 ? (
                          <small className="text-muted">
                            {new Date(visitor.messages[visitor.messages.length - 1].created_at).toLocaleTimeString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </small>
                        ) : null}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center p-4">
                    <i className="fas fa-comments fa-3x mb-3 text-muted"></i>
                    <p>Nenhuma conversa encontrada.</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Messages */}
            <div className="col-md-8">
              {selectedVisitor ? (
                <>
                  <div className="messages-header p-3 border-bottom">
                    <div className="d-flex align-items-center">
                      <div className="avatar-circle me-3">
                        <i className="fas fa-user"></i>
                      </div>
                      <div>
                        <h5 className="mb-0">{selectedVisitor.name}</h5>
                        <small className="text-muted">Visitante</small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="messages-container">
                    {messages.length > 0 ? (
                      <div className="messages">
                        {messages.map((message, index) => (
                          <div 
                            key={index} 
                            className={`message ${message.isFromAngel ? 'outgoing' : 'incoming'}`}
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
                        <p>Nenhuma mensagem com este visitante ainda.</p>
                        <p className="text-muted">Comece a conversa enviando uma mensagem!</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="messages-footer p-3 border-top">
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
                </>
              ) : (
                <div className="text-center p-5">
                  <i className="fas fa-comments fa-4x mb-3 text-muted"></i>
                  <h4>Nenhuma conversa selecionada</h4>
                  <p className="text-muted">
                    Selecione um visitante para visualizar as mensagens.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .conversations-list {
          height: 500px;
          overflow-y: auto;
        }
        
        .conversation-item {
          display: flex;
          align-items: center;
          padding: 15px;
          border-bottom: 1px solid #f1f1f1;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .conversation-item:hover {
          background-color: #f8f9fa;
        }
        
        .conversation-item.active {
          background-color: #f1f9f7;
          border-left: 3px solid var(--primary-color);
        }
        
        .conversation-avatar {
          margin-right: 15px;
          flex-shrink: 0;
        }
        
        .avatar-circle {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
          font-size: 1.2rem;
        }
        
        .conversation-details {
          flex: 1;
          min-width: 0; /* Enable text truncation */
        }
        
        .conversation-name {
          font-weight: 600;
          margin-bottom: 5px;
          display: flex;
          align-items: center;
        }
        
        .conversation-last-message {
          color: #6c757d;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .conversation-time {
          margin-left: 10px;
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
      `}</style>
    </div>
  );
};

export default AngelMessagesPage;