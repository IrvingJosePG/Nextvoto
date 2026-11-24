export default function Selector({ opciones, valor, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl">
      {opciones.map((o) => (
        <button
          key={String(o.valor)}
          type="button"
          onClick={() => onChange(o.valor)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer transition-colors ${
            valor === o.valor
              ? 'bg-white text-blue-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          {o.Icono && <o.Icono className="w-4 h-4" />}
          {o.texto}
        </button>
      ))}
    </div>
  );
}