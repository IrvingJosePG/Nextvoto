export default function Seccion({ numero, titulo, descripcion, children }) {
  return (
    <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xs">
      <div className="flex items-start gap-3 mb-6">
        <span className="w-8 h-8 shrink-0 rounded-full bg-blue-600 text-white text-sm font-bold flex items-center justify-center">
          {numero}
        </span>
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">{titulo}</h2>
          {descripcion && <p className="text-sm text-slate-500">{descripcion}</p>}
        </div>
      </div>
      <div className="space-y-6">{children}</div>
    </section>
  );
}