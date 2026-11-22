
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RUTA_POR_ROL = {
  ADMIN: '/admin',
  MODERADOR: '/moderador/inicio',
  VOTANTE: '/votante',
};

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Mientras se verifica la sesión
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-fondo">
        <div className="flex items-center gap-2 text-primary font-medium">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Cargando sesión...</span>
        </div>
      </div>
    );
  }

  // Si no inició sesión, regresar al login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Verificar permisos según el rol
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return (
      <Navigate
        to={RUTA_POR_ROL[user.rol] || '/login'}
        replace
      />
    );
  }

  return children;
};
