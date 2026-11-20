import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle } from 'lucide-react';
import api from '../../api/axiosConfig';
import { useAuth } from '../../context/AuthContext';
import { ConfirmModal } from '../../components/ui';

export default function BoletaVotacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [encuesta, setEncuesta] = useState(null);
  const [indiceActual, setIndiceActual] = useState(0);
  const [selecciones, setSelecciones] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorCarga, setErrorCarga] = useState('');
  const [avisoValidacion, setAvisoValidacion] = useState('');

  const [modalAbierto, setModalAbierto] = useState(false);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const cargarBoleta = async () => {
      try {
        const { data } = await api.get(`/votante/encuestas/${id}`);
        setEncuesta(data);
      } catch (err) {
        setErrorCarga(
          err.response?.data?.message || 'No se pudo cargar el cuestionario.'
        );
      } finally {
        setLoading(false);
      }
    };
    cargarBoleta();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-14 flex justify-center border border-slate-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-700" />
      </div>
    );
  }

  if (errorCarga || !encuesta) {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-2xs space-y-5">
        <p className="text-rose-600 font-bold text-base">
          {errorCarga || 'Cuestionario no disponible.'}
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

  const preguntas = encuesta.preguntas || [];
  const totalPreguntas = preguntas.length;
  const preguntaActual = preguntas[indiceActual];
  const esUltimaPregunta = indiceActual === totalPreguntas - 1;
  const progresoPorcentaje =
    totalPreguntas > 0 ? ((indiceActual + 1) / totalPreguntas) * 100 : 0;

  const opcionElegidaActual = preguntaActual
    ? selecciones[preguntaActual.idPregunta]
    : null;

  const handleSeleccionarOpcion = (idOpcion) => {
    setSelecciones((prev) => ({
      ...prev,
      [preguntaActual.idPregunta]: idOpcion,
    }));
    if (avisoValidacion) setAvisoValidacion('');
  };

  const handleAnterior = () => {
    setAvisoValidacion('');
    setIndiceActual((prev) => Math.max(0, prev - 1));
  };

  const handleSiguienteOFinalizar = () => {
    if (!opcionElegidaActual) {
      setAvisoValidacion('Selecciona una opción antes de continuar.');
      return;
    }

    setAvisoValidacion('');

    if (esUltimaPregunta) {
      setModalAbierto(true);
    } else {
      setIndiceActual((prev) => Math.min(totalPreguntas - 1, prev + 1));
    }
  };

  const handleConfirmarVoto = async () => {
    setEnviando(true);
    try {
      const respuestas = Object.entries(selecciones).map(
        ([idPregunta, idOpcion]) => ({
          idPregunta: Number(idPregunta),
          idOpcion: Number(idOpcion),
        })
      );

      await api.post(`/votante/encuestas/${id}/votar`, { respuestas });

      // Respaldamos la selección local para mostrar "Tu elección" en Resultados
      try {
        const mapaPrevio = JSON.parse(
          localStorage.getItem('nextvoto_mis_votos') || '{}'
        );
        mapaPrevio[`${user?.email}_${id}`] = selecciones;
        localStorage.setItem('nextvoto_mis_votos', JSON.stringify(mapaPrevio));
      } catch {
        // Ignoramos errores de almacenamiento
      }

      setModalAbierto(false);
      navigate(`/votante/encuestas/${id}/resultados`, { replace: true });
    } catch (err) {
      setModalAbierto(false);
      setAvisoValidacion(
        err.response?.data?.message || 'Ocurrió un error al registrar tu voto.'
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-8">
      {/* Título principal y advertencia */}
      <div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">
          {encuesta.titulo}
        </h1>
        <ul className="mt-1.5 pl-5 list-disc text-sm sm:text-base font-medium text-slate-800">
          <li>Responde con cuidado, solo tienes un intento</li>
        </ul>
      </div>

      {/* Tarjeta de progreso */}
      <div className="bg-white rounded-3xl px-7 py-5 shadow-2xs border border-slate-100 space-y-3.5">
        <p className="text-base sm:text-lg font-extrabold text-slate-900">
          Pregunta {indiceActual + 1} de {totalPreguntas}
        </p>
        <div className="w-full h-3 bg-[#e8effd] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progresoPorcentaje}%` }}
          />
        </div>
      </div>

      {/* Tarjeta central de la pregunta */}
      {preguntaActual && (
        <div className="max-w-2xl mx-auto bg-white rounded-3xl p-7 sm:p-10 shadow-2xs border border-slate-100">
          <p className="text-sm font-medium text-slate-500">
            Pregunta {indiceActual + 1}
          </p>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mt-2 mb-7 leading-snug">
            {preguntaActual.texto ?? preguntaActual.enunciado}
          </h2>

          <div className="space-y-4">
            {(preguntaActual.opciones || []).map((opcion) => {
              const seleccionada = opcionElegidaActual === opcion.idOpcion;

              return (
                <button
                  key={opcion.idOpcion}
                  type="button"
                  onClick={() => handleSeleccionarOpcion(opcion.idOpcion)}
                  className={`w-full text-left px-5 py-3.5 rounded-full border transition-all flex items-center gap-3.5 cursor-pointer ${
                    seleccionada
                      ? 'bg-[#dbeafe] border-blue-600 text-slate-900 font-semibold shadow-2xs'
                      : 'bg-white border-slate-400 hover:border-blue-400 hover:bg-slate-50 text-slate-800 font-medium'
                  }`}
                >
                  {/* Radio button visual */}
                  <span
                    className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                      seleccionada
                        ? 'border-blue-700 bg-white'
                        : 'border-slate-500 bg-white'
                    }`}
                  >
                    {seleccionada && (
                      <span className="w-3 h-3 rounded-full bg-blue-700" />
                    )}
                  </span>

                  <span className="text-sm sm:text-base leading-snug">
                    {opcion.texto ?? opcion.descripcion}
                  </span>
                </button>
              );
            })}
          </div>

          {avisoValidacion && (
            <p className="flex items-center justify-center gap-1.5 text-rose-600 text-xs sm:text-sm font-semibold mt-6">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{avisoValidacion}</span>
            </p>
          )}
        </div>
      )}

      {/* Botones inferiores: Anterior y Siguiente Pregunta / Enviar */}
      <div className="max-w-2xl mx-auto flex items-center justify-between pt-2">
        {indiceActual > 0 ? (
          <button
            type="button"
            onClick={handleAnterior}
            className="bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-400 font-bold text-sm sm:text-base px-8 py-2.5 rounded-full transition-colors cursor-pointer"
          >
            Anterior
          </button>
        ) : (
          <div />
        )}

        <button
          type="button"
          onClick={handleSiguienteOFinalizar}
          className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold text-sm sm:text-base px-8 py-3 rounded-full shadow-sm transition-all cursor-pointer"
        >
          {esUltimaPregunta ? 'Finalizar y Enviar' : 'Siguiente Pregunta'}
        </button>
      </div>

      {/* Modal de confirmación de voto */}
      <ConfirmModal
        isOpen={modalAbierto}
        title="¿Estás seguro de enviar tus respuestas?"
        message="Solo tienes un intento. Una vez enviado, no podrás modificar tus respuestas."
        confirmText="Sí, Enviar"
        cancelText="Revisar de Nuevo"
        variant="warning"
        isLoading={enviando}
        onConfirm={handleConfirmarVoto}
        onClose={() => setModalAbierto(false)}
      />
    </div>
  );
}