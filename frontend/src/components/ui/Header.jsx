import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import RealTimeNotifications from "../shared/RealTimeNotifications";

const Header = ({ showMobileMenu = false, toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      {showMobileMenu && (
        <button
          className="d-lg-none btn btn-link p-0 me-3"
          onClick={toggleSidebar}
        >
          <i className="fa fa-bars"></i>
        </button>
      )}

      <div className="header-logo">
        <Link to="/" className="d-flex align-items-center">
          <img
            src="/logo.png"
            alt="MyBestAngel"
            width="40"
            height="40"
            className="me-2"
          />
          <span className="fw-bold fs-4 text-primary d-none d-md-inline">
            MyBestAngel
          </span>
        </Link>
      </div>

      <div className="header-search position-relative d-none d-md-block">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar passeios, locais..."
        />
        <i className="fa fa-search search-icon"></i>
      </div>

      <div className="header-actions">
        {user ? (
          <>
            <Link
              to={
                user.userType === "angel"
                  ? "/angel/messages"
                  : "/visitor/messages"
              }
              className="header-action-btn"
            >
              <i className="fa fa-envelope"></i>
              <span className="badge">3</span>{" "}
              {/* Número dinâmico de mensagens não lidas */}
            </Link>

            <RealTimeNotifications />
            <Link
              to={
                user.userType === "angel"
                  ? "/angel/messages"
                  : "/visitor/messages"
              }
              className="header-action-btn"
            >
              <i className="fa fa-envelope"></i>
              <span className="badge">3</span>
            </Link>
            <div className="dropdown">
              <button
                className="btn btn-link header-action-btn"
                type="button"
                data-bs-toggle="dropdown"
              >
                <i className="fa fa-user-circle"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <Link
                    className="dropdown-item"
                    to={
                      user.userType === "angel"
                        ? "/angel/profile"
                        : "/visitor/profile"
                    }
                  >
                    <i className="fa fa-user me-2"></i>
                    Perfil
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to={
                      user.userType === "angel"
                        ? "/angel/dashboard"
                        : "/visitor/dashboard"
                    }
                  >
                    <i className="fa fa-tachometer-alt me-2"></i>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fa fa-sign-out-alt me-2"></i>
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          </>
        ) : (
          <div className="d-flex">
            <Link to="/auth/login" className="btn btn-outline-primary me-2">
              Entrar
            </Link>
            <Link to="/auth/register" className="btn btn-primary">
              Cadastrar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
