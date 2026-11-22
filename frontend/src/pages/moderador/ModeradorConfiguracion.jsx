import { useState } from 'react';
import api from '../../api/axiosConfig';
import { Button, Input } from '../../components/ui';

export default function ModeradorConfiguracion() {
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setOk('');

    if (!actual) return setError('Escribe tu contraseña actual.');
    if (nueva.length < 8) return setError('La nueva contraseña debe tener al menos 8 caracteres.');
    if (nueva === actual) return setError('La nueva contraseña debe ser diferente a la actual.');
    if (nueva !== confirmar) return setError('La confirmación no coincide con la nueva contraseña.');

    setEnviando(true);
    try {
      await api.put('/moderador/password', { actual, nueva });
      setOk('Contraseña actualizada correctamente.');
      setActual('');
      setNueva('');
      setConfirmar('');
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo cambiar la contraseña.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-700 tracking-tight">Configuración</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl p-7 sm:p-9 border border-slate-100 shadow-2xs space-y-5"
      >
        <h2 className="text-lg font-extrabold text-slate-900">Cambiar contraseña</h2>

        <Input
          id="actual"
          type="password"
          label="Contraseña actual"
          value={actual}
          onChange={(e) => setActual(e.target.value)}
        />
        <Input
          id="nueva"
          type="password"
          label="Nueva contraseña"
          value={nueva}
          onChange={(e) => setNueva(e.target.value)}
        />
        <Input
          id="confirmar"
          type="password"
          label="Confirmar nueva contraseña"
          value={confirmar}
          onChange={(e) => setConfirmar(e.target.value)}
        />

        {error && (
          <p role="alert" className="text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-sm font-semibold">
            {error}
          </p>
        )}
        {ok && (
          <p className="text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm font-semibold">
            {ok}
          </p>
        )}

        <Button type="submit" isLoading={enviando} className="px-8 py-3">
          Guardar cambios
        </Button>
      </form>
    </div>
  );
}