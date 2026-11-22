import { useEffect, useState } from 'react';
import { Loader2, Filter, RotateCcw } from 'lucide-react';
import api from '../../api/axiosConfig';

const ORDENES = [
  { valor: 'RECIENTES', texto: 'Más recientes' },
  { valor: 'NOMBRE', texto: 'Nombre (A-Z)' },
  { valor: 'PARTICIPACIONES', texto: 'Más participaciones' },
];

const formatearFecha = (f) =>
  f ? new Date(f).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const selectClase =
  'px-4 py-2 border border-slate-300 rounded-full text-sm bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20';

export default function ModeradorAlumnos() {
  const [votantes, setVotantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orden, setOrden] = useState('RECIENTES');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get('/moderador/votantes');
        setVotantes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar la lista de alumnos.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const limpiarFiltros = () => {
    setOrden('RECIENTES');
    setBusqueda('');
  };

  const texto = busqueda.toLowerCase();
  const visibles = votantes
    .filter((v) => `${v.nombre ?? ''} ${v.correo ?? ''}`.toLowerCase().includes(texto))
    .sort((a, b) => {
      if (orden === 'NOMBRE') return (a.nombre ?? '').localeCompare(b.nombre ?? '');
      if (orden === 'PARTICIPACIONES') return (b.participaciones ?? 0) - (a.participaciones ?? 0);
      return new Date(b.ultimaParticipacion ?? 0) - new Date(a.ultimaParticipacion ?? 0);
    });

  return (
    <div className="max-w-6xl space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">Mis alumnos</h1>

      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-100">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
            <Filter className="w-4 h-4" /> Filtrar por:
          </span>
          <select value={orden} onChange={(ev) => setOrden(ev.target.value)} className={selectClase}>
            {ORDENES.map((o) => (
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
            placeholder="Buscar por nombre o correo..."
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
            Todavía no hay alumnos que hayan participado en tus cuestionarios.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-slate-500 border-b border-slate-200">
                  <th className="py-3 pr-4 font-semibold">#</th>
                  <th className="py-3 pr-4 font-semibold">Nombre</th>
                  <th className="py-3 pr-4 font-semibold">Correo</th>
                  <th className="py-3 pr-4 font-semibold text-center">Cuestionarios</th>
                  <th className="py-3 font-semibold">Última participación</th>
                </tr>
              </thead>
              <tbody>
                {visibles.map((v, i) => (
                  <tr key={v.idUsuario ?? i} className="border-b border-slate-100 last:border-0">
                    <td className="py-4 pr-4 text-slate-500">{i + 1}</td>
                    <td className="py-4 pr-4 font-bold text-slate-900">{v.nombre}</td>
                    <td className="py-4 pr-4 text-slate-700">{v.correo}</td>
                    <td className="py-4 pr-4 text-center font-semibold text-slate-800">{v.participaciones ?? 0}</td>
                    <td className="py-4 text-slate-700 whitespace-nowrap">{formatearFecha(v.ultimaParticipacion)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}