import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const Input = ({
  label,
  error,
  id,
  type = 'text',
  className = '',
  ...props
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const esPassword = type === 'password';
  const tipoActual = esPassword && mostrarPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={tipoActual}
          className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
            esPassword ? 'pr-10' : ''
          } ${
            error
              ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500'
              : 'border-slate-300 focus:ring-indigo-500/20 focus:border-primary'
          } ${className}`}
          {...props}
        />
        {esPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setMostrarPassword((prev) => !prev)}
            aria-label={mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            {mostrarPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
      {error && (
        <p className="text-rose-600 text-xs mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
};