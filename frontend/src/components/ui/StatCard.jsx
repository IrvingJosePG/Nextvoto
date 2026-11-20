const COLORES_BORDE = {
  amber: 'border-amber-500',
  emerald: 'border-emerald-500',
  blue: 'border-blue-600',
  rose: 'border-rose-500',
};

export const StatCard = ({ label, value, color = 'amber', loading = false }) => {
  return (
    <div className="bg-[#dbeafe] rounded-3xl px-8 py-6 flex items-center justify-between gap-8 min-w-[290px] sm:min-w-[330px] shadow-2xs">
      <span className="font-bold text-slate-900 text-base sm:text-lg leading-snug whitespace-pre-line">
        {label}
      </span>
      <div
        className={`w-16 h-16 rounded-full bg-white border-4 ${
          COLORES_BORDE[color] || COLORES_BORDE.blue
        } flex items-center justify-center text-2xl font-extrabold text-slate-900 shadow-xs shrink-0`}
      >
        {loading ? '—' : value}
      </div>
    </div>
  );
};