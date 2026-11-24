import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Filter, Loader2, PlusCircle, RotateCcw } from 'lucide-react';
import api from '../../api/axiosConfig';
import { Badge } from '../../components/ui';
import Metrica from '../../components/moderador/Metrica';

const POR_PAGINA = 10;

const TIPOS = {
  VOTACION: { texto: 'Votación', variant: 'info' },
  ENCUESTA: { texto: 'Encuesta', variant: 'neutral' },
  CUESTIONARIO: { texto: 'Cuestionario', variant: 'neutral' },
};

const ESTADOS = {
  COMPLETADA: { texto: 'Votó', variant: 'success' },
  PENDIENTE: { texto: 'Pendiente', variant: 'warning' },
};

const selectClase =
  'px-4 py-2 border border-slate-300 rounded-full text-sm bg-white text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20';

const formatearFecha = (f) =>
  f ? new Date(f).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const iniciales = (nombre = '') =>
  nombre
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase() || '')
    .join('');

export default function ModeradorParticipantes() {
  const navigate = useNavigate();

  const [participantes, setParticipantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [busqueda, setBusqueda] = useState('');
  const [tipo, setTipo] = useState('TODOS');
  const [estado, setEstado] = useState('TODOS');
  const [cuenta, setCuenta] = useState('TODAS');
  const [orden, setOrden] = useState('RECIENTES');
  const [pagina, setPagina] = useState(0);

  useEffect(() => {
    const cargar = async () => {
      try {
        const { data } = await api.get('/moderador/participantes');
        setParticipantes(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar la lista de participantes.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  // Cada filtro regresa a la primera página
  const cambiar = (setter) => (e) => {
    setter(e.target.value);
    setPagina(0);
  };

  const hayFiltros =
    busqueda !== '' || tipo !== 'TODOS' || estado !== 'TODOS' || cuenta !== 'TODAS' || orden !== 'RECIENTES';

  const limpiarFiltros = () => {
    setBusqueda('');
    setTipo('TODOS');
    setEstado('TODOS');
    setCuenta('TODAS');
    setOrden('RECIENTES');
    setPagina(0);
  };

  const texto = busqueda.trim().toLocaleLowerCase('es-MX');

  const filtrados = useMemo(() => {
    const lista = participantes.filter((p) => {
      if (tipo !== 'TODOS' && p.tipoEncuesta !== tipo) return false;
      if (estado !== 'TODOS' && p.estado !== estado) return false;
      if (cuenta === 'ACTIVAS' && !p.cuentaActiva) return false;
      if (cuenta === 'INACTIVAS' && p.cuentaActiva) return false;
      if (texto && !`${p.nombre} ${p.email}`.toLocaleLowerCase('es-MX').includes(texto)) return false;
      return true;
    });

    // El servidor ya los envía del más reciente al más antiguo
    if (orden === 'NOMBRE') {
      return [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
    }
    return lista;
  }, [participantes, tipo, estado, cuenta, orden, texto]);

  const personasUnicas = new Set(participantes.map((p) => p.idUsuario)).size;
  const hanVotado = participantes.filter((p) => p.estado === 'COMPLETADA').length;
  const pendientes = participantes.filter((p) => p.estado === 'PENDIENTE').length;

  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / POR_PAGINA));
  const paginaActual = Math.min(pagina, totalPaginas - 1);
  const inicio = paginaActual * POR_PAGINA;
  const visibles = filtrados.slice(inicio, inicio + POR_PAGINA);

  return (
    <div className="max-w-6xl space-y-8">
      {/* Sin título ni subtítulo: solo el botón, a la derecha */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => navigate('/moderador/crear')}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-sm px-6 py-3 rounded-full shadow-sm cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Crear cuestionario
        </button>
      </div>

      {error && <p className="text-rose-600 font-semibold">{error}</p>}

      {/* Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Metrica label={'Personas\nDistintas'} value={personasUnicas} color="blue" loading={loading} />
        <Metrica label={'Votos\nEmitidos'} value={hanVotado} color="emerald" loading={loading} />
        <Metrica label={'Sin votar\naún'} value={pendientes} color="amber" loading={loading} />
      </div>

      {/* Filtros */}
      <div className="bg-[#dbeafe] rounded-3xl px-5 py-4 flex flex-wrap items-center gap-3 shadow-2xs">
        <span className="flex items-center gap-2 text-sm font-bold text-blue-800">
          <Filter className="w-4 h-4" />
          Filtrar por:
        </span>

        <input
          type="search"
          value={busqueda}
          onChange={cambiar(setBusqueda)}
          placeholder="Nombre o correo"
          aria-label="Buscar por nombre o correo"
          className="px-4 py-2 rounded-full text-sm bg-white text-slate-800 placeholder:text-slate-400 w-full sm:w-56 outline-none focus:ring-2 focus:ring-blue-500/30"
        />

        <select value={tipo} onChange={cambiar(setTipo)} aria-label="Tipo de cuestionario" className={selectClase}>
          <option value="TODOS">Todos los tipos</option>
          <option value="VOTACION">Votación</option>
          <option value="ENCUESTA">Encuesta</option>
          <option value="CUESTIONARIO">Cuestionario</option>
        </select>

        <select value={estado} onChange={cambiar(setEstado)} aria-label="Estado de participación" className={selectClase}>
          <option value="TODOS">Cualquier participación</option>
          <option value="COMPLETADA">Votó</option>
          <option value="PENDIENTE">Pendiente</option>
        </select>

        <select value={cuenta} onChange={cambiar(setCuenta)} aria-label="Estado de la cuenta" className={selectClase}>
          <option value="TODAS">Todas las cuentas</option>
          <option value="ACTIVAS">Cuentas activas</option>
          <option value="INACTIVAS">Cuentas inactivas</option>
        </select>

        <select value={orden} onChange={cambiar(setOrden)} aria-label="Ordenar" className={selectClase}>
          <option value="RECIENTES">Más recientes</option>
          <option value="NOMBRE">Nombre (A-Z)</option>
        </select>

        {hayFiltros && (
          <button
            type="button"
            onClick={limpiarFiltros}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Tabla */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
          </div>
        ) : participantes.length === 0 ? (
          <div className="py-16 text-center px-6">
            <p className="text-base font-bold text-slate-800">Aún nadie se ha unido a tus cuestionarios.</p>
            <p className="text-sm text-slate-500 mt-1">
              Comparte el PIN de un cuestionario abierto para que tus votantes participen.
            </p>
          </div>
        ) : filtrados.length === 0 ? (
          <p className="py-16 text-center text-sm text-slate-500">
            No hay participantes con esos filtros.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm text-left">
                <thead>
                  <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-3.5 pl-6 pr-4 font-semibold">Participante</th>
                    <th className="py-3.5 px-4 font-semibold">Cuestionario</th>
                    <th className="py-3.5 px-4 font-semibold">Tipo</th>
                    <th className="py-3.5 px-4 font-semibold">Participación</th>
                    <th className="py-3.5 px-4 font-semibold">Fecha de voto</th>
                    <th className="py-3.5 pl-4 pr-6 font-semibold">Cuenta</th>
                  </tr>
                </thead>
                <tbody>
                  {visibles.map((p) => {
                    const tipoInfo = TIPOS[p.tipoEncuesta] || { texto: p.tipoEncuesta, variant: 'neutral' };
                    const estadoInfo = ESTADOS[p.estado] || { texto: p.estado, variant: 'neutral' };

                    return (
                      <tr key={p.idParticipacion} className="border-t border-slate-100 hover:bg-slate-50/60">
                        <td className="py-4 pl-6 pr-4">
                          <div className="flex items-center gap-3">
                            <span className="w-9 h-9 rounded-full bg-[#dbeafe] text-blue-700 text-xs font-extrabold flex items-center justify-center shrink-0">
                              {iniciales(p.nombre)}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{p.nombre}</p>
                              <p className="text-xs text-slate-500 truncate">{p.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-slate-800 font-medium">{p.tituloEncuesta}</td>
                        <td className="py-4 px-4">
                          <Badge variant={tipoInfo.variant}>{tipoInfo.texto}</Badge>
                        </td>
                        <td className="py-4 px-4">
                          <Badge variant={estadoInfo.variant}>{estadoInfo.texto}</Badge>
                        </td>
                        <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                          {formatearFecha(p.fechaVoto)}
                        </td>
                        <td className="py-4 pl-4 pr-6">
                          <Badge variant={p.cuentaActiva ? 'success' : 'danger'}>
                            {p.cuentaActiva ? 'Activa' : 'Inactiva'}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 text-sm text-slate-600">
              <span>
                Mostrando {inicio + 1}–{Math.min(inicio + POR_PAGINA, filtrados.length)} de{' '}
                {filtrados.length}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPagina(paginaActual - 1)}
                  disabled={paginaActual === 0}
                  aria-label="Página anterior"
                  className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-slate-800">
                  {paginaActual + 1} / {totalPaginas}
                </span>
                <button
                  type="button"
                  onClick={() => setPagina(paginaActual + 1)}
                  disabled={paginaActual >= totalPaginas - 1}
                  aria-label="Página siguiente"
                  className="w-9 h-9 rounded-full border border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}