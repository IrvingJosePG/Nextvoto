import { BarChart3, ClipboardList, LogOut, Users } from 'lucide-react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo_nextvoto.png';
import Topbar from '../../components/Topbar';
import { useAuth } from '../../context/AuthContext';
import './admin.css';

const enlaces = [
  { ruta: '/admin', texto: 'Inicio', icono: BarChart3 },
  { ruta: '/admin/usuarios', texto: 'Usuarios', icono: Users },
  { ruta: '/admin/encuestas', texto: 'Encuestas y votaciones', icono: ClipboardList },
];

export default function AdminLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function salir() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          <img src={logo} width="52" height="52" alt="" />
          <span>Next Voto</span>
        </Link>
        <nav aria-label="Administración" className="admin-nav">
          {enlaces.map(({ ruta, texto, icono: Icono }) => (
            <NavLink key={ruta} to={ruta} end className="admin-nav-link">
              <Icono size={18} aria-hidden="true" />
              {texto}
            </NavLink>
          ))}
          <button type="button" className="admin-nav-link mt-2" onClick={salir}>
            <LogOut size={18} aria-hidden="true" />
            Salir
          </button>
        </nav>
      </aside>
      <div className="admin-workspace">
        <Topbar />
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
