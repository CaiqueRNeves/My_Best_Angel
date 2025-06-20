import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import AngelVisitorCard from '../../components/angel/AngelVisitorCard';

const AngelVisitorsPage = () => {
  const [visitors, setVisitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [visitorStats, setVisitorStats] = useState({
    total: 0,
    active: 0,
    pending: 0
  });
  
  useEffect(() => {
    const fetchVisitors = async () => {
      try {
        const response = await api.get('/angel/visitors');
        const visitorData = response.data.data || [];
        
        setVisitors(visitorData);
        
        // Calculate visitor stats
        const stats = {
          total: visitorData.length,
          active: visitorData.filter(v => v.tours_count > 0).length,
          pending: visitorData.filter(v => v.tours_count === 0).length
        };
        
        setVisitorStats(stats);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar visitantes:', error);
        setError('Não foi possível carregar os visitantes. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchVisitors();
  }, []);
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleOpenMessageModal = (visitor) => {
    setSelectedVisitor(visitor);
    setMessageModalOpen(true);
  };
  
  const handleCloseMessageModal = () => {
    setSelectedVisitor(null);
    setMessageText('');
    setMessageModalOpen(false);
  };
  
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedVisitor) {
      return;
    }
    
    try {
      setSendingMessage(true);
      
      await api.post('/angel/messages', {
        visitorId: selectedVisitor.id,
        content: messageText
      });
      
      alert('Mensagem enviada com sucesso!');
      handleCloseMessageModal();
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      alert('Não foi possível enviar a mensagem. Tente novamente mais tarde.');
    } finally {
      setSendingMessage(false);
    }
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  // Filter visitors based on search term and active tab
  const filteredVisitors = () => {
    let result = [...visitors];
    
    // Filter by tab
    if (activeTab === 'active') {
      result = result.filter(visitor => visitor.tours_count > 0);
    } else if (activeTab === 'pending') {
      result = result.filter(visitor => visitor.tours_count === 0);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        visitor => 
          visitor.name.toLowerCase().includes(term) || 
          visitor.email.toLowerCase().includes(term) ||
          (visitor.nationality && visitor.nationality.toLowerCase().includes(term))
      );
    }
    
    return result;
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando seus visitantes...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Meus Visitantes</h1>
      </div>
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {/* Visitor Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="stat-circle bg-primary bg-opacity-10 text-primary">
                  <i className="fas fa-users"></i>
                </div>
              </div>
              <div>
                <h6 className="card-subtitle text-muted">Total de Visitantes</h6>
                <h2 className="card-title h4 mb-0">{visitorStats.total}/3</h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="stat-circle bg-success bg-opacity-10 text-success">
                  <i className="fas fa-user-check"></i>
                </div>
              </div>
              <div>
                <h6 className="card-subtitle text-muted">Visitantes Ativos</h6>
                <h2 className="card-title h4 mb-0">{visitorStats.active}</h2>
              </div>
            </div>
          </div>
        </div>
        
        <div className="col-md-4">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body d-flex align-items-center">
              <div className="flex-shrink-0 me-3">
                <div className="stat-circle bg-warning bg-opacity-10 text-warning">
                  <i className="fas fa-user-clock"></i>
                </div>
              </div>
              <div>
                <h6 className="card-subtitle text-muted">Sem Reservas</h6>
                <h2 className="card-title h4 mb-0">{visitorStats.pending}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Visitor List */}
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-6">
              <ul className="nav nav-tabs card-header-tabs">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'all' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('all')}
                  >
                    <i className="fas fa-users me-2"></i>
                    Todos
                    {visitorStats.total > 0 && (
                      <span className="badge bg-primary ms-2">{visitorStats.total}</span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'active' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('active')}
                  >
                    <i className="fas fa-user-check me-2"></i>
                    Ativos
                    {visitorStats.active > 0 && (
                      <span className="badge bg-success ms-2">{visitorStats.active}</span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'pending' ? 'active' : ''}`} 
                    onClick={() => handleTabChange('pending')}
                  >
                    <i className="fas fa-user-clock me-2"></i>
                    Sem Reservas
                    {visitorStats.pending > 0 && (
                      <span className="badge bg-warning ms-2">{visitorStats.pending}</span>
                    )}
                  </button>
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <span className="input-group-text">
                  <i className="fas fa-search"></i>
                </span>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Buscar por nome, email ou nacionalidade..." 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-body">
          {filteredVisitors().length > 0 ? (
            <div className="visitor-list">
              {filteredVisitors().map((visitor) => (
                <AngelVisitorCard
                  key={visitor.id}
                  visitor={visitor}
                  onSendMessage={handleOpenMessageModal}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-5">
              <i className="fas fa-users fa-3x mb-3 text-muted"></i>
              <h4>Nenhum visitante encontrado</h4>
              <p className="text-muted">
                {searchTerm 
                  ? 'Nenhum visitante corresponde à sua busca.' 
                  : activeTab === 'active' 
                    ? 'Você não tem visitantes ativos.'
                    : activeTab === 'pending'
                      ? 'Você não tem visitantes sem reservas.'
                      : 'Você ainda não tem visitantes afiliados.'
                }
              </p>
            </div>
          )}
        </div>
        
        <div className="card-footer bg-white">
          <div className="text-muted small">
            <i className="fas fa-info-circle me-1"></i>
            Como Angel, você pode afiliar até 3 Visitors. Os visitantes escolhem seu Angel durante o cadastro.
          </div>
        </div>
      </div>
      
      {/* Send Message Modal */}
      {messageModalOpen && (
        <div className="modal-backdrop show">
          <div className="modal show d-block" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Enviar Mensagem</h5>
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={handleCloseMessageModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>
                    Enviar mensagem para <strong>{selectedVisitor?.name}</strong>
                  </p>
                  <div className="mb-3">
                    <label htmlFor="messageText" className="form-label">Mensagem</label>
                    <textarea
                      className="form-control"
                      id="messageText"
                      rows="4"
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Digite sua mensagem aqui..."
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleCloseMessageModal}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sendingMessage}
                  >
                    {sendingMessage ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Enviando...
                      </>
                    ) : (
                      'Enviar Mensagem'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .stat-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }
        
        .modal-backdrop {
          background-color: rgba(0, 0, 0, 0.5);
        }
        
        @media (min-width: 576px) {
          .modal-dialog {
            max-width: 500px;
            margin: 1.75rem auto;
          }
        }
        
        .visitor-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};

export default AngelVisitorsPage;