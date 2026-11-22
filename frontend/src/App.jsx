
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';

// Componentes de estructura
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Vistas de Autenticación
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RecuperarPassword from './pages/auth/RecuperarPassword';

// Vistas del Módulo Admin
import AdminLayout from './pages/admin/AdminLayout';
import AdminInicio from './pages/admin/AdminInicio';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminEncuestas from './pages/admin/AdminEncuestas';

// Vistas del Módulo Votante
import DashboardVotante from './pages/votante/DashboardVotante';
import BoletaVotacion from './pages/votante/BoletaVotacion';
import HistorialVotante from './pages/votante/HistorialVotante';
import ResultadosVotante from './pages/votante/ResultadosVotante';

// Vistas del Módulo Moderador
import ModeradorInicio from './pages/moderador/ModeradorInicio';
import ModeradorEncuestas from './pages/moderador/ModeradorEncuestas';
import ModeradorAlumnos from './pages/moderador/ModeradorAlumnos';
import ModeradorMetricas from './pages/moderador/ModeradorMetricas';
import ModeradorConfiguracion from './pages/moderador/ModeradorConfiguracion';
import ModeradorCrear from './pages/moderador/ModeradorCrear';
import ModeradorResultados from './pages/moderador/ModeradorResultados';

// Layout privado
const LayoutPrivado = ({ children }) => (
  <div className="min-h-screen flex bg-[#f4f8fd]">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 pr-4 sm:pr-6">
      <Topbar />
      <main className="flex-1 px-4 sm:px-8 py-7">
        {children}
      </main>
    </div>
  </div>
);

// Protección de rutas según el rol
const RutaRol = ({ roles, children }) => (
  <ProtectedRoute allowedRoles={roles}>
    <LayoutPrivado>{children}</LayoutPrivado>
  </ProtectedRoute>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* RUTAS PÚBLICAS */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar" element={<RecuperarPassword />} />

          {/* RUTAS DEL VOTANTE */}
          <Route
            path="/votante"
            element={
              <RutaRol roles={['VOTANTE']}>
                <DashboardVotante />
              </RutaRol>
            }
          />

          <Route
            path="/votante/encuestas/:id"
            element={
              <RutaRol roles={['VOTANTE']}>
                <BoletaVotacion />
              </RutaRol>
            }
          />

          <Route
            path="/votante/historial"
            element={
              <RutaRol roles={['VOTANTE']}>
                <HistorialVotante />
              </RutaRol>
            }
          />

          <Route
            path="/votante/encuestas/:id/resultados"
            element={
              <RutaRol roles={['VOTANTE']}>
                <ResultadosVotante />
              </RutaRol>
            }
          />

          {/* RUTAS DEL MODERADOR */}
          {/* RUTAS DEL MODERADOR */}
<Route
  path="/moderador"
  element={
    <RutaRol roles={['MODERADOR']}>
      <ModeradorInicio />
    </RutaRol>
  }
/>
<Route
  path="/moderador/encuestas"
  element={
    <RutaRol roles={['MODERADOR']}>
      <ModeradorEncuestas />
    </RutaRol>
  }
/>
<Route
  path="/moderador/alumnos"
  element={
    <RutaRol roles={['MODERADOR']}>
      <ModeradorAlumnos />
    </RutaRol>
  }
/>
<Route
  path="/moderador/metricas"
  element={
    <RutaRol roles={['MODERADOR']}>
      <ModeradorMetricas />
    </RutaRol>
  }
/>
<Route
  path="/moderador/configuracion"
  element={
    <RutaRol roles={['MODERADOR']}>
      <ModeradorConfiguracion />
    </RutaRol>
  }
/>
<Route
  path="/moderador/crear"
  element={
    <RutaRol roles={['MODERADOR']}>
      <ModeradorCrear />
    </RutaRol>
  }
/>
<Route
  path="/moderador/encuestas/:id/resultados"
  element={
    <RutaRol roles={['MODERADOR']}>
      <ModeradorResultados />
    </RutaRol>
  }
/>

          {/* RUTAS DEL ADMINISTRADOR */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminInicio />} />
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="encuestas" element={<AdminEncuestas />} />
          </Route>

          {/* REDIRECCIÓN POR DEFECTO */}
          <Route
            path="*"
            element={<Navigate to="/login" replace />}
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
