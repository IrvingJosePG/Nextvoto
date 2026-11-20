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
import AdminLayout from './pages/admin/AdminLayout';
import AdminInicio from './pages/admin/AdminInicio';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminEncuestas from './pages/admin/AdminEncuestas';

// Vistas del Módulo Votante
import DashboardVotante from './pages/votante/DashboardVotante';
import BoletaVotacion from './pages/votante/BoletaVotacion';
import HistorialVotante from './pages/votante/HistorialVotante';
import ResultadosVotante from './pages/votante/ResultadosVotante';

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

const RutaRol = ({ roles, children }) => (
  <ProtectedRoute allowedRoles={roles}>
    <LayoutPrivado>{children}</LayoutPrivado>
  </ProtectedRoute>
);

const VistaTemporal = ({ titulo }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
    <h1 className="text-xl font-bold text-slate-900">{titulo}</h1>
    <p className="text-sm text-slate-500 mt-1">
      Sesión iniciada correctamente. Aquí construiremos las vistas de este módulo.
    </p>
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recuperar" element={<RecuperarPassword />} />

          {/* Rutas Votante */}
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

          {/* Rutas Moderador (Placeholder para tu compañero) */}
          <Route
            path="/moderador/encuestas"
            element={
              <RutaRol roles={['MODERADOR']}>
                <VistaTemporal titulo="Panel del Moderador" />
              </RutaRol>
            }
          />

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

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
