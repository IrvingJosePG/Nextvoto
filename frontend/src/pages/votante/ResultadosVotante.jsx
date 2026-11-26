import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { PreguntaResultadosCard } from '../../components/ui';

export default function ResultadosVotante() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const votosGuardados = (() => {
    try {
      const mapa = JSON.parse(localStorage.getItem('nextvoto_mis_votos') || '{}');
      return mapa[`${user?.email}_${id}`] || {};
    } catch {
      return {};
    }
  })();

  useEffect(() => {
    const cargarResultados = async () => {
      try {
        const { data } = await api.get(`/votante/encuestas/${id}/resultados`);
        setResultado(data);
      } catch (err) {
        setError(err.response?.data?.message || 'No se pudieron cargar los resultados.');
      } finally {
        setLoading(false);
      }
    };
    cargarResultados();
  }, [id]);

  const formatearFechaLarga = (fechaIso) => {
    if (!fechaIso) return 'Recientemente';
    const fecha = new Date(fechaIso);
    const dia = fecha.getDate();
    const mes = fecha.toLocaleDateString('es-MX', { month: 'long' });
    const mesCapitalizado = mes.charAt(0).toUpperCase() + mes.slice(1);
    const anio = fecha.getFullYear();
    return `${dia} de ${mesCapitalizado}, ${anio}`;
  };

  const formatearFechaLimite = (fechaIso) => {
    if (!fechaIso) return 'SIN LÍMITE';
    const fecha = new Date(fechaIso);
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = fecha
      .toLocaleDateString('es-MX', { month: 'short' })
      .replace('.', '')
      .toUpperCase();
    const anio = fecha.getFullYear();
    return `${dia} / ${mes} / ${anio}`;
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-14 flex justify-center border border-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
      </div>
    );
  }

  if (error || !resultado) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-2xs space-y-5">
        <p className="text-rose-600 font-bold text-base">
          {error || 'No se encontró información de esta votación.'}
        </p>
        <button
          type="button"
          onClick={() => navigate('/votante')}
          className="bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-sm px-8 py-3 rounded-full cursor-pointer"
        >
          Volver al Inicio
        </button>
      </div>
    );
  }

  const preguntas = resultado.preguntas || [];
  const tipo = (resultado.tipo ?? resultado.tipoEncuesta ?? 'VOTACION').toUpperCase();
  const estado = (resultado.estado ?? resultado.estadoEncuesta ?? 'ACTIVA').toUpperCase();

  const totalOpciones =
    resultado.totalOpciones ??
    preguntas.reduce((acc, p) => acc + (p.opciones?.length || 0), 0);

  const votosPrimeraPregunta =
    preguntas[0]?.opciones?.reduce(
      (acc, op) => acc + Number(op.votos ?? op.totalVotos ?? 0),
      0
    ) || 0;

  const votosRegistrados =
    resultado.totalParticipantes ?? resultado.totalVotos ?? votosPrimeraPregunta;

  const etiquetaSubtitulo =
    tipo === 'VOTACION' ? 'Votación Completada' : 'Encuesta Completada';
  const fechaSubtitulo = formatearFechaLarga(
    resultado.fechaParticipacion ?? resultado.fechaVoto
  );

  const etiquetaEstadoTarjeta =
    estado === 'CERRADA' || estado === 'FINALIZADA'
      ? tipo === 'VOTACION'
        ? 'Elección Cerrada'
        : 'Encuesta Cerrada'
      : tipo === 'VOTACION'
      ? 'Elección Activa'
      : 'Encuesta Activa';

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-6">
      {/* Encabezado centrado */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">
          {resultado.titulo ?? resultado.tituloEncuesta}
        </h1>
        <p className="text-sm sm:text-base font-medium text-slate-700">
          {etiquetaSubtitulo}: {fechaSubtitulo}
        </p>
        {resultado.descripcion && (
          <p className="text-sm text-slate-500 max-w-2xl mx-auto pt-1">
            {resultado.descripcion}
          </p>
        )}
      </div>

      {/* Tarjeta resumen de 3 columnas */}
      <div className="bg-white rounded-3xl py-6 px-4 sm:px-8 shadow-2xs border border-slate-100 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 text-center">
        <div className="py-3 sm:py-1 px-4">
          <p className="text-base sm:text-lg font-bold text-slate-900">
            Votos Registrados
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-2">
            {votosRegistrados}
          </p>
        </div>

        <div className="py-3 sm:py-1 px-4">
          <p className="text-base sm:text-lg font-bold text-slate-900">
            Opciones
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 mt-2">
            {totalOpciones}
          </p>
        </div>

        <div className="py-3 sm:py-1 px-4">
          <p className="text-base sm:text-lg font-bold text-slate-900">
            Fecha Límite
          </p>
          <p className="text-xl sm:text-2xl font-extrabold text-blue-700 mt-2.5 tracking-wide">
            {formatearFechaLimite(resultado.fechaLimite)}
          </p>
        </div>
      </div>

      {/* Tarjetas de preguntas con barras de resultados */}
      <div className="space-y-6">
        {preguntas.map((pregunta) => {
          const idElegido =
            pregunta.idOpcionSeleccionada ??
            pregunta.miOpcionId ??
            pregunta.idOpcionVotada ??
            pregunta.opcionVotadaId ??
            votosGuardados[pregunta.idPregunta] ??
            null;

          return (
            <PreguntaResultadosCard
              key={pregunta.idPregunta}
              estadoTexto={etiquetaEstadoTarjeta}
              enunciado={pregunta.texto ?? pregunta.enunciado}
              opciones={pregunta.opciones || []}
              idOpcionSeleccionada={idElegido}
              tipoGrafica={resultado.tipoGrafica}
            />
          );
        })}
      </div>

      {/* Botón inferior centrado */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={() => navigate('/votante')}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-base sm:text-lg px-10 py-3.5 rounded-full shadow-sm transition-all cursor-pointer"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}