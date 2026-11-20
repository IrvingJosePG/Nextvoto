import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { Navbar } from './components/Navbar';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import RecuperarPassword from './pages/auth/RecuperarPassword';
import AdminLayout from './pages/admin/AdminLayout';
import AdminInicio from './pages/admin/AdminInicio';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminEncuestas from './pages/admin/AdminEncuestas';

const LayoutPrivado = ({ children }) => (
  <div className="min-h-screen bg-fondo">
    <Navbar />
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {children}
    </main>
  </div>
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
              <ProtectedRoute allowedRoles={['VOTANTE']}>
                <LayoutPrivado>
                  <VistaTemporal titulo="Panel del Votante (Siguiente paso)" />
                </LayoutPrivado>
              </ProtectedRoute>
            }
          />

          {/* Rutas Moderador (Placeholder para tu compañero) */}
          <Route
            path="/moderador/encuestas"
            element={
              <ProtectedRoute allowedRoles={['MODERADOR']}>
                <LayoutPrivado>
                  <VistaTemporal titulo="Panel del Moderador" />
                </LayoutPrivado>
              </ProtectedRoute>
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
