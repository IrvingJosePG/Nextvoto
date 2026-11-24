import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import api from '../../api/axiosConfig';
import { Button } from '../../components/ui';
import Seccion from './crear/Seccion';
import Selector from './crear/Selector';
import DatosGenerales from './crear/DatosGenerales';
import Configuracion from './crear/Configuracion';
import PreguntaCard from './crear/PreguntaCard';
import CuestionarioCreado from './crear/CuestionarioCreado';
import validar from './crear/validar';
import { MAX_PREGUNTAS, preguntaVacia, GRAFICAS } from './crear/constantes';

const formInicial = {
  titulo: '',
  descripcion: '',
  fechaInicio: '',
  fechaLimite: '',
  tipo: 'VOTACION',
  dirigidoA: '',
  tipoVoto: 'ANONIMO',
  permiteComentarios: false,
  maxParticipantes: '',
  soloRegistrados: true,
  tipoGrafica: 'BARRAS',
};

const conSegundos = (f) => (f.length === 16 ? `${f}:00` : f);

export default function ModeradorCrear() {
  const navigate = useNavigate();

  const [form, setForm] = useState(formInicial);
  const [preguntas, setPreguntas] = useState([preguntaVacia()]);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [creada, setCreada] = useState(null);

  const cambiar = (campo, valor) => setForm((prev) => ({ ...prev, [campo]: valor }));

  const cambiarPregunta = (i, nueva) =>
    setPreguntas((prev) => prev.map((p, idx) => (idx === i ? nueva : p)));

  const agregarPregunta = () => setPreguntas((prev) => [...prev, preguntaVacia()]);

  const quitarPregunta = (i) => setPreguntas((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mensaje = validar(form, preguntas);
    setError(mensaje);
    if (mensaje) return;

    const datos = {
      titulo: form.titulo.trim(),
      descripcion: form.descripcion.trim() || null,
      tipo: form.tipo,
      dirigidoA: form.dirigidoA.trim(),
      tipoVoto: form.tipoVoto,
      permiteComentarios: form.permiteComentarios,
      maxParticipantes: form.maxParticipantes === '' ? null : Number(form.maxParticipantes),
      soloRegistrados: form.soloRegistrados,
      fechaInicio: conSegundos(form.fechaInicio),
      fechaLimite: conSegundos(form.fechaLimite),
      tipoGrafica: form.tipoGrafica,
      preguntas: preguntas.map((p) => ({
        texto: p.texto.trim(),
        opciones: p.opciones.map((o) => o.trim()),
        tipoRespuesta: p.tipoRespuesta,
        minSelecciones: p.tipoRespuesta === 'MULTIPLE' ? Number(p.minSel) : null,
        maxSelecciones: p.tipoRespuesta === 'MULTIPLE' ? Number(p.maxSel) : null,
      })),
    };

    setEnviando(true);
    try {
      const { data } = await api.post('/moderador/encuestas', datos);
      setCreada(data);
    } catch (err) {
      const data = err.response?.data;
      const detalle = data?.errors ? Object.values(data.errors).join(' · ') : '';
      setError(detalle || data?.message || 'No se pudo crear el cuestionario.');
    } finally {
      setEnviando(false);
    }
  };

  if (creada) {
    return (
      <CuestionarioCreado
        creada={creada}
        onOtro={() => window.location.reload()}
        onIr={() => navigate('/moderador/encuestas')}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-6 pb-8">
      <DatosGenerales form={form} cambiar={cambiar} />
      <Configuracion form={form} cambiar={cambiar} />

      <Seccion numero={3} titulo="Preguntas" descripcion={`${preguntas.length} de ${MAX_PREGUNTAS} preguntas`}>
        {preguntas.map((p, i) => (
          <PreguntaCard
            key={i}
            pregunta={p}
            numero={i + 1}
            puedeQuitar={preguntas.length > 1}
            onChange={(nueva) => cambiarPregunta(i, nueva)}
            onQuitar={() => quitarPregunta(i)}
          />
        ))}

        {preguntas.length < MAX_PREGUNTAS && (
          <Button type="button" variant="secondary" onClick={agregarPregunta}>
            <Plus className="w-4 h-4" /> Añadir pregunta
          </Button>
        )}
      </Seccion>

      <Seccion numero={4} titulo="Resultados" descripcion="Tipo de gráfica con la que verás los resultados.">
        <Selector opciones={GRAFICAS} valor={form.tipoGrafica} onChange={(v) => cambiar('tipoGrafica', v)} />
      </Seccion>

      {error && (
        <p role="alert" className="text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm font-semibold">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={() => navigate('/moderador/encuestas')}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={enviando} className="px-8 py-3">
          Crear cuestionario
        </Button>
      </div>
    </form>
  );
}