import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AuthBanner from '../../components/AuthBanner';
import { Button, Input } from '../../components/ui';
import logoNextVoto from '../../assets/img/logo_nextvoto.png';
import { useGoogleLogin } from '@react-oauth/google';

const RUTA_POR_ROL = {
  ADMIN: '/admin',
  MODERADOR: '/moderador/encuestas',
  VOTANTE: '/votante',
};

export default function Login() {
  const { login, loginGoogle } = useAuth();
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

  const iniciarConGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGeneralError('');
      setIsLoading(true);
      try {
        const userData = await loginGoogle(tokenResponse.access_token);
        navigate(RUTA_POR_ROL[userData.rol] || '/votante', { replace: true });
      } catch (err) {
        const data = err.response?.data;
        setGeneralError(data?.message || 'No se pudo iniciar sesión con Google.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => {
      setGeneralError('No se pudo completar la autenticación con Google.');
    },
  });

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

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-slate-400 font-medium">
                o continúa con
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => iniciarConGoogle()}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-50 active:bg-slate-100 border border-slate-200 shadow-xs flex items-center justify-center gap-3 text-sm font-semibold text-slate-700 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.3 0 6.08-1.09 8.11-2.96l-3.88-3.05c-1.1.74-2.51 1.18-4.23 1.18-3.26 0-6.02-2.2-7-5.16H1.01v3.14C3.05 21.2 7.24 24 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5 14.01c-.25-.74-.39-1.54-.39-2.36 0-.82.14-1.62.39-2.36V6.15H1.01C.37 7.43 0 8.87 0 10.4s.37 2.97 1.01 4.25l3.99-3.14Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.79 0 3.41.62 4.68 1.82l3.51-3.51C18.07 1.19 15.3 0 12 0 7.24 0 3.05 2.8 1.01 6.85l3.99 3.14c.98-2.96 3.74-5.24 7-5.24Z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

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
