import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { StatCard, CuestionarioCard } from '../../components/ui';

export default function DashboardVotante() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [codigoPin, setCodigoPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState('');
  const [joining, setJoining] = useState(false);

  const [pendientes, setPendientes] = useState([]);
  const [totalHistorial, setTotalHistorial] = useState(0);
  const [loading, setLoading] = useState(true);

  const primerNombre = user?.nombre?.trim().split(' ')[0] || 'Usuario';

  const cargarDatosDashboard = async () => {
    try {
      const [resPendientes, resHistorial] = await Promise.all([
        api.get('/votante/pendientes'),
        api.get('/votante/historial', { params: { page: 0, size: 1 } }),
      ]);

      const listaPendientes = Array.isArray(resPendientes.data)
        ? resPendientes.data
        : resPendientes.data?.content || [];

      setPendientes(listaPendientes);
      setTotalHistorial(resHistorial.data?.totalElements || 0);
    } catch {
      setPendientes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatosDashboard();
  }, []);

  const handleUnirse = async (e) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');

    const pinLimpio = codigoPin.trim().toUpperCase();
    if (!pinLimpio) {
      setPinError('Ingresa un código PIN (ej. NV-4829)');
      return;
    }

    setJoining(true);
    try {
      await api.post('/votante/unirse', { codigoPin: pinLimpio });
      setCodigoPin('');
      setPinSuccess(`Te uniste correctamente con el PIN ${pinLimpio}.`);
      await cargarDatosDashboard();
    } catch (err) {
      const data = err.response?.data;
      setPinError(
        data?.errors?.codigoPin || data?.message || 'No se pudo canjear el código PIN.'
      );
    } finally {
      setJoining(false);
    }
  };

  const calcularEtiquetaCierre = (fechaLimite) => {
    if (!fechaLimite) return { texto: 'Abierta', urgente: false };

    const diffMs = new Date(fechaLimite) - new Date();
    if (diffMs <= 0) return { texto: 'Por cerrar', urgente: true };

    const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffHoras < 24) {
      return {
        texto: diffHoras <= 1 ? 'Cierra en menos de 1 hora' : `Cierra en ${diffHoras} horas`,
        urgente: true,
      };
    }

    return {
      texto: diffDias === 1 ? 'Cierra en 1 día' : `Cierra en ${diffDias} días`,
      urgente: diffDias <= 2,
    };
  };

  const participacionesTotales = totalHistorial + pendientes.length;

  return (
    <div className="max-w-6xl space-y-10">
      {/* Fila superior: Saludo grande + Barra de PIN */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">
          ¡Hola de nuevo, {primerNombre}! <span className="inline-block">👋</span>
        </h1>

        <div className="flex flex-col items-start lg:items-end">
          <form onSubmit={handleUnirse} className="flex items-center gap-3 w-full sm:w-auto">
            <div className="bg-[#dbeafe] p-2 rounded-full shadow-2xs flex-1 sm:w-72">
              <input
                type="text"
                value={codigoPin}
                onChange={(e) => {
                  setCodigoPin(e.target.value.toUpperCase());
                  if (pinError) setPinError('');
                }}
                placeholder="Buscar... (NV-4829)"
                className="w-full bg-white rounded-full px-5 py-2.5 text-sm sm:text-base text-slate-800 placeholder:text-slate-400 font-medium outline-none focus:ring-2 focus:ring-blue-500/40 uppercase"
              />
            </div>

            <button
              type="submit"
              disabled={joining}
              className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-xs sm:text-sm tracking-wider uppercase px-8 py-4 rounded-full shadow-sm transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2 shrink-0"
            >
              {joining && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>UNIRME</span>
            </button>
          </form>

          {pinError && (
            <p className="flex items-center gap-1.5 text-rose-600 text-xs font-semibold mt-2 px-2">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{pinError}</span>
            </p>
          )}

          {pinSuccess && (
            <p className="flex items-center gap-1.5 text-emerald-700 text-xs font-semibold mt-2 px-2">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>{pinSuccess}</span>
            </p>
          )}
        </div>
      </div>

      {/* Tarjetas de métricas reutilizables */}
      <div className="flex flex-wrap gap-7">
        <StatCard
          label="Votaciones Activas"
          value={pendientes.length}
          color="amber"
          loading={loading}
        />
        <StatCard
          label={'Participaciones\nTotales'}
          value={participacionesTotales}
          color="emerald"
          loading={loading}
        />
      </div>

      {/* Sección: Mis Cuestionarios */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Mis Cuestionarios
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-1">
          {loading
            ? 'Cargando tus votaciones pendientes...'
            : `Tienes ${pendientes.length} ${
                pendientes.length === 1 ? 'participación pendiente' : 'participaciones pendientes'
              } por responder`}
        </p>

        {loading ? (
          <div className="mt-6 bg-white rounded-3xl p-12 flex justify-center border border-slate-100 max-w-4xl">
            <Loader2 className="w-7 h-7 animate-spin text-blue-700" />
          </div>
        ) : pendientes.length === 0 ? (
          <div className="mt-6 bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-2xs max-w-2xl">
            <p className="text-base font-bold text-slate-800">
              ¡Estás al día! No tienes cuestionarios pendientes.
            </p>
            <p className="text-sm text-slate-500 mt-1">
              Ingresa un código PIN en la barra superior para unirte a una nueva votación o encuesta.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-6 max-w-5xl">
            {pendientes.map((item) => {
              const idEncuesta = item.idEncuesta ?? item.encuestaId;
              const titulo = item.titulo ?? item.tituloEncuesta;
              const cierre = calcularEtiquetaCierre(item.fechaLimite);

              return (
                <CuestionarioCard
                  key={item.idParticipacion ?? idEncuesta}
                  titulo={titulo}
                  codigoPin={item.codigoPin}
                  etiquetaCierre={cierre.texto}
                  urgente={cierre.urgente}
                  onComenzar={() => navigate(`/votante/encuestas/${idEncuesta}`)}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}