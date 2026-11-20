import { useId } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Sí, Enviar',
  cancelText = 'Revisar de Nuevo',
  variant = 'warning',
  isLoading = false,
  error = '',
  onConfirm,
  onClose,
}) => {
  const tituloId = useId();
  if (!isOpen) return null;

  const esPeligro = variant === 'danger';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        onKeyDown={(evento) => {
          if (evento.key === 'Escape' && !isLoading) onClose();
        }}
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full p-8 sm:p-10 text-center animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Ícono central grande estilo Figma */}
        <div className="flex justify-center">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center ${
              esPeligro
                ? 'bg-rose-50 text-rose-500'
                : 'bg-amber-50 text-amber-500'
            }`}
          >
            <AlertTriangle className="w-14 h-14 stroke-[2.2]" />
          </div>
        </div>

        {/* Título centrado */}
        <h3
          id={tituloId}
          className="text-2xl sm:text-[26px] font-extrabold text-slate-900 leading-tight mt-5"
        >
          {title}
        </h3>

        {/* Mensaje descriptivo */}
        <p className="text-sm sm:text-base text-slate-600 mt-3 max-w-md mx-auto leading-relaxed">
          {message}
        </p>

        {error && (
          <p className="mt-3 text-sm font-medium text-rose-700" role="alert">
            {error}
          </p>
        )}

        {/* Botones de acción centrados */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-center gap-3.5 mt-8">
          <button
            type="button"
            disabled={isLoading}
            onClick={onClose}
            className="w-full sm:w-auto min-w-[170px] px-6 py-2.5 rounded-xl bg-white border border-slate-400 hover:bg-slate-50 text-slate-900 font-semibold text-sm sm:text-base transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={onConfirm}
            className={`w-full sm:w-auto min-w-[170px] px-6 py-2.5 rounded-xl font-bold text-sm sm:text-base text-white shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 ${
              esPeligro
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
            }`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};