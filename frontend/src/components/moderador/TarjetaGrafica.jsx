import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';

const textoVotos = (n) => `${n} ${n === 1 ? 'voto' : 'votos'}`;

const selectClase =
  'px-4 py-2 border border-slate-300 rounded-full text-sm bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20';

// Tarjeta con gráfica: el moderador elige el cuestionario y la pregunta
export default function TarjetaGrafica({ titulo, lista, orientacion, vacioTitulo, vacioTexto }) {
  const [idSel, setIdSel] = useState(lista[0]?.idEncuesta ?? null);
  const [idxPregunta, setIdxPregunta] = useState(0);
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(lista.length > 0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (idSel == null) return undefined;
    let cancelado = false;

    api
      .get(`/moderador/encuestas/${idSel}/resultados`)
      .then(({ data }) => {
        if (!cancelado) setDatos(data);
      })
      .catch(() => {
        if (!cancelado) setError('No se pudieron cargar los resultados.');
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [idSel]);

  const cambiarEncuesta = (ev) => {
    setIdSel(Number(ev.target.value));
    setIdxPregunta(0);
    setCargando(true);
    setError('');
  };

  const contenedor =
    'bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-100 flex-1 min-w-[300px]';

  if (lista.length === 0) {
    return (
      <div className={contenedor}>
        <h2 className="text-lg font-extrabold text-slate-900">{vacioTitulo}</h2>
        <p className="text-sm text-slate-500 mt-2">{vacioTexto}</p>
      </div>
    );
  }

  const preguntas = datos?.preguntas ?? [];
  const pregunta = preguntas[idxPregunta] ?? preguntas[0];
  const opciones = pregunta?.opciones ?? [];
  const totalVotos = opciones.reduce((suma, op) => suma + op.votos, 0);
  const maxVotos = Math.max(...opciones.map((op) => op.votos), 0);
  const lideres = opciones.filter((op) => maxVotos > 0 && op.votos === maxVotos);

  let resumen = '';
  if (totalVotos === 0) {
    resumen = 'Aún no hay votos en esta pregunta.';
  } else if (lideres.length > 1) {
    resumen = `Empate entre ${lideres.length} opciones con ${textoVotos(maxVotos)} cada una.`;
  } else {
    resumen = `${datos?.abierta ? 'Va ganando' : 'Ganó'}: ${lideres[0].texto} (${textoVotos(maxVotos)})`;
  }

  return (
    <div className={contenedor}>
      <h2 className="text-lg font-extrabold text-slate-900">{titulo}</h2>

      <div className="mt-3 flex flex-col gap-2">
        <select
          value={idSel}
          onChange={cambiarEncuesta}
          aria-label={`Cuestionario: ${titulo}`}
          className={`${selectClase} w-full text-xs`}
        >
          {lista.map((e) => (
            <option key={e.idEncuesta} value={e.idEncuesta}>
              {e.titulo}
            </option>
          ))}
        </select>

        {preguntas.length > 1 && (
          <select
            value={idxPregunta}
            onChange={(ev) => setIdxPregunta(Number(ev.target.value))}
            aria-label="Pregunta"
            className={`${selectClase} w-full text-xs`}
          >
            {preguntas.map((p, i) => (
              <option key={p.idPregunta} value={i}>
                {i + 1}. {p.texto}
              </option>
            ))}
          </select>
        )}
      </div>

      {cargando ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-blue-700" />
        </div>
      ) : error ? (
        <p className="text-sm text-rose-600 font-semibold py-8">{error}</p>
      ) : (
        <>
          <p className="text-sm font-semibold text-slate-700 mt-5 mb-4">{pregunta?.texto}</p>

          {totalVotos === 0 ? (
            <p className="text-sm text-slate-500 py-8 text-center">{resumen}</p>
          ) : orientacion === 'vertical' ? (
            <div className="flex items-stretch gap-3 h-44">
              {opciones.map((op) => (
                <div key={op.idOpcion} className="flex-1 min-w-0 flex flex-col">
                  <div className="flex-1 flex flex-col justify-end items-center">
                    <span className="text-[11px] font-bold text-slate-700 mb-1">{op.votos}</span>
                    <div
                      style={{ height: `${Math.max((op.votos / maxVotos) * 85, 3)}%` }}
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        op.votos === maxVotos ? 'bg-blue-600' : 'bg-[#dbe7fb]'
                      }`}
                    />
                  </div>
                  <span
                    title={op.texto}
                    className="mt-2 text-[10px] text-slate-600 truncate w-full text-center"
                  >
                    {op.texto}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {opciones.map((op) => (
                <li key={op.idOpcion} className="flex items-center gap-3">
                  <span title={op.texto} className="w-24 text-xs text-slate-600 truncate">
                    {op.texto}
                  </span>
                  <div className="flex-1 h-4 rounded-full bg-[#eef3fb] overflow-hidden">
                    <div
                      style={{ width: `${op.porcentaje}%` }}
                      className={`h-full rounded-full transition-all duration-500 ${
                        op.votos === maxVotos ? 'bg-blue-600' : 'bg-[#bcd0f5]'
                      }`}
                    />
                  </div>
                  <span className="w-20 text-xs font-bold text-slate-700 text-right">
                    {Math.round(op.porcentaje)}% · {op.votos}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {totalVotos > 0 && <p className="mt-5 text-xs font-semibold text-blue-800">{resumen}</p>}
        </>
      )}
    </div>
  );
}