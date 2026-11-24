import { Loader2 } from 'lucide-react';

const COLORES = {
  amber: 'border-amber-500',
  blue: 'border-blue-600',
  emerald: 'border-emerald-500',
  rose: 'border-rose-500',
};

export default function Metrica({ label, value, color, loading }) {
  return (
    <div className="min-w-0 flex items-center justify-between gap-3 bg-[#dbeafe] rounded-2xl px-4 py-4">
      <p className="whitespace-pre-line text-sm font-semibold leading-tight text-slate-900">
        {label}
      </p>
      <div
        className={`shrink-0 w-12 h-12 rounded-full border-4 bg-white flex items-center justify-center text-sm font-extrabold text-slate-900 ${COLORES[color]}`}
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin text-blue-700" /> : value}
      </div>
    </div>
  );
}