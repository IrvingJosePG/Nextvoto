import { Input } from '../../../components/ui';
import Seccion from './Seccion';
import DateTimePicker from '../../../components/ui/DateTimePicker';

export default function DatosGenerales({ form, cambiar }) {
  return (
    <Seccion numero={1} titulo="Datos generales" descripcion="Título, fechas y descripción.">
      <Input
        id="titulo"
        label="Título o asunto"
        placeholder="Ej: Elección de representante de grupo"
        value={form.titulo}
        maxLength={200}
        onChange={(e) => cambiar('titulo', e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <DateTimePicker
          id="fechaInicio"
          label="Fecha y hora de inicio"
          value={form.fechaInicio}
          onChange={(valor) => cambiar('fechaInicio', valor)}
        />
        <DateTimePicker
          id="fechaLimite"
          label="Fecha y hora límite"
          value={form.fechaLimite}
          onChange={(valor) => cambiar('fechaLimite', valor)}
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
          value={form.descripcion}
          onChange={(e) => cambiar('descripcion', e.target.value)}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>
    </Seccion>
  );
}