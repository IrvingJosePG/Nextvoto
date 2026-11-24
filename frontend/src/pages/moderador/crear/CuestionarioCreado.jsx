import { useState } from 'react';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import { Button } from '../../../components/ui';

export default function CuestionarioCreado({ creada, onOtro, onIr }) {
  const [copiado, setCopiado] = useState(false);

  const copiarPin = async () => {
    try {
      await navigator.clipboard.writeText(creada.codigoPin);
      setCopiado(true);
    } catch {
      /* el navegador pudo bloquear el portapapeles */
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-2xs space-y-5">
      <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
      <h1 className="text-2xl font-extrabold text-slate-900">¡Cuestionario creado!</h1>
      <p className="text-slate-600 text-sm">Comparte este PIN con tus votantes:</p>

      <button
        type="button"
        onClick={copiarPin}
        className="inline-flex items-center gap-3 bg-[#dbeafe] text-blue-800 font-mono font-extrabold text-3xl px-8 py-4 rounded-2xl cursor-pointer"
      >
        {creada.codigoPin}
        {copiado ? <Check className="w-6 h-6 text-emerald-600" /> : <Copy className="w-6 h-6" />}
      </button>

      <div className="flex justify-center gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onOtro}>Crear otro</Button>
        <Button type="button" onClick={onIr}>Ir a Mis Encuestas</Button>
      </div>
    </div>
  );
}