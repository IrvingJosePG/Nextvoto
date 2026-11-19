export const Input = ({
  label,
  error,
  id,
  className = '',
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 ${
          error
            ? 'border-rose-500 focus:ring-rose-500/20 focus:border-rose-500'
            : 'border-slate-300 focus:ring-indigo-500/20 focus:border-primary'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="text-rose-600 text-xs mt-1.5 font-medium">{error}</p>
      )}
    </div>
  );
};