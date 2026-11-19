import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Vote, LogOut, ClipboardList, History, BarChart3, Users, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-primary-light text-primary'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo y enlaces por rol */}
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
              <Vote className="w-7 h-7" />
              <span>NextVoto</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              {user.rol === 'VOTANTE' && (
                <>
                  <NavLink to="/votante" end className={linkClass}>
                    <ClipboardList className="w-4 h-4" />
                    Mis Votaciones
                  </NavLink>
                  <NavLink to="/votante/historial" className={linkClass}>
                    <History className="w-4 h-4" />
                    Historial
                  </NavLink>
                </>
              )}

              {user.rol === 'MODERADOR' && (
                <>
                  <NavLink to="/moderador/encuestas" className={linkClass}>
                    <BarChart3 className="w-4 h-4" />
                    Mis Encuestas
                  </NavLink>
                  <NavLink to="/moderador/crear" className={linkClass}>
                    <ClipboardList className="w-4 h-4" />
                    Crear Encuesta
                  </NavLink>
                </>
              )}

              {user.rol === 'ADMIN' && (
                <>
                  <NavLink to="/admin/usuarios" className={linkClass}>
                    <Users className="w-4 h-4" />
                    Usuarios
                  </NavLink>
                  <NavLink to="/admin/encuestas" className={linkClass}>
                    <ShieldCheck className="w-4 h-4" />
                    Supervisión Global
                  </NavLink>
                </>
              )}
            </div>
          </div>

          {/* Info del usuario y botón de salir */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-slate-900">{user.nombre}</p>
              <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-light text-primary border border-indigo-200">
                {user.rol}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;