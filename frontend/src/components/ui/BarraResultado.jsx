export const BarraResultado = ({
  etiqueta,
  votos = 0,
  porcentaje = 0,
  esGanadora = false,
  esTuEleccion = false,
}) => {
  const porcentajeNumero = Number(porcentaje) || 0;
  const porcentajeRedondeado = Math.round(porcentajeNumero);

  const anchoBarra = esTuEleccion
    ? Math.max(porcentajeNumero, 32)
    : Math.max(porcentajeNumero, 8);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5">
      {/* Texto completo de la opción sin recorte */}
      <div className="sm:w-52 md:w-60 shrink-0 text-sm sm:text-base font-medium text-slate-700 leading-snug">
        {etiqueta}
      </div>

      {/* Barra proporcional + porcentaje y conteo */}
      <div className="flex-1 flex items-center gap-3.5 min-w-0">
        <div
          style={{ width: `${Math.min(anchoBarra, 75)}%` }}
          className={`min-h-10 py-1.5 rounded-xl flex items-center justify-center px-3.5 transition-all duration-500 shrink-0 ${
            esGanadora
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xs'
              : esTuEleccion
              ? 'bg-[#dbeafe] border border-blue-300 text-blue-900'
              : 'bg-[#e8effd] text-slate-900'
          }`}
        >
          {esTuEleccion && (
            <span className="text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap">
              Tu elección
            </span>
          )}
        </div>

        <span className="text-xs sm:text-sm font-bold text-slate-800 whitespace-nowrap tabular-nums">
          {porcentajeRedondeado}% ({votos} {votos === 1 ? 'voto' : 'votos'})
        </span>
      </div>
    </div>
  );
};