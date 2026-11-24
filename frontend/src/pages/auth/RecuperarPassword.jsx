import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Vote } from 'lucide-react';
import api from '../../api/axiosConfig';
import AuthBanner from '../../components/AuthBanner';
import { Button, Input } from '../../components/ui';

export default function RecuperarPassword() {
  const navigate = useNavigate();

  const [paso, setPaso] = useState(1); // 1: Solicitar código, 2: Restablecer contraseña
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const emailTrim = email.trim();
  const telefonoLimpio = telefono.replace(/\s+/g, '');
  const destino = emailTrim || telefono.trim();

  const handleSolicitarCodigo = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setFieldErrors({});

    if (!emailTrim && !telefonoLimpio) {
      setGeneralError('Ingresa tu correo electrónico o tu número telefónico.');
      return;
    }

    if (emailTrim && telefonoLimpio) {
      setGeneralError('Ingresa solo una opción: correo electrónico o número telefónico.');
      return;
    }

    if (emailTrim && !/\S+@\S+\.\S+/.test(emailTrim)) {
      setFieldErrors({ email: 'Ingresa un correo electrónico válido' });
      return;
    }

    if (telefonoLimpio && !/^\+?[0-9]{10,15}$/.test(telefonoLimpio)) {
      setFieldErrors({ telefono: 'Ingresa un teléfono válido de 10 a 15 dígitos' });
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await api.post('/auth/recuperar', {
        email: emailTrim || null,
        telefono: telefonoLimpio || null,
      });

      const mensajeDefault = emailTrim
        ? 'Hemos enviado un código de verificación a tu correo electrónico.'
        : 'Hemos enviado un código de verificación a tu WhatsApp.';

      setInfoMessage(data?.message || mensajeDefault);
      setPaso(2);
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      } else {
        setGeneralError(data?.message || 'No se pudo procesar la solicitud.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestablecer = async (e) => {
    e.preventDefault();
    setGeneralError('');
    const errores = {};

    if (!codigo.trim()) {
      errores.token = 'Ingresa el código de verificación';
    }
    if (
      !nuevaPassword ||
      !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{8,}$/.test(nuevaPassword)
    ) {
      errores.nuevaPassword = 'Mínimo 8 caracteres, una mayúscula, un número y un símbolo';
    }

    if (Object.keys(errores).length > 0) {
      setFieldErrors(errores);
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/restablecer', {
        token: codigo.trim(),
        nuevaPassword,
      });
      navigate('/login', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      } else {
        setGeneralError(data?.message || 'Código inválido o expirado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white p-4 md:p-6">
      {/* Mitad Izquierda */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-10">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 text-primary font-bold text-xl mb-6">
            <Vote className="w-7 h-7" />
            <span>NextVoto</span>
          </div>

          <p className="text-primary text-sm font-bold tracking-widest uppercase mb-1">
            Seguridad de cuenta
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            Recupera tu cuenta
          </h2>
          <p className="text-slate-500 text-sm mb-7">
            {paso === 1
              ? 'Recibirás un código de recuperación temporal en tu correo electrónico o número telefónico.'
              : `Ingresa el código enviado a ${destino} y define tu nueva contraseña.`}
          </p>

          {infoMessage && (
            <div className="flex items-start gap-2.5 p-3.5 mb-5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{infoMessage}</span>
            </div>
          )}

          {paso === 1 ? (
            <form onSubmit={handleSolicitarCodigo} className="space-y-4" noValidate>
              <Input
                id="email"
                label="Ingresa tu correo electrónico"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (fieldErrors.email) setFieldErrors({});
                }}
                placeholder="ejemplo@correo.com"
                error={fieldErrors.email}
              />

              {/* Separador visual "ó" */}
              <div className="flex items-center gap-3 py-1">
                <div className="h-px bg-slate-200 flex-1" />
                <span className="text-sm font-bold text-slate-500">ó</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              <Input
                id="telefono"
                label="Ingresa tu número telefónico"
                type="tel"
                value={telefono}
                onChange={(e) => {
                  setTelefono(e.target.value);
                  if (fieldErrors.telefono) setFieldErrors({});
                }}
                placeholder="951 444 03 30"
                error={fieldErrors.telefono}
              />

              {generalError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-center">
                  {generalError}
                </div>
              )}

              <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-3 mt-2">
                {isLoading ? 'Enviando código...' : 'Enviar Código'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRestablecer} className="space-y-5" noValidate>
              <Input
                id="codigo"
                label="Código de verificación"
                type="text"
                value={codigo}
                onChange={(e) => {
                  setCodigo(e.target.value);
                  if (fieldErrors.token) setFieldErrors((prev) => ({ ...prev, token: '' }));
                }}
                placeholder="Código de 12 caracteres"
                error={fieldErrors.token}
              />

              <Input
                id="nuevaPassword"
                label="Nueva contraseña"
                type="password"
                value={nuevaPassword}
                onChange={(e) => {
                  setNuevaPassword(e.target.value);
                  if (fieldErrors.nuevaPassword) {
                    setFieldErrors((prev) => ({ ...prev, nuevaPassword: '' }));
                  }
                }}
                placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número y 1 símbolo"
                error={fieldErrors.nuevaPassword}
              />

              {generalError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-center">
                  {generalError}
                </div>
              )}

              <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-3">
                {isLoading ? 'Actualizando...' : 'Restablecer contraseña'}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => {
                    setPaso(1);
                    setInfoMessage('');
                    setGeneralError('');
                    setFieldErrors({});
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-primary cursor-pointer"
                >
                  Cambiar correo o número telefónico
                </button>
              </div>
            </form>
          )}

          <div className="mt-8 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-primary"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>

      {/* Mitad Derecha */}
      <AuthBanner
        badge="Recuperación"
        title="Vuelve a entrar en minutos."
        subtitle="Protegemos tu cuenta mediante códigos temporales de un solo uso."
      />
    </div>
  );
}