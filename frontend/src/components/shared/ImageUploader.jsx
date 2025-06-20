import { useState } from 'react';

const ImageUploader = ({ onImageSelect, currentImage, disabled = false }) => {
  const [preview, setPreview] = useState(currentImage);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Validar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }
      
      // Validar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.');
        return;
      }
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Simular upload
      setUploading(true);
      setTimeout(() => {
        setUploading(false);
        if (onImageSelect) {
          onImageSelect(file, URL.createObjectURL(file));
        }
      }, 1500);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (onImageSelect) {
      onImageSelect(null, null);
    }
  };

  return (
    <div className="image-uploader">
      <div className="text-center mb-3">
        {preview ? (
          <div className="position-relative d-inline-block">
            <img 
              src={preview} 
              alt="Preview" 
              className="img-fluid rounded"
              style={{ maxHeight: '200px', maxWidth: '100%' }}
            />
            {!disabled && (
              <button 
                type="button"
                className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                onClick={handleRemoveImage}
                title="Remover imagem"
              >
                <i className="fas fa-times"></i>
              </button>
            )}
            {uploading && (
              <div className="position-absolute top-50 start-50 translate-middle">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Enviando...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div 
            className="bg-light border-2 border-dashed rounded d-flex flex-column justify-content-center align-items-center"
            style={{ height: '200px', borderColor: '#dee2e6' }}
          >
            <i className="fas fa-cloud-upload-alt fa-3x text-muted mb-2"></i>
            <p className="text-muted mb-0">Nenhuma imagem selecionada</p>
          </div>
        )}
      </div>
      
      {!disabled && (
        <div className="d-grid">
          <label className="btn btn-outline-primary">
            <i className="fas fa-upload me-2"></i>
            {preview ? 'Alterar Imagem' : 'Selecionar Imagem'}
            <input 
              type="file" 
              className="d-none"
              accept="image/*"
              onChange={handleFileSelect}
              disabled={uploading}
            />
          </label>
        </div>
      )}
      
      {uploading && (
        <div className="text-center mt-2">
          <small className="text-muted">Enviando imagem...</small>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;