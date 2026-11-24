import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Loader2, PlusCircle, RotateCcw } from 'lucide-react';
import api from '../../api/axiosConfig';
import { Badge } from '../../components/ui';
import TarjetaGrafica from '../../components/moderador/TarjetaGrafica';

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

const TIPOS = [
  { valor: 'TODOS', texto: 'Todos los tipos' },
  { valor: 'VOTACION', texto: 'Votaciones' },
  { valor: 'ENCUESTA', texto: 'Encuestas' },
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

export default function ModeradorMetricas() {
  const navigate = useNavigate();

  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('TODOS');
  const [estadoFiltro, setEstadoFiltro] = useState('TODOS');
  const [orden, setOrden] = useState('RECIENTES');

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get('/moderador/encuestas');
        setEncuestas(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudieron cargar las métricas.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const recientes = useMemo(
    () => [...encuestas].sort((a, b) => b.idEncuesta - a.idEncuesta),
    [encuestas]
  );
  const abiertas = recientes.filter((e) => e.abierta);
  const terminadas = recientes.filter((e) => !e.abierta);

  const texto = busqueda.trim().toLocaleLowerCase('es-MX');

  const visibles = useMemo(() => {
    return encuestas
      .filter((e) => tipo === 'TODOS' || e.tipo === tipo)
      .filter((e) => estadoFiltro === 'TODOS' || estadoDe(e).clave === estadoFiltro)
      .filter(
        (e) =>
          !texto ||
          e.titulo.toLocaleLowerCase('es-MX').includes(texto) ||
          e.codigoPin.toLocaleLowerCase('es-MX').includes(texto)
      )
      .sort((a, b) => {
        if (orden === 'ANTIGUAS') return a.idEncuesta - b.idEncuesta;
        if (orden === 'VOTOS') return b.participantes - a.participantes;
        return b.idEncuesta - a.idEncuesta;
      });
  }, [encuestas, tipo, estadoFiltro, texto, orden]);

  const hayFiltros = busqueda !== '' || tipo !== 'TODOS' || estadoFiltro !== 'TODOS' || orden !== 'RECIENTES';

  const limpiarFiltros = () => {
    setBusqueda('');
    setTipo('TODOS');
    setEstadoFiltro('TODOS');
    setOrden('RECIENTES');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-14 flex justify-center border border-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">
          Métricas y Resultados
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Elige un cuestionario en cada gráfica para ver cómo van las votaciones.
        </p>
      </div>

      {error && <p className="text-rose-600 font-semibold">{error}</p>}

      <div className="flex flex-wrap gap-6">
        <TarjetaGrafica
          key={`abiertas-${abiertas.length}`}
          titulo="Cuestionario activo"
          lista={abiertas}
          orientacion="vertical"
          vacioTitulo="Sin cuestionario activo"
          vacioTexto="Cuando tengas uno abierto aparecerá aquí."
        />
        <TarjetaGrafica
          key={`terminadas-${terminadas.length}`}
          titulo="Terminado"
          lista={terminadas}
          orientacion="horizontal"
          vacioTitulo="Sin cuestionarios terminados"
          vacioTexto="Aquí verás los que se cierren o venzan."
        />
      </div>

      <h2 className="text-2xl font-extrabold text-slate-900">Resultados</h2>

      <div className="bg-white rounded-3xl p-4 sm:p-5 shadow-2xs border border-slate-100 flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
          <Filter className="w-4 h-4" /> Filtrar por:
        </span>

        <input
          type="search"
          value={busqueda}
          onChange={(ev) => setBusqueda(ev.target.value)}
          placeholder="Título o PIN"
          aria-label="Buscar por título o PIN"
          className="px-4 py-2 rounded-full text-sm bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 w-full sm:w-48 outline-none focus:ring-2 focus:ring-blue-500/20"
        />

        <select value={tipo} onChange={(ev) => setTipo(ev.target.value)} aria-label="Tipo" className={selectClase}>
          {TIPOS.map((o) => (
            <option key={o.valor} value={o.valor}>{o.texto}</option>
          ))}
        </select>

        <select value={estadoFiltro} onChange={(ev) => setEstadoFiltro(ev.target.value)} aria-label="Estado" className={selectClase}>
          {ESTADOS.map((o) => (
            <option key={o.valor} value={o.valor}>{o.texto}</option>
          ))}
        </select>

        <select value={orden} onChange={(ev) => setOrden(ev.target.value)} aria-label="Orden" className={selectClase}>
          {ORDENES.map((o) => (
            <option key={o.valor} value={o.valor}>{o.texto}</option>
          ))}
        </select>

        {hayFiltros && (
          <button
            type="button"
            onClick={limpiarFiltros}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" /> Limpiar filtros
          </button>
        )}

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
            const total = e.participantes + (e.pendientes ?? 0);
            const avance = total > 0 ? Math.round((e.participantes / total) * 100) : 0;
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
                <p className="text-xs text-slate-500 font-mono">PIN {e.codigoPin}</p>

                <div>
                  <p className="text-sm font-semibold text-slate-700">
                    Participaron: {e.participantes}/{total}
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-[#eef3fb] overflow-hidden">
                    <div
                      style={{ width: `${avance}%` }}
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                    />
                  </div>
                </div>

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