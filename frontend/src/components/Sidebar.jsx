import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  ListChecks,
  LogOut,
  BarChart3,
  PlusCircle,
  Users,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logoNextVoto from '../assets/img/logo_nextvoto.png';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  if (!user) return null;

  // Bloquea la barra lateral mientras el votante responde una encuesta/votación
  const enCuestionario = /^\/votante\/encuestas\/[^/]+$/.test(pathname);

  const handleLogout = async () => {
    if (enCuestionario) return;
    await logout();
    navigate('/login', { replace: true });
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-6 py-3 rounded-r-full mr-4 text-sm font-semibold transition-colors ${
      enCuestionario
        ? 'text-blue-700/40 pointer-events-none select-none'
        : isActive
        ? 'bg-[#dbeafe] text-blue-700'
        : 'text-blue-700/80 hover:bg-blue-50 hover:text-blue-800'
    }`;

  return (
    <aside className="w-64 bg-white border-r border-slate-100 min-h-screen flex flex-col py-6 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 mb-10">
        <img src={logoNextVoto} alt="NextVoto" className="h-10 w-auto" />
        <span className="text-xl font-extrabold text-blue-700 tracking-tight">
          Next Voto
        </span>
      </div>

      {/* Menú por rol */}
      <nav className="space-y-2">
        {user.rol === 'VOTANTE' && (
          <>
            <NavLink
              to="/votante"
              end
              tabIndex={enCuestionario ? -1 : 0}
              className={navItemClass}
            >
              <Home className="w-5 h-5" />
              <span>Inicio</span>
            </NavLink>
            <NavLink
              to="/votante/historial"
              tabIndex={enCuestionario ? -1 : 0}
              className={navItemClass}
            >
              <ListChecks className="w-5 h-5" />
              <span>Resultados</span>
            </NavLink>
          </>
        )}

        {user.rol === 'MODERADOR' && (
          <>
            <NavLink to="/moderador/encuestas" className={navItemClass}>
              <BarChart3 className="w-5 h-5" />
              <span>Mis Encuestas</span>
            </NavLink>
            <NavLink to="/moderador/crear" className={navItemClass}>
              <PlusCircle className="w-5 h-5" />
              <span>Crear Encuesta</span>
            </NavLink>
          </>
        )}

        {user.rol === 'ADMIN' && (
          <>
            <NavLink to="/admin/usuarios" className={navItemClass}>
              <Users className="w-5 h-5" />
              <span>Usuarios</span>
            </NavLink>
            <NavLink to="/admin/encuestas" className={navItemClass}>
              <ShieldCheck className="w-5 h-5" />
              <span>Supervisión</span>
            </NavLink>
          </>
        )}

        <button
          type="button"
          onClick={handleLogout}
          disabled={enCuestionario}
          className={`w-[calc(100%-1rem)] flex items-center gap-3 px-6 py-3 rounded-r-full text-sm font-semibold transition-colors ${
            enCuestionario
              ? 'text-blue-700/40 pointer-events-none select-none'
              : 'text-blue-700/80 hover:bg-rose-50 hover:text-rose-600 cursor-pointer'
          }`}
        >
          <LogOut className="w-5 h-5" />
          <span>Salir</span>
        </button>

        {enCuestionario && (
          <div className="px-5 pt-4">
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-200/80 rounded-xl px-3 py-2.5 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Cuestionario en progreso</span>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}