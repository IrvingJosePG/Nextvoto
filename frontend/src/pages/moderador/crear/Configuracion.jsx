import { Input } from '../../../components/ui';
import Seccion from './Seccion';
import Campo from './Campo';
import Selector from './Selector';
import { TIPOS, TIPOS_VOTO } from './constantes';

export default function Configuracion({ form, cambiar }) {
  return (
    <Seccion numero={2} titulo="Configuración" descripcion="Define cómo se va a responder.">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Campo titulo="Tipo">
          <Selector opciones={TIPOS} valor={form.tipo} onChange={(v) => cambiar('tipo', v)} />
        </Campo>

        <Campo titulo="Tipo de voto" ayuda="Anónimo: no se sabe quién votó qué.">
          <Selector opciones={TIPOS_VOTO} valor={form.tipoVoto} onChange={(v) => cambiar('tipoVoto', v)} />
        </Campo>
      </div>

       <div className="max-w-md">
        <Input
          id="maxParticipantes"
          type="number"
          min={1}
          label="Restricción: máximo de participantes (opcional)"
          placeholder="Ejemplo: 30"
          value={form.maxParticipantes}
          onChange={(e) => cambiar('maxParticipantes', e.target.value)}
        />
      </div>
    </Seccion>
  );
}