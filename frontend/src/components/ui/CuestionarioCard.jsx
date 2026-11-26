const ESTILOS_ESTADO = {
  info: 'bg-[#dbeafe] text-blue-800',
  warning: 'bg-amber-100 text-amber-800',
  success: 'bg-emerald-100 text-emerald-800',
};

export const CuestionarioCard = ({
  titulo,
  descripcion,
  codigoPin,
  etiquetaCierre,
  urgente = false,
  estadoBadge,
  estadoVariant = 'info',
  textoSecundario,
  textoBoton = 'Comenzar',
  onComenzar,
  onAction,
}) => {
  const handleClick = onAction || onComenzar;

  return (
    <div className="bg-white rounded-3xl p-7 shadow-2xs border border-slate-100 flex flex-col justify-between min-h-[200px] hover:shadow-md transition-shadow">
      <div>
        <h3 className="text-xl font-bold text-slate-900 leading-snug line-clamp-2">
          {titulo}
        </h3>

        {descripcion && (
          <p className="text-sm text-slate-500 mt-2 line-clamp-2">
            {descripcion}
          </p>
        )}

        {estadoBadge && (
          <span
            className={`inline-block mt-3 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
              ESTILOS_ESTADO[estadoVariant] || ESTILOS_ESTADO.info
            }`}
          >
            {estadoBadge}
          </span>
        )}

        {codigoPin && !estadoBadge && (
          <span className="inline-block mt-2 text-xs font-mono font-semibold text-slate-400">
            PIN: {codigoPin}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mt-7">
        {textoSecundario ? (
          <span className="text-xs sm:text-sm font-medium text-slate-600">
            {textoSecundario}
          </span>
        ) : (
          <span
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold ${
              urgente
                ? 'bg-amber-100 text-amber-800'
                : 'bg-[#dbeafe] text-blue-800'
            }`}
          >
            {etiquetaCierre}
          </span>
        )}

        <button
          type="button"
          onClick={handleClick}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-semibold text-sm sm:text-base px-7 py-3 rounded-full shadow-xs transition-all cursor-pointer shrink-0"
        >
          {textoBoton}
        </button>
      </div>
    </div>
  );
};