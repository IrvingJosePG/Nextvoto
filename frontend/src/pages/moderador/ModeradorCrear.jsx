import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, X, CheckCircle2, Copy, Check, BarChart3, PieChart } from 'lucide-react';
import api from '../../api/axiosConfig';
import { Button, Input } from '../../components/ui';

const MAX_PREGUNTAS = 15;
const MAX_OPCIONES = 10;
const preguntaVacia = () => ({ texto: '', opciones: ['', ''] });

const GRAFICAS = [
  { valor: 'BARRAS', texto: 'Barras', Icono: BarChart3 },
  { valor: 'PASTEL', texto: 'Pastel', Icono: PieChart },
];

export default function ModeradorCrear() {
  const navigate = useNavigate();

  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaLimite, setFechaLimite] = useState('');
  const [tipoGrafica, setTipoGrafica] = useState('BARRAS');
  const [preguntas, setPreguntas] = useState([preguntaVacia()]);

  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [creada, setCreada] = useState(null);
  const [copiado, setCopiado] = useState(false);

  const tipo = preguntas.length === 1 ? 'VOTACION' : 'ENCUESTA';

  const editarPregunta = (i, texto) =>
    setPreguntas((prev) => prev.map((p, idx) => (idx === i ? { ...p, texto } : p)));

  const editarOpcion = (i, j, valor) =>
    setPreguntas((prev) =>
      prev.map((p, idx) =>
        idx === i ? { ...p, opciones: p.opciones.map((o, k) => (k === j ? valor : o)) } : p
      )
    );

  const agregarOpcion = (i) =>
    setPreguntas((prev) =>
      prev.map((p, idx) =>
        idx === i && p.opciones.length < MAX_OPCIONES ? { ...p, opciones: [...p.opciones, ''] } : p
      )
    );

  const quitarOpcion = (i, j) =>
    setPreguntas((prev) =>
      prev.map((p, idx) =>
        idx === i && p.opciones.length > 2
          ? { ...p, opciones: p.opciones.filter((_, k) => k !== j) }
          : p
      )
    );

  const agregarPregunta = () =>
    setPreguntas((prev) => (prev.length < MAX_PREGUNTAS ? [...prev, preguntaVacia()] : prev));

  const quitarPregunta = (i) =>
    setPreguntas((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const conSegundos = (f) => (f.length === 16 ? `${f}:00` : f);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!titulo.trim()) return setError('El título es obligatorio.');
    if (!fechaLimite) return setError('Elige la fecha y hora límite.');
    if (new Date(fechaLimite) <= new Date()) return setError('La fecha límite debe ser futura.');
    if (fechaInicio && new Date(fechaInicio) >= new Date(fechaLimite))
      return setError('La fecha de inicio debe ser anterior a la fecha límite.');

    for (const p of preguntas) {
      if (!p.texto.trim()) return setError('Todas las preguntas necesitan un enunciado.');
      if (p.opciones.some((o) => !o.trim())) return setError('No dejes opciones vacías.');
      if (new Set(p.opciones.map((o) => o.trim().toLowerCase())).size !== p.opciones.length)
        return setError('No repitas opciones en una misma pregunta.');
    }

    const payload = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || null,
      tipo,
      fechaInicio: fechaInicio ? conSegundos(fechaInicio) : null,
      fechaLimite: conSegundos(fechaLimite),
      tipoGrafica,
      preguntas: preguntas.map((p) => ({
        texto: p.texto.trim(),
        opciones: p.opciones.map((o) => o.trim()),
      })),
    };

    setEnviando(true);
    try {
      const { data } = await api.post('/moderador/encuestas', payload);
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
      <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-2xs space-y-5">
        <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
        <h1 className="text-2xl font-extrabold text-slate-900">¡Cuestionario creado!</h1>
        <p className="text-slate-600 text-sm">Comparte este PIN con tus votantes:</p>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(creada.codigoPin);
              setCopiado(true);
            } catch {
              /* el navegador pudo bloquear el portapapeles */
            }
          }}
          className="inline-flex items-center gap-3 bg-[#dbeafe] text-blue-800 font-mono font-extrabold text-3xl px-8 py-4 rounded-2xl cursor-pointer"
        >
          {creada.codigoPin}
          {copiado ? <Check className="w-6 h-6 text-emerald-600" /> : <Copy className="w-6 h-6" />}
        </button>
        <div className="flex justify-center gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
            Crear otro
          </Button>
          <Button type="button" onClick={() => navigate('/moderador/encuestas')}>
            Ir a Mis Encuestas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl space-y-8 pb-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">
        Crear un cuestionario
      </h1>

      {/* Datos generales */}
      <section className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-100 shadow-2xs space-y-5">
        <h2 className="text-lg font-extrabold text-slate-900">Datos generales</h2>

        <Input
          id="titulo"
          label="Título o asunto"
          placeholder="Ej: Elección de jefe de grupo"
          value={titulo}
          maxLength={200}
          onChange={(e) => setTitulo(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            id="fechaInicio"
            type="datetime-local"
            label="Fecha y hora de inicio (opcional)"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
          <Input
            id="fechaLimite"
            type="datetime-local"
            label="Fecha y hora límite"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-slate-700 mb-1.5">
            Descripción (opcional)
          </label>
          <textarea
            id="descripcion"
            rows={2}
            maxLength={2000}
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </section>

      {/* Preguntas */}
      {preguntas.map((p, i) => (
        <section
          key={i}
          className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-100 shadow-2xs space-y-5"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-extrabold text-slate-900">Pregunta {i + 1}</h2>
            {preguntas.length > 1 && (
              <button
                type="button"
                onClick={() => quitarPregunta(i)}
                className="text-rose-600 hover:text-rose-700 cursor-pointer"
                title="Quitar pregunta"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>

          <Input
            id={`pregunta-${i}`}
            placeholder="Escribe la pregunta"
            value={p.texto}
            maxLength={255}
            onChange={(e) => editarPregunta(i, e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {p.opciones.map((op, j) => (
              <div
                key={j}
                className="relative bg-[#f4f8fd] border border-blue-200 rounded-2xl p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-800">Opción {j + 1}</span>
                  {p.opciones.length > 2 && (
                    <button
                      type="button"
                      onClick={() => quitarOpcion(i, j)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Quitar opción"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <Input
                  id={`op-${i}-${j}`}
                  placeholder={`Ej: Opción ${j + 1}`}
                  value={op}
                  maxLength={200}
                  onChange={(e) => editarOpcion(i, j, e.target.value)}
                />
              </div>
            ))}

            {p.opciones.length < MAX_OPCIONES && (
              <button
                type="button"
                onClick={() => agregarOpcion(i)}
                className="min-h-[104px] border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center gap-1 text-blue-700 font-bold hover:bg-blue-50 cursor-pointer"
              >
                <span>Agregar</span>
                <Plus className="w-6 h-6" />
              </button>
            )}
          </div>
        </section>
      ))}

      {/* Añadir pregunta */}
      <div className="flex flex-wrap items-center gap-4">
        {preguntas.length < MAX_PREGUNTAS && (
          <Button type="button" variant="secondary" onClick={agregarPregunta}>
            <Plus className="w-4 h-4" /> Añadir pregunta
          </Button>
        )}
        <span className="text-xs text-slate-500">
          {preguntas.length}/{MAX_PREGUNTAS} preguntas · se creará como{' '}
          <strong>{tipo === 'VOTACION' ? 'votación' : 'encuesta'}</strong>
        </span>
      </div>

      {/* Reglas */}
      <section className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-100 shadow-2xs space-y-4">
        <h2 className="text-lg font-extrabold text-slate-900">Tipo de gráfica de resultados</h2>
        <div className="flex flex-wrap gap-3">
          {GRAFICAS.map(({ valor, texto, Icono }) => (
            <button
              key={valor}
              type="button"
              onClick={() => setTipoGrafica(valor)}
              className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-bold cursor-pointer transition-colors ${
                tipoGrafica === valor
                  ? 'bg-[#dbeafe] border-blue-400 text-blue-800'
                  : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icono className="w-5 h-5" /> {texto}
            </button>
          ))}
        </div>
      </section>

      {error && (
        <p
          role="alert"
          className="text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm font-semibold"
        >
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <Button type="submit" isLoading={enviando} className="px-8 py-3">
          Crear cuestionario
        </Button>
        <Button type="button" variant="secondary" onClick={() => navigate('/moderador/encuestas')}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}