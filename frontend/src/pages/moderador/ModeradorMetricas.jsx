import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Filter, RotateCcw, PlusCircle } from 'lucide-react';
import api from '../../api/axiosConfig';
import { Badge } from '../../components/ui';

const ORDENES = [
  { valor: 'RECIENTES', texto: 'Más recientes' },
  { valor: 'ANTIGUAS', texto: 'Más antiguas' },
  { valor: 'VOTOS', texto: 'Más votadas' },
];

const ESTADOS = [
  { valor: 'TODOS', texto: 'Todos los estados' },
  { valor: 'ABIERTA', texto: 'Abiertas' },
  { valor: 'VENCIDA', texto: 'Vencidas' },
  { valor: 'CERRADA', texto: 'Cerradas' },
];

const estadoDe = (e) => {
  if (!e.activa) return { clave: 'CERRADA', variant: 'neutral', sufijo: 'completada' };
  if (!e.abierta) return { clave: 'VENCIDA', variant: 'warning', sufijo: 'completada' };
  return { clave: 'ABIERTA', variant: 'success', sufijo: 'en curso' };
};

const formatearFecha = (f) =>
  f ? new Date(f).toLocaleDateString('es-MX', { dateStyle: 'long' }) : '—';

const lineaFecha = (e) => {
  if (!e.activa) return 'Cerrada por el moderador';
  return `${e.abierta ? 'Cierra' : 'Venció'}: ${formatearFecha(e.fechaLimite)}`;
};

const selectClase =
  'px-4 py-2 border border-slate-300 rounded-full text-sm bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20';

// Gráfica de barras verticales (tarjeta "Elección activa")
function BarrasVerticales({ data }) {
  const pregunta = data?.preguntas?.[0];
  const opciones = pregunta?.opciones ?? [];
  const maxVotos = Math.max(...opciones.map((o) => o.votos), 0);
  const etiqueta = data?.tipo === 'VOTACION' ? 'Elección activa' : 'Encuesta activa';

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-100 flex-1 min-w-[300px]">
      <h2 className="text-lg font-extrabold text-slate-900">{data ? etiqueta : 'Sin cuestionario activo'}</h2>
      <p className="text-xs text-slate-500 mb-5">{pregunta?.texto ?? 'Cuando tengas uno abierto aparecerá aquí.'}</p>
      <div className="flex items-end gap-3 h-40">
        {opciones.map((op) => (
          <div key={op.idOpcion} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
            <div
              style={{ height: `${Math.max(op.porcentaje, 3)}%` }}
              className={`w-full rounded-t-lg transition-all duration-500 ${
                maxVotos > 0 && op.votos === maxVotos ? 'bg-blue-600' : 'bg-[#dbe7fb]'
              }`}
            />
            <span title={op.texto} className="mt-2 text-[10px] text-slate-600 truncate w-full text-center">
              {op.texto}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Gráfica de barras horizontales (tarjeta "Terminada")
function BarrasHorizontales({ data }) {
  const pregunta = data?.preguntas?.[0];
  const opciones = pregunta?.opciones ?? [];
  const maxVotos = Math.max(...opciones.map((o) => o.votos), 0);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-100 flex-1 min-w-[300px]">
      <h2 className="text-lg font-extrabold text-slate-900">{data ? 'Terminada' : 'Sin cuestionarios terminados'}</h2>
      <p className="text-xs text-slate-500 mb-5">{pregunta?.texto ?? 'Aquí verás el último que se cierre o venza.'}</p>
      <ul className="space-y-3">
        {opciones.map((op) => (
          <li key={op.idOpcion} className="flex items-center gap-3">
            <span title={op.texto} className="w-24 text-xs text-slate-600 truncate">{op.texto}</span>
            <div className="flex-1 h-4 rounded-full bg-[#eef3fb] overflow-hidden">
              <div
                style={{ width: `${op.porcentaje}%` }}
                className={`h-full rounded-full transition-all duration-500 ${
                  maxVotos > 0 && op.votos === maxVotos ? 'bg-blue-600' : 'bg-[#bcd0f5]'
                }`}
              />
            </div>
            <span className="w-10 text-xs font-bold text-slate-700 text-right">{Math.round(op.porcentaje)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ModeradorMetricas() {
  const navigate = useNavigate();

  const [encuestas, setEncuestas] = useState([]);
  const [activa, setActiva] = useState(null);
  const [terminada, setTerminada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orden, setOrden] = useState('RECIENTES');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get('/moderador/encuestas');
        const lista = Array.isArray(data) ? data : [];
        setEncuestas(lista);

        // Las dos gráficas de arriba usan el cuestionario abierto y el terminado más recientes
        const recientes = [...lista].sort((a, b) => b.idEncuesta - a.idEncuesta);
        const abierta = recientes.find((e) => e.abierta);
        const cerrada = recientes.find((e) => !e.abierta);
        const [ra, rt] = await Promise.all([
          abierta ? api.get(`/moderador/encuestas/${abierta.idEncuesta}/resultados`) : null,
          cerrada ? api.get(`/moderador/encuestas/${cerrada.idEncuesta}/resultados`) : null,
        ]);
        setActiva(ra?.data ?? null);
        setTerminada(rt?.data ?? null);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudieron cargar las métricas.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const limpiarFiltros = () => {
    setOrden('RECIENTES');
    setEstadoFiltro('TODOS');
  };

  const visibles = encuestas
    .filter((e) => estadoFiltro === 'TODOS' || estadoDe(e).clave === estadoFiltro)
    .sort((a, b) => {
      if (orden === 'ANTIGUAS') return a.idEncuesta - b.idEncuesta;
      if (orden === 'VOTOS') return b.participantes - a.participantes;
      return b.idEncuesta - a.idEncuesta;
    });

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-14 flex justify-center border border-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">
        Métricas y Resultados
      </h1>

      {error && <p className="text-rose-600 font-semibold">{error}</p>}

      <div className="flex flex-wrap gap-6">
        <BarrasVerticales data={activa} />
        <BarrasHorizontales data={terminada} />
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900">Resultados</h2>

      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xs border border-slate-100 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="w-4 h-4" /> Filtrar por:
        </span>
        <select value={orden} onChange={(ev) => setOrden(ev.target.value)} className={selectClase}>
          {ORDENES.map((o) => (
            <option key={o.valor} value={o.valor}>{o.texto}</option>
          ))}
        </select>
        <select value={estadoFiltro} onChange={(ev) => setEstadoFiltro(ev.target.value)} className={selectClase}>
          {ESTADOS.map((o) => (
            <option key={o.valor} value={o.valor}>{o.texto}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={limpiarFiltros}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" /> Limpiar filtros
        </button>
        <button
          type="button"
          onClick={() => navigate('/moderador/crear')}
          className="ml-auto inline-flex items-center gap-2 text-sm font-bold text-slate-800 hover:text-blue-700 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" /> Crear cuestionario
        </button>
      </div>

      {visibles.length === 0 ? (
        <p className="text-slate-500 text-center py-10">No hay cuestionarios para mostrar.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibles.map((e) => {
            const estado = estadoDe(e);
            const total = e.maxParticipantes ?? e.participantes + (e.pendientes ?? 0);
            const tipoTexto = e.tipo === 'VOTACION' ? 'Votación' : 'Encuesta';
            return (
              <div
                key={e.idEncuesta}
                className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-100 text-center space-y-3"
              >
                <h3 className="text-lg font-extrabold text-slate-900">{e.titulo}</h3>
                <Badge variant={estado.variant}>
                  {tipoTexto} {estado.sufijo}
                </Badge>
                <p className="text-sm font-semibold text-slate-700">
                  Participaron: {e.participantes}/{total}
                </p>
                <p className="text-sm text-slate-500">{lineaFecha(e)}</p>
                <button
                  type="button"
                  onClick={() => navigate(`/moderador/encuestas/${e.idEncuesta}/resultados`)}
                  className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-sm px-8 py-2.5 rounded-full shadow-sm cursor-pointer"
                >
                  Ver detalles
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}