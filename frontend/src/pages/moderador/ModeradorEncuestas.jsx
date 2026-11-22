import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, Copy, Check, BarChart3, Lock, Trash2, PlusCircle, Filter, RotateCcw } from 'lucide-react';
import api from '../../api/axiosConfig';
import { StatCard, Badge, ConfirmModal } from '../../components/ui';

const ORDENES = [
  { valor: 'RECIENTES', texto: 'Más recientes' },
  { valor: 'ANTIGUAS', texto: 'Más antiguas' },
  { valor: 'VOTOS', texto: 'Más votadas' },
  { valor: 'LIMITE', texto: 'Próximas a cerrar' },
];

const ESTADOS = [
  { valor: 'TODOS', texto: 'Todos los estados' },
  { valor: 'ABIERTA', texto: 'Abiertas' },
  { valor: 'VENCIDA', texto: 'Vencidas' },
  { valor: 'CERRADA', texto: 'Cerradas' },
];

const estadoDe = (e) => {
  if (!e.activa) return { clave: 'CERRADA', texto: 'Cerrada', variant: 'neutral' };
  if (!e.abierta) return { clave: 'VENCIDA', texto: 'Vencida', variant: 'warning' };
  return { clave: 'ABIERTA', texto: 'Abierta', variant: 'success' };
};

const formatearFecha = (f) =>
  f ? new Date(f).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const ordenar = (lista, orden) => {
  const copia = [...lista];
  if (orden === 'ANTIGUAS') return copia.sort((a, b) => a.idEncuesta - b.idEncuesta);
  if (orden === 'VOTOS') return copia.sort((a, b) => b.participantes - a.participantes);
  if (orden === 'LIMITE')
    return copia.sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite));
  return copia.sort((a, b) => b.idEncuesta - a.idEncuesta);
};

const selectClase =
  'px-4 py-2 border border-slate-300 rounded-full text-sm bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20';

export default function ModeradorEncuestas() {
  const navigate = useNavigate();

  const [resumen, setResumen] = useState(null);
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orden, setOrden] = useState('RECIENTES');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');
  const [busqueda, setBusqueda] = useState('');
  const [copiado, setCopiado] = useState(null);

  const [accion, setAccion] = useState(null); // { tipo: 'cerrar' | 'eliminar', encuesta }
  const [accionLoading, setAccionLoading] = useState(false);
  const [accionError, setAccionError] = useState('');

  const cargar = async () => {
    try {
      const [resRes, resEnc] = await Promise.all([
        api.get('/moderador/resumen'),
        api.get('/moderador/encuestas'),
      ]);
      setResumen(resRes.data);
      setEncuestas(Array.isArray(resEnc.data) ? resEnc.data : []);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudieron cargar tus encuestas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const limpiarFiltros = () => {
    setOrden('RECIENTES');
    setEstadoFiltro('TODOS');
    setBusqueda('');
  };

  const copiarPin = async (e) => {
    try {
      await navigator.clipboard.writeText(e.codigoPin);
      setCopiado(e.idEncuesta);
      setTimeout(() => setCopiado(null), 1500);
    } catch {
      /* el navegador pudo bloquear el portapapeles */
    }
  };

  const confirmarAccion = async () => {
    if (!accion) return;
    setAccionLoading(true);
    setAccionError('');
    try {
      const id = accion.encuesta.idEncuesta;
      if (accion.tipo === 'cerrar') await api.patch(`/moderador/encuestas/${id}/cerrar`);
      else await api.delete(`/moderador/encuestas/${id}`);
      setAccion(null);
      await cargar();
    } catch (err) {
      setAccionError(err.response?.data?.message || 'No se pudo completar la acción.');
    } finally {
      setAccionLoading(false);
    }
  };

  const visibles = ordenar(
    encuestas.filter((e) => {
      if (!e.titulo.toLowerCase().includes(busqueda.toLowerCase())) return false;
      if (estadoFiltro !== 'TODOS' && estadoDe(e).clave !== estadoFiltro) return false;
      return true;
    }),
    orden
  );

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">
          Mis Encuestas
        </h1>
        <button
          type="button"
          onClick={() => navigate('/moderador/crear')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-sm px-6 py-3 rounded-full shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Crear cuestionario
        </button>
      </div>

      <div className="flex flex-wrap gap-7">
        <StatCard label={'Cuestionarios\nActivos'} value={resumen?.encuestasActivas ?? 0} color="amber" loading={loading} />
        <StatCard label={'Total de\nCuestionarios'} value={resumen?.encuestasTotales ?? 0} color="blue" loading={loading} />
        <StatCard label={'Votos\nEmitidos'} value={resumen?.votosEmitidos ?? 0} color="emerald" loading={loading} />
        <StatCard label={'Tasa de\nParticipación'} value={`${resumen?.tasaParticipacion ?? 0}%`} color="rose" loading={loading} />
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-100">
        {/* Barra de filtros */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
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
          <input
            value={busqueda}
            onChange={(ev) => setBusqueda(ev.target.value)}
            placeholder="Buscar por título..."
            className="ml-auto px-4 py-2 border border-slate-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
          </div>
        ) : error ? (
          <p className="text-rose-600 font-semibold text-center py-8">{error}</p>
        ) : visibles.length === 0 ? (
          <p className="text-slate-500 text-center py-10">
            No hay cuestionarios para mostrar.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="py-3 pr-4 font-semibold">Título</th>
                  <th className="py-3 pr-4 font-semibold">PIN</th>
                  <th className="py-3 pr-4 font-semibold">Fecha límite</th>
                  <th className="py-3 pr-4 font-semibold text-center">Votaron</th>
                  <th className="py-3 pr-4 font-semibold">Estado</th>
                  <th className="py-3 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((e) => {
                  const estado = estadoDe(e);
                  const total = e.participantes + (e.pendientes ?? 0);
                  return (
                    <tr key={e.idEncuesta} className="border-b border-slate-100 last:border-0">
                      <td className="py-4 pr-4">
                        <p className="font-bold text-slate-900">{e.titulo}</p>
                        <p className="text-xs text-slate-500">
                          {e.tipo === 'VOTACION' ? 'Votación' : 'Encuesta'} · {e.totalPreguntas}{' '}
                          {e.totalPreguntas === 1 ? 'pregunta' : 'preguntas'}
                        </p>
                      </td>
                      <td className="py-4 pr-4">
                        <button
                          type="button"
                          onClick={() => copiarPin(e)}
                          title="Copiar PIN"
                          className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono font-semibold text-slate-700 hover:text-blue-700 cursor-pointer"
                        >
                          {e.codigoPin}
                          {copiado === e.idEncuesta ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </td>
                      <td className="py-4 pr-4 text-slate-700 whitespace-nowrap">{formatearFecha(e.fechaLimite)}</td>
                      <td className="py-4 pr-4 text-center font-semibold text-slate-800 whitespace-nowrap">
                        {e.participantes}/{total}
                      </td>
                      <td className="py-4 pr-4">
                        <Badge variant={estado.variant}>{estado.texto}</Badge>
                      </td>
                      <td className="py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="Ver resultados"
                            onClick={() => navigate(`/moderador/encuestas/${e.idEncuesta}/resultados`)}
                            className="p-2 rounded-lg bg-[#dbeafe] text-blue-700 hover:bg-blue-200 cursor-pointer"
                          >
                            <BarChart3 className="w-4 h-4" />
                          </button>
                          {e.activa && (
                            <button
                              type="button"
                              title="Cerrar votación"
                              onClick={() => setAccion({ tipo: 'cerrar', encuesta: e })}
                              className="p-2 rounded-lg bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer"
                            >
                              <Lock className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            title="Eliminar"
                            onClick={() => setAccion({ tipo: 'eliminar', encuesta: e })}
                            className="p-2 rounded-lg bg-rose-100 text-rose-600 hover:bg-rose-200 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={Boolean(accion)}
        variant={accion?.tipo === 'eliminar' ? 'danger' : 'warning'}
        title={accion?.tipo === 'eliminar' ? '¿Eliminar cuestionario?' : '¿Cerrar cuestionario?'}
        message={
          accion?.tipo === 'eliminar'
            ? `Se eliminará "${accion?.encuesta.titulo}" de forma permanente.`
            : `Nadie más podrá votar en "${accion?.encuesta.titulo}". Los resultados se conservan.`
        }
        confirmText={accion?.tipo === 'eliminar' ? 'Sí, eliminar' : 'Sí, cerrar'}
        cancelText="Cancelar"
        isLoading={accionLoading}
        error={accionError}
        onConfirm={confirmarAccion}
        onClose={() => {
          setAccion(null);
          setAccionError('');
        }}
      />
    </div>
  );
}