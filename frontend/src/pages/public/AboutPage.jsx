import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <>
      {/* Header Banner */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h1 className="display-4 fw-bold mb-4">Sobre o MyBestAngel</h1>
              <p className="lead mb-0">
                Conectando visitantes a experiências autênticas em Belém durante a COP30
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 mx-auto">
              <h2 className="section-title">Nossa História</h2>
              <p className="lead mb-4">
                O MyBestAngel nasceu da paixão por conectar pessoas e criar experiências memoráveis.
              </p>
              <p className="mb-4">
                Em preparação para a COP30 em Belém, identificamos uma necessidade: um serviço 
                que oferecesse aos visitantes internacionais e nacionais uma forma de conhecer 
                a cidade de maneira autêntica, personalizada e segura.
              </p>
              <p className="mb-4">
                Assim surgiu o MyBestAngel, uma plataforma que conecta visitantes a guias locais 
                chamados "Angels", pessoas que conhecem profundamente a cidade e podem proporcionar 
                experiências únicas, mostrando não apenas os pontos turísticos tradicionais, mas 
                também os segredos e encantos que só um morador local conhece.
              </p>
              <p>
                Nossa missão é transformar a experiência dos visitantes durante a COP30, 
                proporcionando memórias inesquecíveis e uma compreensão mais profunda da cultura 
                paraense e da importância da Amazônia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Values */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <h2 className="section-title">Nossa Missão</h2>
              <p className="mb-4">
                Facilitar conexões autênticas entre visitantes e guias locais, promovendo 
                experiências culturais enriquecedoras e contribuindo para o turismo sustentável 
                em Belém durante a COP30.
              </p>
              <p>
                Acreditamos que o turismo pode ser uma força positiva para a preservação 
                cultural e ambiental, e que as melhores experiências de viagem são aquelas 
                que nos conectam genuinamente com as pessoas e lugares que visitamos.
              </p>
            </div>
            <div className="col-lg-6">
              <h2 className="section-title">Nossos Valores</h2>
              <ul className="list-unstyled">
                <li className="d-flex mb-3">
                  <div className="me-3">
                    <i className="fas fa-handshake fa-2x text-primary"></i>
                  </div>
                  <div>
                    <h5>Autenticidade</h5>
                    <p className="mb-0">Promovemos experiências genuínas que revelam a verdadeira essência de Belém.</p>
                  </div>
                </li>
                <li className="d-flex mb-3">
                  <div className="me-3">
                    <i className="fas fa-leaf fa-2x text-primary"></i>
                  </div>
                  <div>
                    <h5>Sustentabilidade</h5>
                    <p className="mb-0">Apoiamos práticas de turismo responsável que respeitam e preservam o meio ambiente.</p>
                  </div>
                </li>
                <li className="d-flex mb-3">
                  <div className="me-3">
                    <i className="fas fa-users fa-2x text-primary"></i>
                  </div>
                  <div>
                    <h5>Comunidade</h5>
                    <p className="mb-0">Valorizamos e apoiamos a comunidade local, gerando impacto positivo.</p>
                  </div>
                </li>
                <li className="d-flex">
                  <div className="me-3">
                    <i className="fas fa-shield-alt fa-2x text-primary"></i>
                  </div>
                  <div>
                    <h5>Segurança</h5>
                    <p className="mb-0">Priorizamos a segurança e o bem-estar de todos os nossos usuários.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-5">
        <div className="container">
          <h2 className="section-title text-center">Nosso Time</h2>
          <p className="text-center mb-5">
            Conheça as pessoas apaixonadas por Belém que fazem o MyBestAngel acontecer.
          </p>
          
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="text-center pt-4">
                  <div 
                    className="rounded-circle bg-primary bg-opacity-10 d-flex justify-content-center align-items-center mx-auto mb-3"
                    style={{ width: 100, height: 100 }}
                  >
                    <i className="fas fa-user fa-3x text-primary"></i>
                  </div>
                  <h4>Caique Rabelo Neves</h4>
                  <p className="text-muted">Fundador & CEO</p>
                </div>
                <div className="card-body">
                  <p className="card-text text-center">
                    Apaixonado por tecnologia e turismo sustentável, Caique fundou o MyBestAngel 
                    com a visão de transformar a experiência dos visitantes em Belém durante a COP30.
                  </p>
                </div>
                <div className="card-footer bg-white border-0 text-center pb-4">
                  <a href="#" className="social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="text-center pt-4">
                  <div 
                    className="rounded-circle bg-primary bg-opacity-10 d-flex justify-content-center align-items-center mx-auto mb-3"
                    style={{ width: 100, height: 100 }}
                  >
                    <i className="fas fa-user fa-3x text-primary"></i>
                  </div>
                  <h4>Ana Carvalho</h4>
                  <p className="text-muted">Diretora de Operações</p>
                </div>
                <div className="card-body">
                  <p className="card-text text-center">
                    Com mais de 10 anos de experiência no setor de turismo, Ana lidera as 
                    operações e garante experiências excepcionais para todos os usuários.
                  </p>
                </div>
                <div className="card-footer bg-white border-0 text-center pb-4">
                  <a href="#" className="social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-twitter"></i>
                  </a>
                </div>
              </div>
            </div>
            
            <div className="col-md-4">
              <div className="card border-0 shadow-sm h-100">
                <div className="text-center pt-4">
                  <div 
                    className="rounded-circle bg-primary bg-opacity-10 d-flex justify-content-center align-items-center mx-auto mb-3"
                    style={{ width: 100, height: 100 }}
                  >
                    <i className="fas fa-user fa-3x text-primary"></i>
                  </div>
                  <h4>Pedro Oliveira</h4>
                  <p className="text-muted">Diretor de Tecnologia</p>
                </div>
                <div className="card-body">
                  <p className="card-text text-center">
                    Pedro é responsável por desenvolver e aprimorar a plataforma, garantindo 
                    uma experiência de usuário intuitiva e eficiente.
                  </p>
                </div>
                <div className="card-footer bg-white border-0 text-center pb-4">
                  <a href="#" className="social-link">
                    <i className="fab fa-linkedin"></i>
                  </a>
                  <a href="#" className="social-link">
                    <i className="fab fa-github"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Us CTA */}
      <section className="py-5 bg-primary text-white">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 mx-auto text-center">
              <h2 className="display-5 fw-bold mb-4">Faça Parte Desta Jornada</h2>
              <p className="lead mb-4">
                Seja como Angel para compartilhar seu conhecimento de Belém, ou como Visitor para 
                descobrir a cidade de maneira única, junte-se a nós para criar memórias inesquecíveis.
              </p>
              <div className="d-grid gap-2 d-sm-flex justify-content-sm-center">
                <Link to="/auth/register?type=angel" className="btn btn-light btn-lg px-4">
                  Torne-se um Angel
                </Link>
                <Link to="/auth/register?type=visitor" className="btn btn-outline-light btn-lg px-4">
                  Registre-se como Visitor
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
        
        .social-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(22, 160, 133, 0.1);
          color: var(--primary-color);
          margin: 0 5px;
          transition: all 0.3s ease;
        }
        
        .social-link:hover {
          background-color: var(--primary-color);
          color: white;
        }
      `}</style>
    </>
  );
};

export default AboutPage;