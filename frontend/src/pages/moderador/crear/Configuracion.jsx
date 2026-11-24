import { Input } from '../../../components/ui';
import Seccion from './Seccion';
import Campo from './Campo';
import Selector from './Selector';
import { TIPOS, TIPOS_VOTO, SI_NO } from './constantes';

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

        <Campo titulo="¿Se permiten comentarios?">
          <Selector
            opciones={SI_NO}
            valor={form.permiteComentarios}
            onChange={(v) => cambiar('permiteComentarios', v)}
          />
        </Campo>

        <Campo titulo="Restricción: solo usuarios con cuenta">
          <Selector
            opciones={SI_NO}
            valor={form.soloRegistrados}
            onChange={(v) => cambiar('soloRegistrados', v)}
          />
        </Campo>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          id="dirigidoA"
          label="¿A quién va dirigido?"
          placeholder="Ej: Alumnos de 5to semestre de Sistemas"
          value={form.dirigidoA}
          maxLength={150}
          onChange={(e) => cambiar('dirigidoA', e.target.value)}
        />
        <Input
          id="maxParticipantes"
          type="number"
          min={1}
          label="Restricción: máximo de participantes (opcional)"
          placeholder="Ej: 30"
          value={form.maxParticipantes}
          onChange={(e) => cambiar('maxParticipantes', e.target.value)}
        />
      </div>
    </Seccion>
  );
}