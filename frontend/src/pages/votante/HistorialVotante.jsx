import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../api/axiosConfig';
import { CuestionarioCard, Button } from '../../components/ui';

export default function HistorialVotante() {
  const navigate = useNavigate();

  const [historial, setHistorial] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarHistorial = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/votante/historial', {
          params: { page, size: 6 },
        });
        const lista = Array.isArray(data) ? data : data?.content || [];
        setHistorial(lista);
        setTotalPages(data?.totalPages || 0);
      } catch {
        setHistorial([]);
      } finally {
        setLoading(false);
      }
    };
    cargarHistorial();
  }, [page]);

  const formatearFechaCompletado = (fechaIso) => {
    if (!fechaIso) return 'Completado recientemente';
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString('es-MX', { month: 'long' });
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const anio = fecha.getFullYear();
    return `Completado: ${dia} de ${mesCapitalizado}, ${anio}`;
  };

  const obtenerEstadoVisual = (item) => {
    const estado = (item.estadoEncuesta ?? item.estado ?? '').toUpperCase();
    const tipo = (item.tipoEncuesta ?? item.tipo ?? 'ENCUESTA').toUpperCase();
    const esVotacion = tipo === 'VOTACION';

    if (estado === 'CERRADA' || estado === 'FINALIZADA') {
      return {
        texto: esVotacion ? 'Votación Cerrada' : 'Encuesta Cerrada',
        variant: 'warning',
      };
    }

    if (estado === 'ACTIVA') {
      return {
        texto: esVotacion ? 'Votación Abierta' : 'Encuesta Completada',
        variant: 'info',
      };
    }

    return {
      texto: esVotacion ? 'Votación Completada' : 'Encuesta Completada',
      variant: 'info',
    };
  };

  return (
    <div className="max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Mi Historial de Resultados
        </h1>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl p-12 flex justify-center border border-slate-100 max-w-4xl">
          <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
        </div>
      ) : historial.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-2xs max-w-2xl">
          <p className="text-base font-bold text-slate-800">
            Aún no tienes resultados registrados.
          </p>
          <p className="text-sm text-slate-500 mt-1">
            Cuando completes una votación o encuesta en Inicio, aparecerá aquí para consultar sus resultados.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 max-w-5xl">
            {historial.map((item) => {
              const idEncuesta = item.idEncuesta ?? item.encuestaId;
              const titulo = item.titulo ?? item.tituloEncuesta;
              const fecha = item.fechaParticipacion ?? item.fechaVoto ?? item.fechaUnion;
              const estadoVisual = obtenerEstadoVisual(item);

              return (
                <CuestionarioCard
                  key={item.idParticipacion ?? idEncuesta}
                  titulo={titulo}
                  estadoBadge={estadoVisual.texto}
                  estadoVariant={estadoVisual.variant}
                  textoSecundario={formatearFechaCompletado(fecha)}
                  textoBoton="Ver detalles"
                  onAction={() => navigate(`/votante/encuestas/${idEncuesta}/resultados`)}
                />
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between max-w-5xl pt-2">
              <span className="text-sm text-slate-500">
                Página <span className="font-bold text-slate-800">{page + 1}</span> de{' '}
                <span className="font-bold text-slate-800">{totalPages}</span>
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </Button>
                <Button
                  variant="secondary"
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}