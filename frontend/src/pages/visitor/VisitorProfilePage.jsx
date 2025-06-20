import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const VisitorProfilePage = () => {
  const { user } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    languagePreference: ''
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/visitor/profile');
        const profileData = response.data.data;
        
        setProfile(profileData);
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          nationality: profileData.nationality || '',
          languagePreference: profileData.language_preference || ''
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar perfil:', error);
        setError('Não foi possível carregar seu perfil. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, []);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      await api.put('/visitor/profile', formData);
      
      // Show success message and reset after a few seconds
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
      
      setSaving(false);
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      setError('Erro ao atualizar perfil. Verifique os dados e tente novamente.');
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando seu perfil...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-4 mb-4 mb-lg-0">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body text-center p-4">
              <div className="mb-3">
                {profile.profile_image ? (
                  <img 
                    src={profile.profile_image} 
                    alt={profile.name} 
                    className="img-fluid rounded-circle"
                    style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                  />
                ) : (
                  <div 
                    className="rounded-circle bg-primary bg-opacity-10 d-inline-flex justify-content-center align-items-center"
                    style={{ width: '120px', height: '120px' }}
                  >
                    <i className="fas fa-user fa-4x text-primary"></i>
                  </div>
                )}
              </div>
              <h3 className="mb-1">{profile.name}</h3>
              <p className="text-muted mb-3">Visitor (Turista)</p>
              <button className="btn btn-primary d-block w-100">
                <i className="fas fa-camera me-2"></i>
                Alterar Foto
              </button>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title mb-3">Seu Angel</h4>
              
              {profile.angel_name ? (
                <div className="text-center">
                  <div className="mb-3">
                    {profile.angel_image ? (
                      <img 
                        src={profile.angel_image} 
                        alt={profile.angel_name} 
                        className="img-fluid rounded-circle"
                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                      />
                    ) : (
                      <div 
                        className="rounded-circle bg-primary bg-opacity-10 d-inline-flex justify-content-center align-items-center mx-auto"
                        style={{ width: '80px', height: '80px' }}
                      >
                        <i className="fas fa-user-tie fa-3x text-primary"></i>
                      </div>
                    )}
                  </div>
                  <h5>{profile.angel_name}</h5>
                  <div className="text-warning mb-3">
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star"></i>
                    <i className="fas fa-star-half-alt"></i>
                  </div>
                  <p className="mb-3">
                    <i className="fas fa-envelope me-2"></i>
                    {profile.angel_email}
                  </p>
                  <p className="mb-3">
                    <i className="fas fa-phone me-2"></i>
                    {profile.angel_phone || 'Telefone não disponível'}
                  </p>
                  <div className="d-grid gap-2">
                    <Link to="/visitor/messages" className="btn btn-outline-primary">
                      <i className="fas fa-envelope me-2"></i>
                      Enviar Mensagem
                    </Link>
                    <Link to="/visitor/available-tours" className="btn btn-outline-secondary">
                      <i className="fas fa-map-marked-alt me-2"></i>
                      Ver Tours Disponíveis
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="fas fa-user-tie fa-3x mb-3 text-muted"></i>
                  <h5>Você ainda não tem um Angel</h5>
                  <p className="mb-3">Escolha um Angel para te guiar em Belém durante a COP30.</p>
                  <Link to="/auth/register" className="btn btn-primary">
                    Encontrar um Angel
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h2 className="card-title mb-4">Meu Perfil</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="alert alert-success" role="alert">
                  Seu perfil foi atualizado com sucesso!
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">Nome Completo</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled
                    />
                    <small className="text-muted">Email não pode ser alterado</small>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">Telefone</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="nationality" className="form-label">Nacionalidade</label>
                    <input
                      type="text"
                      className="form-control"
                      id="nationality"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="col-12 mb-4">
                    <label htmlFor="languagePreference" className="form-label">Idioma Preferido</label>
                    <select
                      className="form-select"
                      id="languagePreference"
                      name="languagePreference"
                      value={formData.languagePreference}
                      onChange={handleChange}
                    >
                      <option value="">Selecione um idioma</option>
                      <option value="Português">Português</option>
                      <option value="Inglês">Inglês</option>
                      <option value="Espanhol">Espanhol</option>
                      <option value="Francês">Francês</option>
                      <option value="Alemão">Alemão</option>
                      <option value="Italiano">Italiano</option>
                      <option value="Japonês">Japonês</option>
                      <option value="Mandarim">Mandarim</option>
                      <option value="Russo">Russo</option>
                      <option value="Árabe">Árabe</option>
                    </select>
                  </div>
                </div>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <button 
                    type="submit" 
                    className="btn btn-primary px-4"
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </form>
              
              <hr className="my-4" />
              
              <div className="row">
                <div className="col-md-6">
                  <h4>Alterar Senha</h4>
                  <p className="text-muted">
                    Para alterar sua senha, preencha os campos abaixo:
                  </p>
                  
                  <div className="mb-3">
                    <label htmlFor="currentPassword" className="form-label">Senha Atual</label>
                    <input
                      type="password"
                      className="form-control"
                      id="currentPassword"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">Nova Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newPassword"
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                    />
                  </div>
                  
                  <button className="btn btn-primary">
                    <i className="fas fa-lock me-2"></i>
                    Alterar Senha
                  </button>
                </div>
                
                <div className="col-md-6">
                  <h4>Preferências de Notificação</h4>
                  <p className="text-muted">
                    Escolha como deseja receber notificações:
                  </p>
                  
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="emailNotifications" checked />
                    <label className="form-check-label" htmlFor="emailNotifications">
                      Notificações por Email
                    </label>
                  </div>
                  
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="smsNotifications" checked />
                    <label className="form-check-label" htmlFor="smsNotifications">
                      Notificações por SMS
                    </label>
                  </div>
                  
                  <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" id="pushNotifications" checked />
                    <label className="form-check-label" htmlFor="pushNotifications">
                      Notificações Push
                    </label>
                  </div>
                  
                  <button className="btn btn-primary">
                    <i className="fas fa-bell me-2"></i>
                    Salvar Preferências
                  </button>
                </div>
              </div>
              
              <hr className="my-4" />
              
              <div className="row">
                <div className="col-12">
                  <h4>Histórico de Atividades</h4>
                  <p className="text-muted mb-4">
                    Veja seu histórico recente de atividades na plataforma:
                  </p>
                  
                  <div className="table-responsive">
                    <table className="table">
                      <thead className="table-light">
                        <tr>
                          <th>Data</th>
                          <th>Atividade</th>
                          <th>Detalhes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>10/05/2025</td>
                          <td>Login</td>
                          <td>Login realizado com sucesso</td>
                        </tr>
                        <tr>
                          <td>09/05/2025</td>
                          <td>Reserva de Tour</td>
                          <td>Reserva para "Mercado Ver-o-Peso" confirmada</td>
                        </tr>
                        <tr>
                          <td>05/05/2025</td>
                          <td>Mensagem</td>
                          <td>Mensagem enviada para seu Angel</td>
                        </tr>
                        <tr>
                          <td>01/05/2025</td>
                          <td>Atualização de Perfil</td>
                          <td>Informações de perfil atualizadas</td>
                        </tr>
                        <tr>
                          <td>30/04/2025</td>
                          <td>Registro</td>
                          <td>Conta criada com sucesso</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisitorProfilePage;