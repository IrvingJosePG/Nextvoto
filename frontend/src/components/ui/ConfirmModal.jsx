import { useId } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from './Button';

export const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  isLoading = false,
  error = '',
  onConfirm,
  onClose,
}) => {
  const tituloId = useId();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
        onKeyDown={(evento) => {
          if (evento.key === 'Escape' && !isLoading) onClose();
        }}
        className="bg-white border border-slate-200 rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${variant === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-primary'}`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 id={tituloId} className="text-lg font-semibold text-slate-900">{title}</h3>
          </div>
          <button
            type="button"
            aria-label="Cerrar confirmación"
            disabled={isLoading}
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
          {message}
        </p>
        {error && <p className="mt-3 text-sm text-rose-700" role="alert">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={onClose} disabled={isLoading} autoFocus>
            {cancelText}
          </Button>
          <Button variant={variant} onClick={onConfirm} isLoading={isLoading}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
};
