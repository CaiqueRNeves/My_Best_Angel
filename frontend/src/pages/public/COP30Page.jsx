import { Link } from 'react-router-dom';

const COP30Page = () => {
  return (
    <>
      {/* Header Banner */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">COP30 em Belém</h1>
              <p className="lead mb-0">
                Conferência das Nações Unidas sobre as Mudanças Climáticas 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="section-title">O que é a COP30?</h2>
              <p className="lead mb-4">
                A COP30 é a 30ª Conferência das Nações Unidas sobre as Mudanças Climáticas, que acontecerá 
                em Belém do Pará entre 10 e 21 de novembro de 2025.
              </p>
              <p className="mb-4">
                Este evento histórico representa a primeira vez que uma cidade da Amazônia sediará 
                uma COP, destacando a importância da maior floresta tropical do mundo para o equilíbrio 
                climático global e colocando a região amazônica no centro das discussões sobre 
                mudanças climáticas.
              </p>
              <p className="mb-4">
                Durante duas semanas, Belém receberá delegações oficiais de quase 200 países, 
                além de milhares de participantes, incluindo representantes da sociedade civil, 
                comunidades indígenas, cientistas, empresários e ambientalistas.
              </p>
              <p>
                A COP30 será um momento crucial para avaliar os avanços alcançados desde o Acordo 
                de Paris e para estabelecer novos compromissos e metas para combater as mudanças climáticas.
              </p>
              
              <div className="row mt-5">
                <div className="col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <h3 className="h5 card-title">
                        <i className="fas fa-calendar-alt text-primary me-2"></i>
                        Data
                      </h3>
                      <p className="card-text">10 a 21 de novembro de 2025</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <h3 className="h5 card-title">
                        <i className="fas fa-map-marker-alt text-primary me-2"></i>
                        Local
                      </h3>
                      <p className="card-text">Belém, Pará, Brasil</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 mb-4">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <h3 className="h5 card-title">
                        <i className="fas fa-users text-primary me-2"></i>
                        Participantes Esperados
                      </h3>
                      <p className="card-text">Mais de 30.000 pessoas de todo o mundo</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <h3 className="h5 card-title">
                        <i className="fas fa-globe-americas text-primary me-2"></i>
                        Tema Principal
                      </h3>
                      <p className="card-text">Ação climática e preservação da Amazônia</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events and Schedule */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="section-title text-center">Principais Eventos da COP30</h2>
          <p className="text-center mb-5">
            Confira alguns dos eventos mais importantes programados para a COP30 em Belém.
          </p>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-date">
                <span>10 de novembro</span>
              </div>
              <div className="timeline-content">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h3 className="h5">Cerimônia de Abertura</h3>
                    <p className="mb-1"><strong>Local:</strong> Hangar Centro de Convenções</p>
                    <p className="mb-3"><strong>Horário:</strong> 10:00 - 12:30</p>
                    <p className="mb-0">
                      Cerimônia oficial de abertura da COP30 com a presença de chefes de Estado 
                      e representantes de organizações internacionais.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">
                <span>12 de novembro</span>
              </div>
              <div className="timeline-content">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h3 className="h5">Painel: Amazônia e Clima Global</h3>
                    <p className="mb-1"><strong>Local:</strong> Estação das Docas</p>
                    <p className="mb-3"><strong>Horário:</strong> 14:00 - 17:00</p>
                    <p className="mb-0">
                      Discussões sobre o papel da Amazônia na regulação climática global, 
                      com participação de cientistas, líderes indígenas e formuladores de políticas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">
                <span>13-15 de novembro</span>
              </div>
              <div className="timeline-content">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h3 className="h5">Feira de Tecnologias Verdes</h3>
                    <p className="mb-1"><strong>Local:</strong> Parque de Exposições</p>
                    <p className="mb-3"><strong>Horário:</strong> 09:00 - 18:00</p>
                    <p className="mb-0">
                      Exposição de tecnologias sustentáveis e inovações para combater as mudanças 
                      climáticas, com demonstrações práticas e palestras informativas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">
                <span>16 de novembro</span>
              </div>
              <div className="timeline-content">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h3 className="h5">Dia dos Povos Indígenas</h3>
                    <p className="mb-1"><strong>Local:</strong> Memorial dos Povos</p>
                    <p className="mb-3"><strong>Horário:</strong> 10:00 - 19:00</p>
                    <p className="mb-0">
                      Programação dedicada aos conhecimentos e práticas tradicionais dos povos 
                      indígenas para a conservação ambiental, com apresentações culturais e mesas redondas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-date">
                <span>21 de novembro</span>
              </div>
              <div className="timeline-content">
                <div className="card border-0 shadow-sm">
                  <div className="card-body">
                    <h3 className="h5">Encerramento e Declaração Final</h3>
                    <p className="mb-1"><strong>Local:</strong> Hangar Centro de Convenções</p>
                    <p className="mb-3"><strong>Horário:</strong> 15:00 - 18:00</p>
                    <p className="mb-0">
                      Sessão plenária final com adoção das decisões e apresentação da 
                      Declaração de Belém sobre Mudanças Climáticas.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-5">
            <a href="#" className="btn btn-primary">
              <i className="fas fa-download me-2"></i>
              Baixar Programação Completa
            </a>
          </div>
        </div>
      </section>

      {/* Belém as Host City */}
      <section className="py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="section-title">Belém: Cidade Sede</h2>
              <p className="mb-4">
                Belém, conhecida como "Porta de Entrada da Amazônia", é a capital do 
                estado do Pará e uma das cidades mais importantes da região Norte do Brasil.
              </p>
              <p className="mb-4">
                Fundada em 1616, Belém possui um rico patrimônio histórico e cultural, 
                com construções coloniais, museus, teatros e uma gastronomia única.
              </p>
              <p className="mb-4">
                A cidade está se preparando intensamente para a COP30, com investimentos 
                em infraestrutura, mobilidade urbana e capacitação profissional para 
                receber os milhares de visitantes durante o evento.
              </p>
              <p>
                Sediar a COP30 representa uma oportunidade histórica para Belém mostrar 
                ao mundo sua importância como capital amazônica e reforçar o papel crucial 
                da região na luta contra as mudanças climáticas.
              </p>
            </div>
            <div className="col-lg-6">
              <div className="row g-3">
                <div className="col-6">
                  <img src="/images/belem-1.jpg" alt="Mercado Ver-o-Peso" className="img-fluid rounded shadow-sm" />
                </div>
                <div className="col-6">
                  <img src="/images/belem-2.jpg" alt="Estação das Docas" className="img-fluid rounded shadow-sm" />
                </div>
                <div className="col-6">
                  <img src="/images/belem-3.jpg" alt="Teatro da Paz" className="img-fluid rounded shadow-sm" />
                </div>
                <div className="col-6">
                  <img src="/images/belem-4.jpg" alt="Basílica de Nazaré" className="img-fluid rounded shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-4">Planeje sua visita à COP30</h2>
              <p className="lead mb-4">
                Com o MyBestAngel, você pode explorar Belém durante a COP30 com um guia 
                local que conhece profundamente a cidade e a cultura amazônica.
              </p>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <Link to="/auth/register" className="btn btn-light btn-lg px-4">
                  Encontrar meu Angel
                </Link>
                <Link to="/tour/search" className="btn btn-outline-light btn-lg px-4">
                  Explorar Tours
                </Link>
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
        
        .text-center .section-title:after {
          left: 50%;
          transform: translateX(-50%);
        }
        
        .timeline {
          position: relative;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .timeline::after {
          content: '';
          position: absolute;
          width: 3px;
          background-color: var(--primary-color);
          top: 0;
          bottom: 0;
          left: 120px;
          margin-left: -1.5px;
        }
        
        .timeline-item {
          position: relative;
          padding-left: 150px;
          margin-bottom: 40px;
        }
        
        .timeline-date {
          position: absolute;
          left: 0;
          width: 100px;
          text-align: right;
          font-weight: bold;
          color: var(--primary-color);
        }
        
        .timeline-content {
          position: relative;
        }
        
        .timeline-content::before {
          content: '';
          position: absolute;
          width: 15px;
          height: 15px;
          left: -39px;
          background-color: white;
          border: 3px solid var(--primary-color);
          border-radius: 50%;
          z-index: 1;
          top: 15px;
        }
        
        @media (max-width: 767.98px) {
          .timeline::after {
            left: 90px;
          }
          
          .timeline-item {
            padding-left: 120px;
          }
          
          .timeline-date {
            width: 70px;
          }
          
          .timeline-content::before {
            left: -39px;
          }
        }
      `}</style>
    </>
  );
};

export default COP30Page;