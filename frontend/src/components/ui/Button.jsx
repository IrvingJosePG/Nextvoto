import { Loader2 } from 'lucide-react';

const VARIANTES = {
  primary: 'bg-gradient-to-r from-blue-800 to-blue-600 hover:from-blue-900 hover:to-blue-700 text-white shadow-sm',
  secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-300',
  danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
  ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
};

export const Button = ({
  children,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = '',
  type = 'button',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTES[variant]} ${className}`}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
};