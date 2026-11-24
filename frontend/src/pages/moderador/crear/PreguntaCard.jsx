import { Plus, Trash2, X } from 'lucide-react';
import { Input } from '../../../components/ui';
import Campo from './Campo';
import Selector from './Selector';
import { MAX_OPCIONES, TIPOS_RESPUESTA } from './constantes';

export default function PreguntaCard({ pregunta, numero, puedeQuitar, onChange, onQuitar }) {
  // Cambia un campo de esta pregunta
  const cambiar = (campo, valor) => onChange({ ...pregunta, [campo]: valor });

  const cambiarOpcion = (j, valor) =>
    cambiar('opciones', pregunta.opciones.map((o, k) => (k === j ? valor : o)));

  const agregarOpcion = () => {
    if (pregunta.opciones.length < MAX_OPCIONES) cambiar('opciones', [...pregunta.opciones, '']);
  };

  const quitarOpcion = (j) => {
    if (pregunta.opciones.length > 2) cambiar('opciones', pregunta.opciones.filter((_, k) => k !== j));
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">Pregunta {numero}</h3>
        {puedeQuitar && (
          <button type="button" onClick={onQuitar} title="Quitar pregunta" className="text-rose-600 hover:text-rose-700 cursor-pointer">
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <Input
        id={`pregunta-${numero}`}
        placeholder="Escribe la pregunta"
        value={pregunta.texto}
        maxLength={255}
        onChange={(e) => cambiar('texto', e.target.value)}
      />

      <Campo titulo="Tipo de respuesta">
        <Selector
          opciones={TIPOS_RESPUESTA}
          valor={pregunta.tipoRespuesta}
          onChange={(v) => cambiar('tipoRespuesta', v)}
        />
      </Campo>

      {/* Mínimo y máximo: solo si es opción múltiple */}
      {pregunta.tipoRespuesta === 'MULTIPLE' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id={`min-${numero}`}
            type="number"
            min={1}
            label="Mínimo de selecciones"
            value={pregunta.minSel}
            onChange={(e) => cambiar('minSel', e.target.value)}
          />
          <Input
            id={`max-${numero}`}
            type="number"
            min={1}
            label="Máximo de selecciones"
            value={pregunta.maxSel}
            onChange={(e) => cambiar('maxSel', e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pregunta.opciones.map((op, j) => (
          <div key={j} className="bg-[#f4f8fd] border border-blue-200 rounded-2xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-800">Opción {j + 1}</span>
              {pregunta.opciones.length > 2 && (
                <button type="button" onClick={() => quitarOpcion(j)} title="Quitar opción" className="text-slate-400 hover:text-rose-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <Input
              id={`op-${numero}-${j}`}
              placeholder={`Ej: Opción ${j + 1}`}
              value={op}
              maxLength={200}
              onChange={(e) => cambiarOpcion(j, e.target.value)}
            />
          </div>
        ))}

        {pregunta.opciones.length < MAX_OPCIONES && (
          <button
            type="button"
            onClick={agregarOpcion}
            className="min-h-[104px] border-2 border-dashed border-blue-300 rounded-2xl flex flex-col items-center justify-center gap-1 text-blue-700 font-bold hover:bg-blue-50 cursor-pointer"
          >
            <span>Agregar</span>
            <Plus className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}