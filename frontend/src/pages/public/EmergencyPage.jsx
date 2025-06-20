import { Link } from 'react-router-dom';

const EmergencyPage = () => {
  return (
    <>
      {/* Header Banner */}
      <div className="bg-danger text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">Informações de Emergência</h1>
              <p className="lead mb-0">
                Números e contatos importantes para sua segurança durante sua estadia em Belém
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            {/* Emergency Numbers */}
            <div className="col-lg-8">
              <h2 className="section-title">Telefones de Emergência</h2>
              
              <div className="row g-4 mb-5">
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="emergency-icon bg-danger text-white me-3">
                          <i className="fas fa-ambulance"></i>
                        </div>
                        <h3 className="card-title h5 mb-0">Emergência Médica</h3>
                      </div>
                      <p className="emergency-number">192</p>
                      <p className="text-muted small mb-0">
                        SAMU (Serviço de Atendimento Móvel de Urgência)
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="emergency-icon bg-danger text-white me-3">
                          <i className="fas fa-fire-extinguisher"></i>
                        </div>
                        <h3 className="card-title h5 mb-0">Bombeiros</h3>
                      </div>
                      <p className="emergency-number">193</p>
                      <p className="text-muted small mb-0">
                        Corpo de Bombeiros - Emergências, Resgate e Incêndios
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="emergency-icon bg-danger text-white me-3">
                          <i className="fas fa-shield-alt"></i>
                        </div>
                        <h3 className="card-title h5 mb-0">Polícia Militar</h3>
                      </div>
                      <p className="emergency-number">190</p>
                      <p className="text-muted small mb-0">
                        Emergências policiais, crimes e segurança pública
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="emergency-icon bg-danger text-white me-3">
                          <i className="fas fa-user-shield"></i>
                        </div>
                        <h3 className="card-title h5 mb-0">Polícia Civil</h3>
                      </div>
                      <p className="emergency-number">197</p>
                      <p className="text-muted small mb-0">
                        Denúncias e registros de ocorrências
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="emergency-icon bg-danger text-white me-3">
                          <i className="fas fa-road"></i>
                        </div>
                        <h3 className="card-title h5 mb-0">Defesa Civil</h3>
                      </div>
                      <p className="emergency-number">199</p>
                      <p className="text-muted small mb-0">
                        Emergências relacionadas a desastres naturais
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <div className="d-flex align-items-center mb-3">
                        <div className="emergency-icon bg-info text-white me-3">
                          <i className="fas fa-globe"></i>
                        </div>
                        <h3 className="card-title h5 mb-0">Emergência Internacional</h3>
                      </div>
                      <p className="emergency-number">112</p>
                      <p className="text-muted small mb-0">
                        Número de emergência internacional (redireciona para serviços locais)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Hospitals */}
              <h2 className="section-title">Hospitais Próximos</h2>
              
              <div className="table-responsive mb-5">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Hospital</th>
                      <th>Endereço</th>
                      <th>Telefone</th>
                      <th>Distância do Centro</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Hospital Pronto Socorro Municipal Mário Pinotti</td>
                      <td>Av. 14 de Março, s/n - Umarizal</td>
                      <td>(91) 3252-6110</td>
                      <td>1,5 km</td>
                    </tr>
                    <tr>
                      <td>Hospital Regional Dr. Abelardo Santos</td>
                      <td>Av. Augusto Montenegro, km 13 - Icoaraci</td>
                      <td>(91) 3199-9300</td>
                      <td>14 km</td>
                    </tr>
                    <tr>
                      <td>Hospital de Pronto Socorro Municipal Dr. Humberto Maradei Pereira</td>
                      <td>R. Rodovia BR-316, km 01 - Guanabara</td>
                      <td>(91) 3261-3672</td>
                      <td>8 km</td>
                    </tr>
                    <tr>
                      <td>Hospital Público Estadual Galileu</td>
                      <td>Rodovia BR-316, km 01 - Guanabara</td>
                      <td>(91) 3084-0300</td>
                      <td>8 km</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Pharmacies */}
              <h2 className="section-title">Farmácias 24h</h2>
              
              <div className="table-responsive mb-5">
                <table className="table table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Farmácia</th>
                      <th>Endereço</th>
                      <th>Telefone</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Drogasil 24h</td>
                      <td>Av. Presidente Vargas, 158 - Campina</td>
                      <td>(91) 3222-0884</td>
                    </tr>
                    <tr>
                      <td>Extrafarma 24h</td>
                      <td>Av. Almirante Barroso, 500 - Marco</td>
                      <td>(91) 3199-9300</td>
                    </tr>
                    <tr>
                      <td>Farmácia Pague Menos 24h</td>
                      <td>Av. Visconde de Souza Franco, 776 - Reduto</td>
                      <td>(91) 3222-0600</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              {/* Emergency Tips */}
              <h2 className="section-title">Dicas de Segurança</h2>
              
              <div className="card border-0 shadow-sm mb-5">
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <div className="tip-icon bg-primary text-white">
                            <i className="fas fa-map-marked-alt"></i>
                          </div>
                        </div>
                        <div>
                          <h5>Conheça os Locais</h5>
                          <p className="mb-0">
                            Familiarize-se com as áreas ao redor do seu hotel e dos locais da conferência. 
                            Utilize aplicativos de mapa que funcionem offline.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <div className="tip-icon bg-primary text-white">
                            <i className="fas fa-taxi"></i>
                          </div>
                        </div>
                        <div>
                          <h5>Transporte Seguro</h5>
                          <p className="mb-0">
                            Utilize serviços de táxi oficiais ou aplicativos de transporte reconhecidos. 
                            Evite pegar caronas não autorizadas.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <div className="tip-icon bg-primary text-white">
                            <i className="fas fa-wallet"></i>
                          </div>
                        </div>
                        <div>
                          <h5>Cuidado com Pertences</h5>
                          <p className="mb-0">
                            Mantenha seus documentos, dinheiro e eletrônicos em local seguro. 
                            Use o cofre do hotel quando disponível.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="col-md-6">
                      <div className="d-flex">
                        <div className="flex-shrink-0 me-3">
                          <div className="tip-icon bg-primary text-white">
                            <i className="fas fa-tint"></i>
                          </div>
                        </div>
                        <div>
                          <h5>Hidratação</h5>
                          <p className="mb-0">
                            Belém possui clima quente e úmido. Beba bastante água e 
                            use protetor solar, mesmo em dias nublados.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* CTA */}
              <div className="alert alert-primary d-flex align-items-center" role="alert">
                <i className="fas fa-info-circle fa-2x me-3"></i>
                <div>
                  <h5 className="alert-heading">Acompanhado por um Angel</h5>
                  <p className="mb-0">
                    Com o MyBestAngel, você terá um guia local que conhece bem a cidade e pode 
                    ajudar em situações de emergência. Nossos Angels são treinados para oferecer
                    assistência e orientações de segurança durante sua estadia.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="col-lg-4">
              {/* Emergency App */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title mb-3">
                    <i className="fas fa-mobile-alt text-primary me-2"></i>
                    App de Emergência
                  </h4>
                  <p className="card-text">
                    Baixe o aplicativo oficial da COP30 que inclui recursos de segurança, mapas offline 
                    e botão de emergência que conecta diretamente com os serviços locais.
                  </p>
                  <div className="d-grid gap-2">
                    <a href="#" className="btn btn-primary">
                      <i className="fab fa-google-play me-2"></i>
                      Google Play
                    </a>
                    <a href="#" className="btn btn-primary">
                      <i className="fab fa-apple me-2"></i>
                      App Store
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Emergency Contacts */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title mb-3">
                    <i className="fas fa-phone-alt text-primary me-2"></i>
                    Contatos Úteis
                  </h4>
                  <ul className="list-group list-group-flush">
                    <li className="list-group-item px-0">
                      <div className="d-flex justify-content-between">
                        <span>Embaixada Americana</span>
                        <a href="tel:+556132474330" className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-phone-alt"></i>
                        </a>
                      </div>
                      <small className="text-muted">+55 61 3247-4330</small>
                    </li>
                    <li className="list-group-item px-0">
                      <div className="d-flex justify-content-between">
                        <span>Embaixada Britânica</span>
                        <a href="tel:+556133292300" className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-phone-alt"></i>
                        </a>
                      </div>
                      <small className="text-muted">+55 61 3329-2300</small>
                    </li>
                    <li className="list-group-item px-0">
                      <div className="d-flex justify-content-between">
                        <span>Secretaria de Turismo</span>
                        <a href="tel:+559132557341" className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-phone-alt"></i>
                        </a>
                      </div>
                      <small className="text-muted">+55 91 3255-7341</small>
                    </li>
                    <li className="list-group-item px-0">
                      <div className="d-flex justify-content-between">
                        <span>Polícia Turística</span>
                        <a href="tel:+559132226339" className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-phone-alt"></i>
                        </a>
                      </div>
                      <small className="text-muted">+55 91 3222-6339</small>
                    </li>
                    <li className="list-group-item px-0">
                      <div className="d-flex justify-content-between">
                        <span>Aeroporto Internacional</span>
                        <a href="tel:+559132106000" className="btn btn-sm btn-outline-primary">
                          <i className="fas fa-phone-alt"></i>
                        </a>
                      </div>
                      <small className="text-muted">+55 91 3210-6000</small>
                    </li>
                  </ul>
                </div>
              </div>
              
              {/* Map */}
              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                  <h4 className="card-title mb-3">
                    <i className="fas fa-map-marked-alt text-primary me-2"></i>
                    Mapa de Emergência
                  </h4>
                  <div className="ratio ratio-4x3 mb-3">
                    <iframe 
                      src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d63835.93762479702!2d-48.50721042089843!3d-1.4522289999999946!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1shospitais%20em%20bel%C3%A9m!5e0!3m2!1spt-BR!2sbr!4v1668802678167!5m2!1spt-BR!2sbr" 
                      width="100%" 
                      height="100%" 
                      style={{ border: 0 }} 
                      allowFullScreen 
                      loading="lazy" 
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Mapa de Hospitais em Belém"
                    ></iframe>
                  </div>
                  <div className="d-grid">
                    <Link to="/map" className="btn btn-outline-primary">
                      <i className="fas fa-map me-2"></i>
                      Ver Mapa Completo
                    </Link>
                  </div>
                </div>
              </div>
              
              {/* Find Angel */}
              <div className="card border-0 shadow-sm bg-primary text-white">
                <div className="card-body text-center p-4">
                  <div className="mb-3">
                    <i className="fas fa-user-tie fa-3x"></i>
                  </div>
                  <h4 className="card-title">Viaje com Segurança</h4>
                  <p className="card-text">
                    Com um Angel local, você terá acesso a informações privilegiadas 
                    sobre a cidade e suporte em emergências durante sua estadia.
                  </p>
                  <Link to="/auth/register" className="btn btn-light w-100">
                    Encontre seu Angel
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Additional CSS */}
      <style jsx>{`
        .section-title {
          position: relative;
          padding-bottom: 15px;
          margin-bottom: 30px;
        }
        
        .section-title:after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 50px;
          height: 3px;
          background-color: var(--primary-color);
        }
        
        .emergency-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
        }
        
        .emergency-number {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--dark-color);
          margin-bottom: 0.2rem;
        }
        
        .tip-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </>
  );
};

export default EmergencyPage;