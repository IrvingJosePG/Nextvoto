import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, PlusCircle } from 'lucide-react';
import api from '../../api/axiosConfig';
import { StatCard, Badge } from '../../components/ui';

const formatearFecha = (f) =>
  f ? new Date(f).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const estadoDe = (e) => {
  if (!e.activa) return { texto: 'Cerrada', variant: 'neutral' };
  if (!e.abierta) return { texto: 'Vencida', variant: 'warning' };
  return { texto: 'Abierta', variant: 'success' };
};

function ListaEncuestas({ titulo, vacio, items, onAbrir }) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xs border border-slate-100 flex-1 min-w-[300px]">
      <h2 className="text-lg font-extrabold text-slate-900 mb-4">{titulo}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-slate-500 py-4">{vacio}</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {items.map((e) => {
            const estado = estadoDe(e);
            return (
              <li key={e.idEncuesta}>
                <button
                  type="button"
                  onClick={() => onAbrir(e.idEncuesta)}
                  className="w-full flex items-center justify-between gap-3 py-3 text-left cursor-pointer hover:bg-slate-50 rounded-lg px-2"
                >
                  <span>
                    <span className="block font-bold text-slate-900">{e.titulo}</span>
                    <span className="block text-xs text-slate-500">
                      Cierra: {formatearFecha(e.fechaLimite)}
                    </span>
                  </span>
                  <Badge variant={estado.variant}>{estado.texto}</Badge>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function ModeradorInicio() {
  const navigate = useNavigate();

  const [resumen, setResumen] = useState(null);
  const [encuestas, setEncuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      try {
        const [resRes, resEnc] = await Promise.all([
          api.get('/moderador/resumen'),
          api.get('/moderador/encuestas'),
        ]);
        setResumen(resRes.data);
        setEncuestas(Array.isArray(resEnc.data) ? resEnc.data : []);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudo cargar el inicio.');
      } finally {
        setLoading(false);
      }
    };
    cargar();
  }, []);

  const proximas = encuestas
    .filter((e) => e.abierta)
    .sort((a, b) => new Date(a.fechaLimite) - new Date(b.fechaLimite))
    .slice(0, 3);

  const recientes = [...encuestas].sort((a, b) => b.idEncuesta - a.idEncuesta).slice(0, 3);

  const verResultados = (id) => navigate(`/moderador/encuestas/${id}/resultados`);

  return (
    <div className="max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">Inicio</h1>
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

      <div className="flex flex-wrap gap-7">
        <StatCard label={'Cuestionarios\nActivos'} value={resumen?.encuestasActivas ?? 0} color="amber" loading={loading} />
        <StatCard label={'Votos\nEmitidos'} value={resumen?.votosEmitidos ?? 0} color="emerald" loading={loading} />
        <StatCard label={'Tasa de\nParticipación'} value={`${resumen?.tasaParticipacion ?? 0}%`} color="rose" loading={loading} />
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          <ListaEncuestas
            titulo="Próximas a cerrar"
            vacio="No tienes cuestionarios abiertos."
            items={proximas}
            onAbrir={verResultados}
          />
          <ListaEncuestas
            titulo="Últimos creados"
            vacio="Aún no has creado cuestionarios."
            items={recientes}
            onAbrir={verResultados}
          />
        </div>
      )}
    </div>
  );
}