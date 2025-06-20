import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import ImageUploader from '/src/components/shared/ImageUploader';

const AngelProfilePage = () => {
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
    bio: '',
    languages: '',
    specialty: ''
  });
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/angel/profile');
        const profileData = response.data.data.angel;
        
        setProfile(profileData);
        setFormData({
          name: profileData.name || '',
          email: profileData.email || '',
          phone: profileData.phone || '',
          bio: profileData.bio || '',
          languages: profileData.languages || '',
          specialty: profileData.specialty || ''
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
      
      await api.put('/angel/profile', formData);
      
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
                    <i className="fas fa-user-tie fa-4x text-primary"></i>
                  </div>
                )}
              </div>
              <h3 className="mb-1">{profile.name}</h3>
              <p className="text-muted mb-3">Angel (Guia Turístico)</p>
              <div className="mb-3">
                <span className="badge bg-primary me-2">
                  <i className="fas fa-star me-1"></i>
                  {profile.rating.toFixed(1)}
                </span>
                <span className="badge bg-secondary">
                  <i className="fas fa-comment me-1"></i>
                  {profile.reviews_count} avaliações
                </span>
              </div>
              <button className="btn btn-primary d-block w-100 mb-2">
                <i className="fas fa-camera me-2"></i>
                Alterar Foto
              </button>
              <button className="btn btn-outline-secondary d-block w-100">
                <i className="fas fa-eye me-2"></i>
                Visualizar como Visitante
              </button>
            </div>
          </div>
          
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h4 className="card-title mb-3">Status da Conta</h4>
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-success me-3" style={{ width: '10px', height: '10px' }}></div>
                <span>Conta Ativa</span>
              </div>
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-success me-3" style={{ width: '10px', height: '10px' }}></div>
                <span>Verificação Completa</span>
              </div>
              <div className="d-flex align-items-center">
                <div className="rounded-circle bg-success me-3" style={{ width: '10px', height: '10px' }}></div>
                <span>Disponível para Novos Visitantes</span>
              </div>
              
              <hr className="my-4" />
              
              <h5 className="mb-3">Visitantes Afiliados</h5>
              <div className="mb-4">
                <div className="progress mb-2">
                  <div 
                    className="progress-bar bg-primary" 
                    role="progressbar" 
                    style={{ width: `${(profile.visitors_count / 3) * 100}%` }}
                    aria-valuenow={profile.visitors_count} 
                    aria-valuemin="0" 
                    aria-valuemax="3"
                  >
                    {profile.visitors_count}/3
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <small className="text-muted">Visitantes Atuais</small>
                  <small className="text-muted">Máximo: 3</small>
                </div>
              </div>
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
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="specialty" className="form-label">Especialidade</label>
                    <select
                      className="form-select"
                      id="specialty"
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleChange}
                    >
                      <option value="">Selecione uma especialidade</option>
                      <option value="Gastronomia">Gastronomia</option>
                      <option value="Cultura">Cultura</option>
                      <option value="História">História</option>
                      <option value="Ecoturismo">Ecoturismo</option>
                      <option value="Aventura">Aventura</option>
                      <option value="Compras">Compras</option>
                    </select>
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label htmlFor="languages" className="form-label">Idiomas Falados</label>
                    <input
                      type="text"
                      className="form-control"
                      id="languages"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      placeholder="Ex: Português, Inglês, Espanhol"
                    />
                  </div>
                  
                  <div className="col-12 mb-4">
                    <label htmlFor="bio" className="form-label">Biografia (Descrição Pessoal)</label>
                    <textarea
                      className="form-control"
                      id="bio"
                      name="bio"
                      rows="5"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Conte um pouco sobre você, sua experiência como guia e o que os visitantes podem esperar..."
                    ></textarea>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AngelProfilePage;