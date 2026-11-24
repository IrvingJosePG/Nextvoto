import { useState } from 'react';
import { Search } from 'lucide-react';
import { Button, ConfirmModal } from '../../components/ui';
import { mensajeError } from './datosAdmin';

export function CargaAdmin({ error, reintentar }) {
  if (error) {
    return (
      <div className="admin-error flex flex-wrap items-center justify-between gap-3" role="alert">
        <p>{error}</p>
        <Button variant="secondary" onClick={() => reintentar()}>Reintentar</Button>
      </div>
    );
  }
  return <p className="text-sm text-slate-600" role="status">Cargando datos…</p>;
}

export function FiltrosAdmin({ children }) {
  return (
    <div className="admin-filters">
      <div className="flex items-center justify-center shrink-0 pl-1.5 text-slate-400" aria-hidden="true">
        <Search className="h-5 w-5" />
      </div>
      {children}
    </div>
  );
}

export function TablaAdmin({ columnas, children, vacia, mensajeVacio }) {
  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>{columnas.map((columna) => <th key={columna} scope="col">{columna}</th>)}</tr>
        </thead>
        <tbody>
          {vacia ? <tr><td colSpan={columnas.length}>{mensajeVacio}</td></tr> : children}
        </tbody>
      </table>
    </div>
  );
}

export function ConfirmacionAdmin({ accion, actualizar, cerrar }) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  async function confirmar() {
    setGuardando(true);
    setError('');
    try {
      await accion.ejecutar();
      await actualizar();
      cerrar();
    } catch (error) {
      setError(mensajeError(error));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ConfirmModal
      isOpen
      title={accion.titulo}
      message={accion.mensaje}
      confirmText={accion.boton}
      variant={accion.variante}
      isLoading={guardando}
      error={error}
      onConfirm={confirmar}
      onClose={cerrar}
    />
  );
}