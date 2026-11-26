const COLORES_PASTEL = [
  '#2563eb', // blue-600
  '#0284c7', // sky-600
  '#4f46e5', // indigo-600
  '#0d9488', // teal-600
  '#d97706', // amber-600
  '#e11d48', // rose-600
  '#7c3aed', // violet-600
  '#059669', // emerald-600
  '#ea580c', // orange-600
  '#475569', // slate-600
];

function calcularRutaRebanada(cx, cy, radio, anguloInicio, anguloFin) {
  const x1 = cx + radio * Math.cos(anguloInicio);
  const y1 = cy + radio * Math.sin(anguloInicio);
  const x2 = cx + radio * Math.cos(anguloFin);
  const y2 = cy + radio * Math.sin(anguloFin);
  const arcoGrande = anguloFin - anguloInicio > Math.PI ? 1 : 0;

  return `M ${cx} ${cy} L ${x1} ${y1} A ${radio} ${radio} 0 ${arcoGrande} 1 ${x2} ${y2} Z`;
}

export default function GraficaPastel({
  opciones = [],
  idOpcionSeleccionada = null,
  compacto = false,
}) {
  const items = opciones.map((op, idx) => {
    const votos = Number(op.votos ?? op.totalVotos ?? 0);
    return {
      ...op,
      votos,
      color: COLORES_PASTEL[idx % COLORES_PASTEL.length],
    };
  });

  const totalVotos = items.reduce((acc, item) => acc + item.votos, 0);

  let anguloActual = -Math.PI / 2;
  const rebanadas = items.map((item) => {
    const porcentaje =
      item.porcentaje !== undefined && item.porcentaje !== null
        ? Number(item.porcentaje)
        : totalVotos > 0
        ? (item.votos / totalVotos) * 100
        : 0;

    const fraccion = totalVotos > 0 ? item.votos / totalVotos : 0;
    const anguloSiguiente = anguloActual + fraccion * Math.PI * 2;
    const inicio = anguloActual;
    anguloActual = anguloSiguiente;

    return {
      ...item,
      porcentaje,
      fraccion,
      inicio,
      fin: anguloSiguiente,
    };
  });

  return (
    <div
      className={`flex items-center ${
        compacto ? 'flex-col sm:flex-row gap-5' : 'flex-col md:flex-row gap-8'
      }`}
    >
      {/* Gráfico circular SVG */}
      <div
        className={`relative shrink-0 ${
          compacto ? 'w-36 h-36' : 'w-52 h-52 sm:w-60 sm:h-60'
        }`}
      >
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {totalVotos === 0 ? (
            <circle cx="100" cy="100" r="82" fill="#e2e8f0" />
          ) : (
            rebanadas.map((reb) => {
              if (reb.votos <= 0) return null;

              if (reb.fraccion >= 0.9999) {
                return <circle key={reb.idOpcion} cx="100" cy="100" r="82" fill={reb.color} />;
              }

              return (
                <path
                  key={reb.idOpcion}
                  d={calcularRutaRebanada(100, 100, 82, reb.inicio, reb.fin)}
                  fill={reb.color}
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              );
            })
          )}
          <circle cx="100" cy="100" r="46" fill="#ffffff" />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span
            className={`font-extrabold text-slate-900 tabular-nums ${
              compacto ? 'text-xl' : 'text-2xl'
            }`}
          >
            {totalVotos}
          </span>
          <span className="text-xs font-medium text-slate-500">
            {totalVotos === 1 ? 'voto' : 'votos'}
          </span>
        </div>
      </div>

      {/* Leyenda con porcentajes y conteo */}
      <div className={`flex-1 w-full ${compacto ? 'space-y-2' : 'space-y-3'}`}>
        {rebanadas.map((reb) => {
          const esTuEleccion = Boolean(
            reb.seleccionada ||
              reb.esMiVoto ||
              reb.miVoto ||
              reb.votada ||
              reb.elegida ||
              (idOpcionSeleccionada !== null &&
                Number(idOpcionSeleccionada) === Number(reb.idOpcion))
          );

          return (
            <div
              key={reb.idOpcion}
              className={`flex items-center justify-between gap-3 border ${
                compacto ? 'px-3 py-2 rounded-xl' : 'px-4 py-3 rounded-2xl'
              } ${
                esTuEleccion
                  ? 'bg-[#eff6ff] border-blue-300'
                  : 'bg-slate-50/70 border-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: reb.color }}
                />
                <span
                  className={`font-medium text-slate-800 leading-snug break-words ${
                    compacto ? 'text-xs' : 'text-sm sm:text-base'
                  }`}
                >
                  {reb.texto ?? reb.descripcion}
                </span>
                {esTuEleccion && (
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-xs font-bold shrink-0">
                    Tu elección
                  </span>
                )}
              </div>

              <span
                className={`font-bold text-slate-800 whitespace-nowrap tabular-nums ${
                  compacto ? 'text-xs' : 'text-xs sm:text-sm'
                }`}
              >
                {Math.round(reb.porcentaje)}% ({reb.votos} {reb.votos === 1 ? 'voto' : 'votos'})
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}