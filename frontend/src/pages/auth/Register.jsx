import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Vote } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthBanner from '../../components/AuthBanner';
import { Button, Input } from '../../components/ui';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validarFormulario = () => {
    const errores = {};

    if (!formData.nombre.trim() || formData.nombre.trim().length < 2) {
      errores.nombre = 'Ingresa tu(s) nombre(s)';
    }

    if (!formData.apellidoPaterno.trim() || formData.apellidoPaterno.trim().length < 2) {
      errores.apellidoPaterno = 'Ingresa tu apellido paterno';
    }

    if (!formData.apellidoMaterno.trim() || formData.apellidoMaterno.trim().length < 2) {
      errores.apellidoMaterno = 'Ingresa tu apellido materno';
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      errores.email = 'Ingresa un correo electrónico válido';
    }

    const telefonoLimpio = formData.telefono.replace(/\s+/g, '');
    if (!telefonoLimpio) {
      errores.telefono = 'El número de teléfono es obligatorio';
    } else if (!/^\+?[0-9]{10,15}$/.test(telefonoLimpio)) {
      errores.telefono = 'Ingresa un teléfono válido de 10 a 15 dígitos';
    }

    if (!formData.password || formData.password.length < 8) {
      errores.password =
        'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo';
    }

    if (formData.password !== formData.confirmPassword) {
      errores.confirmPassword = 'Las contraseñas no coinciden';
    }

    setFieldErrors(errores);
    return Object.keys(errores).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');

    if (!validarFormulario()) return;

    const nombreCompleto = [
      formData.nombre.trim(),
      formData.apellidoPaterno.trim(),
      formData.apellidoMaterno.trim(),
    ]
      .filter(Boolean)
      .join(' ');

    const telefonoLimpio = formData.telefono.replace(/\s+/g, '');

    setIsLoading(true);
    try {
      await register({
        nombre: nombreCompleto,
        email: formData.email.trim(),
        telefono: telefonoLimpio,
        password: formData.password,
      });
      navigate('/votante', { replace: true });
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      } else {
        setGeneralError(data?.message || 'No se pudo completar el registro.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white p-4 md:p-6">
      {/* Mitad Izquierda: Formulario de registro */}
      <div className="w-full md:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20 py-8">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-2 text-primary font-bold text-xl mb-5">
            <Vote className="w-7 h-7" />
            <span>NextVoto</span>
          </div>

          <p className="text-primary text-sm font-bold tracking-widest uppercase mb-1">
            Crear cuenta
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-1.5">
            Únete a NextVoto
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            Regístrate como votante para participar con tu código PIN.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              id="nombre"
              name="nombre"
              label="Nombre(s)"
              type="text"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej. Miguel Ángel"
              error={fieldErrors.nombre}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="apellidoPaterno"
                name="apellidoPaterno"
                label="Apellido Paterno"
                type="text"
                value={formData.apellidoPaterno}
                onChange={handleChange}
                placeholder="Ej. Sandoval"
                error={fieldErrors.apellidoPaterno}
              />

              <Input
                id="apellidoMaterno"
                name="apellidoMaterno"
                label="Apellido Materno"
                type="text"
                value={formData.apellidoMaterno}
                onChange={handleChange}
                placeholder="Ej. Reyes"
                error={fieldErrors.apellidoMaterno}
              />
            </div>

            <Input
              id="telefono"
              name="telefono"
              label="Teléfono"
              type="tel"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="Ej. 951 444 03 30"
              error={fieldErrors.telefono}
            />

            <Input
              id="email"
              name="email"
              label="Correo electrónico"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              error={fieldErrors.email}
            />

            <Input
              id="password"
              name="password"
              label="Contraseña"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mín. 8 caracteres, 1 mayúscula, 1 número y 1 símbolo"
              error={fieldErrors.password}
            />

            <Input
              id="confirmPassword"
              name="confirmPassword"
              label="Confirmar contraseña"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
              error={fieldErrors.confirmPassword}
            />

            {generalError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium text-center">
                {generalError}
              </div>
            )}

            <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-3 mt-2">
              {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-600 mt-6">
            ¿Ya tienes una cuenta?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>

      {/* Mitad Derecha: Panel visual */}
      <AuthBanner
        badge="Registro Rápido"
        title="Participa sin complicaciones."
        subtitle="Crea tu cuenta en segundos y accede a votaciones verificadas."
      />
    </div>
  );
}