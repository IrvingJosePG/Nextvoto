import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, Copy, Check } from 'lucide-react';
import api from '../../api/axiosConfig';
import { Badge } from '../../components/ui';
import GraficaPastel from '../../components/ui/GraficaPastel';

const formatearFecha = (f) =>
  f ? new Date(f).toLocaleString('es-MX', { dateStyle: 'long', timeStyle: 'short' }) : '—';

function GraficaPregunta({ estadoTexto, enunciado, opciones, tipoGrafica }) {
  const esPastel = (tipoGrafica || '').toUpperCase() === 'PASTEL';
  const maxVotos = Math.max(...opciones.map((o) => o.votos), 0);

  return (
    <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-2xs border border-slate-100">
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 mb-8">
        <span className="text-base sm:text-lg font-extrabold text-slate-900">{estadoTexto}</span>
        <h2 className="text-sm sm:text-base font-medium text-slate-500">{enunciado}</h2>
      </div>

      {esPastel ? (
        <GraficaPastel opciones={opciones} />
      ) : (
        <div className="overflow-x-auto">
          <div className="flex items-end gap-4 min-w-max sm:min-w-0 sm:justify-around">
            {opciones.map((op) => {
              const esGanadora = maxVotos > 0 && op.votos === maxVotos;
              return (
                <div key={op.idOpcion} className="flex flex-col items-center w-20 sm:w-24 shrink-0">
                  <span className="text-xs sm:text-sm font-bold text-slate-800 mb-1 tabular-nums">
                    {Math.round(op.porcentaje)}%
                  </span>
                  <div className="h-52 w-full flex items-end">
                    <div
                      style={{ height: `${Math.max(op.porcentaje, 3)}%` }}
                      className={`w-full rounded-t-xl transition-all duration-500 ${
                        esGanadora ? 'bg-blue-600' : 'bg-[#dbe7fb]'
                      }`}
                    />
                  </div>
                  <span
                    title={op.texto}
                    className="mt-3 text-xs text-slate-700 font-medium text-center leading-tight line-clamp-2 break-words w-full"
                  >
                    {op.texto}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5">
                    {op.votos} {op.votos === 1 ? 'voto' : 'votos'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ModeradorResultados() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    let activo = true;
    const cargar = async () => {
      try {
        const res = await api.get(`/moderador/encuestas/${id}/resultados`);
        if (activo) {
          setData(res.data);
          setError('');
        }
      } catch (err) {
        if (activo) setError(err.response?.data?.message || 'No se pudieron cargar los resultados.');
      } finally {
        if (activo) setLoading(false);
      }
    };
    cargar();
    const timer = setInterval(cargar, 10000); // se actualiza solo cada 10 s
    return () => {
      activo = false;
      clearInterval(timer);
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-14 flex justify-center border border-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 text-center border border-slate-100 space-y-5">
        <p className="text-rose-600 font-bold">{error || 'No se encontró el cuestionario.'}</p>
        <button
          type="button"
          onClick={() => navigate('/moderador/encuestas')}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-sm px-8 py-3 rounded-full cursor-pointer"
        >
          Volver
        </button>
      </div>
    );
  }

  const estadoTexto = !data.activa ? 'Cerrada' : data.abierta ? 'Abierta' : 'Vencida';
  const variant = !data.activa ? 'neutral' : data.abierta ? 'success' : 'warning';

  return (
    <div className="max-w-5xl space-y-8 pb-6">
      <div className="space-y-3">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">{data.titulo}</h1>
        <Badge variant={variant}>{estadoTexto}</Badge>
      </div>

      <div className="bg-white rounded-3xl py-6 px-4 sm:px-8 shadow-2xs border border-slate-100 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-center">
        <div className="py-3 px-4">
          <p className="text-base font-bold text-slate-900">Participantes</p>
          <p className="text-3xl font-extrabold text-blue-700 mt-2">{data.totalParticipantes}</p>
        </div>
        <div className="py-3 px-4">
          <p className="text-base font-bold text-slate-900">PIN</p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(data.codigoPin);
                setCopiado(true);
                setTimeout(() => setCopiado(false), 1500);
              } catch {
                /* el navegador pudo bloquear el portapapeles */
              }
            }}
            className="inline-flex items-center gap-2 text-2xl font-mono font-extrabold text-blue-700 mt-2 cursor-pointer"
          >
            {data.codigoPin}
            {copiado ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
        <div className="py-3 px-4">
          <p className="text-base font-bold text-slate-900">Fecha límite</p>
          <p className="text-lg font-extrabold text-blue-700 mt-2.5">{formatearFecha(data.fechaLimite)}</p>
        </div>
      </div>

      <div className="space-y-6">
        {data.preguntas.map((p, i) => (
          <GraficaPregunta
            key={p.idPregunta}
            estadoTexto={`Pregunta ${i + 1} de ${data.preguntas.length}`}
            enunciado={p.texto}
            opciones={p.opciones}
             tipoGrafica={data.tipoGrafica}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => navigate('/moderador/encuestas')}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-base px-10 py-3.5 rounded-full shadow-sm cursor-pointer"
        >
          Volver a Mis Encuestas
        </button>
      </div>
    </div>
  );
}