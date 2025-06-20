import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

const AngelEditTourPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    duration: 60,
    price: 0,
    maxParticipants: 10,
    image: null
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);
  
  useEffect(() => {
    const fetchTourDetails = async () => {
      try {
        const response = await api.get(`/angel/tour/${id}`);
        const tour = response.data.data.tour;
        
        // Format date and time from date string
        const dateObj = new Date(tour.date);
        const formattedDate = dateObj.toISOString().split('T')[0];
        const formattedTime = dateObj.toTimeString().slice(0, 5);
        
        setFormData({
          title: tour.title,
          description: tour.description || '',
          location: tour.location,
          date: formattedDate,
          time: formattedTime,
          duration: tour.duration || 60,
          price: tour.price || 0,
          maxParticipants: tour.max_participants || 10,
          image: null
        });
        
        if (tour.image) {
          setOriginalImage(tour.image);
          setPreview(tour.image);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Erro ao carregar detalhes do tour:', error);
        setError('Não foi possível carregar os detalhes do tour. Tente novamente mais tarde.');
        setLoading(false);
      }
    };
    
    fetchTourDetails();
  }, [id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value === '' ? '' : Number(value)
    });
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveImage = () => {
    setFormData({
      ...formData,
      image: null
    });
    setPreview(null);
    setOriginalImage(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title.trim()) {
      setError('Por favor, informe o título do tour.');
      return;
    }
    
    if (!formData.location.trim()) {
      setError('Por favor, informe o local do tour.');
      return;
    }
    
    if (!formData.date) {
      setError('Por favor, informe a data do tour.');
      return;
    }
    
    if (!formData.time) {
      setError('Por favor, informe o horário do tour.');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // If there's a new image, we need to handle file upload
      let requestData = { ...formData };
      
      if (formData.image) {
        // In a real app, you'd upload the image to a server or cloud storage
        // and then store the URL in the database
        // For this example, we'll just simulate it by removing the image from the request
        const { image, ...rest } = requestData;
        requestData = rest;
        
        // Here you'd have code to upload the image and get a URL
        // const imageUrl = await uploadImage(image);
        // requestData.imageUrl = imageUrl;
      }
      
      // Update the tour
      await api.put(`/angel/tours/${id}`, requestData);
      
      // Redirect to the tour details page
      navigate(`/angel/tour/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar tour:', error);
      setError(
        error.response?.data?.message || 
        'Erro ao atualizar tour. Verifique os dados e tente novamente.'
      );
      setSaving(false);
    }
  };
  
  // Generate today's date in YYYY-MM-DD format for min date attribute
  const today = new Date().toISOString().split('T')[0];
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
          <p className="mt-2">Carregando detalhes do tour...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Editar Tour</h1>
        <Link to={`/angel/tour/${id}`} className="btn btn-outline-secondary">
          <i className="fas fa-arrow-left me-2"></i>
          Voltar para Detalhes do Tour
        </Link>
      </div>
      
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Basic Information */}
              <div className="col-lg-8">
                <h5 className="mb-3">Informações Básicas</h5>
                
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Título do Tour *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">Descrição</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Descreva os detalhes do tour, o que os visitantes vão conhecer, o que está incluído, etc."
                  ></textarea>
                </div>
                
                <div className="mb-3">
                  <label htmlFor="location" className="form-label">Local *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Ex: Mercado Ver-o-Peso, Belém, PA"
                    required
                  />
                </div>
                
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="date" className="form-label">Data *</label>
                    <input
                      type="date"
                      className="form-control"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={today}
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label htmlFor="time" className="form-label">Horário *</label>
                    <input
                      type="time"
                      className="form-control"
                      id="time"
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label htmlFor="duration" className="form-label">Duração (minutos)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleNumberChange}
                      min="15"
                      max="480"
                      step="15"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label htmlFor="price" className="form-label">Preço (R$)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleNumberChange}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="col-md-4 mb-3">
                    <label htmlFor="maxParticipants" className="form-label">Máximo de Participantes</label>
                    <input
                      type="number"
                      className="form-control"
                      id="maxParticipants"
                      name="maxParticipants"
                      value={formData.maxParticipants}
                      onChange={handleNumberChange}
                      min="1"
                      max="50"
                    />
                  </div>
                </div>
              </div>
              
              {/* Tour Image */}
              <div className="col-lg-4">
                <h5 className="mb-3">Imagem do Tour</h5>
                
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="text-center mb-3">
                      {preview ? (
                        <>
                          <img 
                            src={preview} 
                            alt="Preview" 
                            className="img-fluid rounded"
                            style={{ maxHeight: '200px' }}
                          />
                          <button 
                            type="button" 
                            className="btn btn-sm btn-outline-danger mt-2"
                            onClick={handleRemoveImage}
                          >
                            <i className="fas fa-trash me-1"></i>
                            Remover Imagem
                          </button>
                        </>
                      ) : (
                        <div 
                          className="bg-light rounded d-flex flex-column justify-content-center align-items-center"
                          style={{ height: '200px' }}
                        >
                          <i className="fas fa-image fa-3x text-secondary mb-2"></i>
                          <p className="text-muted">Nenhuma imagem selecionada</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mb-3">
                      <label htmlFor="image" className="form-label">
                        {originalImage ? 'Alterar Imagem' : 'Selecionar Imagem'}
                      </label>
                      <input 
                        type="file" 
                        className="form-control" 
                        id="image"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <h6 className="card-title">
                      <i className="fas fa-lightbulb text-warning me-2"></i>
                      Dicas para um Bom Tour
                    </h6>
                    <ul className="small text-muted mb-0">
                      <li>Seja específico sobre o que os visitantes vão conhecer</li>
                      <li>Mencione se há caminhadas ou trajetos longos</li>
                      <li>Informe se há restrições (idade, mobilidade, etc.)</li>
                      <li>Explique o que está incluído no preço</li>
                      <li>Destaque o que torna seu tour especial</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <hr className="my-4" />
            
            <div className="d-flex justify-content-between">
              <Link to={`/angel/tour/${id}`} className="btn btn-outline-secondary">
                Cancelar
              </Link>
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
        </div>
      </div>
    </div>
  );
};

export default AngelEditTourPage;