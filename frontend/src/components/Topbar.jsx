import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Menu,
  ChevronRight,
  ChevronDown,
  UserCircle2,
  User,
  KeyRound,
  LogOut,
  X,
  Mail,
  Shield,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui';

const PORTAL_POR_ROL = {
  VOTANTE: 'Portal Votante',
  MODERADOR: 'Panel Moderador',
  ADMIN: 'Administración',
};

const SECCION_POR_RUTA = {
  '/votante': 'Inicio',
  '/votante/historial': 'Resultados e Historial',
  '/moderador': 'Inicio',
  '/moderador/encuestas': 'Mis Encuestas',
  '/moderador/crear': 'Crear Encuesta',
  '/moderador/participantes': 'Participantes',
  '/moderador/metricas': 'Métricas y Resultados',
  '/moderador/configuracion': 'Configuración',
  '/admin/usuarios': 'Gestión de Usuarios',
  '/admin/encuestas': 'Supervisión Global',
};

export default function Topbar({ menuLateralAbierto = true, onToggleMenu = () => {} }) {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const handleLogout = async () => {
    setMenuAbierto(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const portal = PORTAL_POR_ROL[user.rol] || 'NextVoto';
  const seccion =
    SECCION_POR_RUTA[pathname] ||
    (pathname.includes('/resultados')
      ? 'Resultados > Detalles'
      : pathname.includes('/encuestas/')
      ? 'Cuestionario'
      : 'Panel Principal');

  return (
    <>
      <header className="bg-[#dbeafe] rounded-b-3xl px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs relative z-20">
        <div className="flex items-center gap-3">
          {/* Botón de hamburguesa: abre y cierra el menú lateral */}
          <button
            type="button"
            onClick={onToggleMenu}
            aria-label={menuLateralAbierto ? 'Ocultar menú lateral' : 'Mostrar menú lateral'}
            aria-expanded={menuLateralAbierto}
            className="p-2 -ml-2 rounded-xl text-blue-800 hover:bg-blue-200/60 transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Breadcrumb profesional */}
          <div className="flex items-center gap-2 text-base">
            <span className="font-medium text-blue-800/75 hidden sm:inline">{portal}</span>
            <ChevronRight className="w-4 h-4 text-blue-800/50 hidden sm:inline" />
            <span className="font-bold text-slate-900 tracking-tight">{seccion}</span>
          </div>
        </div>

        {/* Menú desplegable de usuario */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setMenuAbierto((prev) => !prev)}
            className="flex items-center gap-3 px-3 py-1.5 rounded-2xl hover:bg-blue-200/60 transition-colors cursor-pointer"
          >
            <UserCircle2 className="w-8 h-8 text-blue-700 stroke-[1.75] hidden sm:block" />
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900 leading-tight">{user.nombre}</p>
              <span className="inline-block mt-0.5 text-[11px] font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-white text-primary border border-blue-200">
                {user.rol}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-600 transition-transform duration-150 ${
                menuAbierto ? 'rotate-180' : ''
              }`}
            />
          </button>

          {menuAbierto && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-200 rounded-2xl shadow-lg py-2 z-30">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs text-slate-400 font-medium">Sesión iniciada como</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{user.email}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setMenuAbierto(false);
                  setModalPerfilAbierto(true);
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-primary" />
                <span>Mi perfil</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuAbierto(false);
                  navigate('/recuperar');
                }}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-primary" />
                <span>Cambiar contraseña</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Modal de información del perfil */}
      {modalPerfilAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-primary-light text-primary">
                  <User className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Información de mi cuenta</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalPerfilAbierto(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 my-5 text-sm">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Nombre completo
                </p>
                <p className="text-base font-semibold text-slate-900 mt-0.5">{user.nombre}</p>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-700">
                <Shield className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Rol asignado:</span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-primary-light text-primary border border-blue-200">
                  {user.rol}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-100">
              <Button
                variant="secondary"
                onClick={() => {
                  setModalPerfilAbierto(false);
                  navigate('/recuperar');
                }}
              >
                Cambiar contraseña
              </Button>
              <Button variant="primary" onClick={() => setModalPerfilAbierto(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}