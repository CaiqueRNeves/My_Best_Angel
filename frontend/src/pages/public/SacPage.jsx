import { useState } from 'react';

const SacPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
    }, 1500);
  };
  
  const faqItems = [
    {
      question: 'O que é o MyBestAngel?',
      answer: 'MyBestAngel é um serviço que conecta visitantes de Belém a guias turísticos locais (chamados de Angels) durante a COP30. Oferecemos uma experiência personalizada para conhecer a cidade com um guia que entende a cultura e os melhores lugares.'
    },
    {
      question: 'Como funciona o sistema de reservas?',
      answer: 'Após criar sua conta como Visitor, você pode explorar os tours disponíveis oferecidos pelo seu Angel e fazer reservas diretamente pelo site ou aplicativo. As confirmações são enviadas por email e você pode acompanhar seus passeios agendados pelo dashboard.'
    },
    {
      question: 'Posso cancelar uma reserva?',
      answer: 'Sim, você pode cancelar reservas pelo seu dashboard de Visitor. Cancelamentos feitos com pelo menos 24 horas de antecedência recebem reembolso integral. Cancelamentos com menos de 24 horas estão sujeitos à política de cada Angel.'
    },
    {
      question: 'Como me torno um Angel?',
      answer: 'Para se tornar um Angel, você precisa se registrar na plataforma como guia, fornecer documentação válida, passar por um treinamento básico e ter conhecimento sobre Belém. Aceitamos novos Angels continuamente para atender a demanda durante a COP30.'
    },
    {
      question: 'Quais são os métodos de pagamento aceitos?',
      answer: 'Aceitamos a maioria dos cartões de crédito e débito internacionais, além de PIX para pagamentos nacionais. O pagamento é processado no momento da reserva para garantir sua vaga no tour.'
    },
    {
      question: 'O que fazer se tiver problemas durante um tour?',
      answer: 'Em caso de problemas durante um tour, entre em contato imediatamente com seu Angel. Se não for possível resolver diretamente, use o botão de emergência no aplicativo ou entre em contato com nosso suporte 24h pelos contatos disponíveis na seção de emergência.'
    },
  ];
  
  return (
    <>
      {/* Header Banner */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">SAC - Serviço de Atendimento ao Cliente</h1>
              <p className="lead mb-0">
                Estamos aqui para ajudar com qualquer dúvida ou problema que você possa ter
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* Contact Form */}
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4 p-md-5">
                  <h2 className="card-title mb-4">Entre em Contato</h2>
                  
                  {submitted ? (
                    <div className="text-center py-5">
                      <div className="mb-4">
                        <i className="fas fa-check-circle fa-5x text-success"></i>
                      </div>
                      <h3>Mensagem Enviada!</h3>
                      <p className="lead mb-4">
                        Agradecemos seu contato. Nossa equipe responderá em breve.
                      </p>
                      <button 
                        className="btn btn-primary"
                        onClick={() => {
                          setSubmitted(false);
                          setFormData({
                            name: '',
                            email: '',
                            phone: '',
                            subject: '',
                            message: ''
                          });
                        }}
                      >
                        Enviar Outra Mensagem
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
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
                      
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-3">
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
                      
                      <div className="mb-3">
                        <label htmlFor="subject" className="form-label">Assunto</label>
                        <select
                          className="form-select"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Selecione o assunto</option>
                          <option value="Dúvida">Dúvida</option>
                          <option value="Reserva">Problema com Reserva</option>
                          <option value="Pagamento">Pagamento</option>
                          <option value="Reclamação">Reclamação</option>
                          <option value="Sugestão">Sugestão</option>
                          <option value="Outros">Outros</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="message" className="form-label">Mensagem</label>
                        <textarea
                          className="form-control"
                          id="message"
                          name="message"
                          rows="5"
                          value={formData.message}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                      
                      <button 
                        type="submit" 
                        className="btn btn-primary w-100"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Enviando...
                          </>
                        ) : (
                          'Enviar Mensagem'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Info */}
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body p-4">
                  <h2 className="card-title mb-4">Informações de Contato</h2>
                  
                  <div className="d-flex mb-4">
                    <div className="contact-icon me-3">
                      <i className="fas fa-phone-alt"></i>
                    </div>
                    <div>
                      <h5>Telefone</h5>
                      <p className="mb-0">+55 (91) 3344-5566</p>
                      <p className="text-muted small mb-0">
                        Seg - Sex, 8:00 - 18:00 (horário local)
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-4">
                    <div className="contact-icon me-3">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div>
                      <h5>Email</h5>
                      <p className="mb-0">suporte@mybestangel.com</p>
                      <p className="text-muted small mb-0">
                        Resposta em até 24 horas
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex mb-4">
                    <div className="contact-icon me-3">
                      <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div>
                      <h5>Endereço</h5>
                      <p className="mb-0">
                        Av. Presidente Vargas, 800 - Campina<br />
                        Belém, PA, 66017-000
                      </p>
                    </div>
                  </div>
                  
                  <div className="d-flex">
                    <div className="contact-icon me-3">
                      <i className="fas fa-headset"></i>
                    </div>
                    <div>
                      <h5>Chat Ao Vivo</h5>
                      <p className="mb-2">Disponível 24/7 durante a COP30</p>
                      <button className="btn btn-outline-primary">
                        <i className="fas fa-comments me-2"></i>
                        Iniciar Chat
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h2 className="card-title mb-4">Siga-nos</h2>
                  
                  <div className="d-flex justify-content-between social-links">
                    <a href="#" className="social-link facebook">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                    <a href="#" className="social-link instagram">
                      <i className="fab fa-instagram"></i>
                    </a>
                    <a href="#" className="social-link twitter">
                      <i className="fab fa-twitter"></i>
                    </a>
                    <a href="#" className="social-link linkedin">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" className="social-link youtube">
                      <i className="fab fa-youtube"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto">
              <h2 className="text-center mb-5">Perguntas Frequentes</h2>
              
              <div className="accordion" id="faqAccordion">
                {faqItems.map((item, index) => (
                  <div className="accordion-item border-0 mb-3 shadow-sm" key={index}>
                    <h3 className="accordion-header" id={`heading${index}`}>
                      <button 
                        className="accordion-button collapsed bg-white" 
                        type="button" 
                        data-bs-toggle="collapse" 
                        data-bs-target={`#collapse${index}`} 
                        aria-expanded="false" 
                        aria-controls={`collapse${index}`}
                      >
                        {item.question}
                      </button>
                    </h3>
                    <div 
                      id={`collapse${index}`} 
                      className="accordion-collapse collapse" 
                      aria-labelledby={`heading${index}`} 
                      data-bs-parent="#faqAccordion"
                    >
                      <div className="accordion-body">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-5">
                <p className="lead mb-4">Não encontrou o que procurava?</p>
                <a href="#top" className="btn btn-primary">
                  <i className="fas fa-envelope me-2"></i>
                  Entre em Contato
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional CSS */}
      <style jsx>{`
        .contact-icon {
          width: 50px;
          height: 50px;
          background-color: rgba(22, 160, 133, 0.1);
          color: var(--primary-color);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }
        
        .social-links {
          display: flex;
          justify-content: space-between;
        }
        
        .social-link {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          color: white;
          transition: transform 0.3s ease;
        }
        
        .social-link:hover {
          transform: translateY(-5px);
        }
        
        .facebook {
          background-color: #3b5998;
        }
        
        .instagram {
          background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d);
        }
        
        .twitter {
          background-color: #1da1f2;
        }
        
        .linkedin {
          background-color: #0077b5;
        }
        
        .youtube {
          background-color: #ff0000;
        }
        
        .accordion-button:not(.collapsed) {
          color: var(--primary-color);
          background-color: rgba(22, 160, 133, 0.05);
        }
        
        .accordion-button:focus {
          border-color: rgba(22, 160, 133, 0.25);
          box-shadow: 0 0 0 0.25rem rgba(22, 160, 133, 0.25);
        }
      `}</style>
    </>
  );
};

export default SacPage;