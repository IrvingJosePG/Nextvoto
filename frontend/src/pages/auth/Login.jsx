import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vote } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthBanner from '../../components/AuthBanner';
import { Button, Input } from '../../components/ui';
import logoNextVoto from '../../assets/img/logo_nextvoto.png';

const RUTA_POR_ROL = {
  ADMIN: '/admin/usuarios',
  MODERADOR: '/moderador/encuestas',
  VOTANTE: '/votante',
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validarFormulario = () => {
    const errores = {};
    if (!email.trim()) {
      errores.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errores.email = 'Ingresa un correo electrónico válido';
    }

    if (!password.trim()) {
      errores.password = 'La contraseña es obligatoria';
    }

    setFieldErrors(errores);
    return Object.keys(errores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validarFormulario()) return;

    setIsLoading(true);
    try {
      const userData = await login(email.trim(), password);
      navigate(RUTA_POR_ROL[userData.rol] || '/votante', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      } else {
        setGeneralError(data?.message || 'No se pudo iniciar sesión. Verifica tus credenciales.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white p-4 md:p-6">
      {/* Mitad Izquierda: Formulario */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-10">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 text-primary font-bold text-xl mb-6">
                <img src={logoNextVoto} alt="NextVoto" className="h-9 w-auto" />
            <span>NextVoto</span>
          </div>

          <p className="text-primary text-sm font-bold tracking-widest uppercase mb-1">
            Inicio de sesión
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">
            ¡Hola de nuevo!
          </h2>
          <p className="text-slate-500 text-base mb-8">
            Ingresa tus credenciales para acceder a tus votaciones.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              id="email"
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@nextvoto.com"
              error={fieldErrors.email}
            />

            <Input
              id="password"
              label="Contraseña"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              error={fieldErrors.password}
            />

            <div className="flex justify-end">
              <Link
                to="/recuperar"
                className="text-sm font-semibold text-primary hover:underline"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            {generalError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-center">
                {generalError}
              </div>
            )}

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-3">
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-8">
            ¿Aún no tienes una cuenta?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </div>

      {/* Mitad Derecha: Panel visual */}
      <AuthBanner />
    </div>
  );
}