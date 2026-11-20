import { useState } from 'react';
import api from '../../api/axiosConfig';
import { Badge, Button, Input } from '../../components/ui';
import { CargaAdmin, ConfirmacionAdmin, FiltrosAdmin, TablaAdmin } from './AdminComun';
import { useDatosAdmin } from './datosAdmin';

const estados = {
  abierta: { texto: 'Abierta', variante: 'success' },
  vencida: { texto: 'Vencida', variante: 'warning' },
  cerrada: { texto: 'Cerrada', variante: 'neutral' },
};

function estadoEncuesta(encuesta) {
  if (encuesta.abierta) return 'abierta';
  return encuesta.activa ? 'vencida' : 'cerrada';
}

export default function AdminEncuestas() {
  const { datos, error, cargar } = useDatosAdmin('/admin/encuestas');
  const [busqueda, setBusqueda] = useState('');
  const [estado, setEstado] = useState('');
  const [accion, setAccion] = useState(null);
  const texto = busqueda.trim().toLocaleLowerCase('es-MX');
  const encuestas = (datos ?? []).filter((encuesta) => {
    const coincide = encuesta.titulo.toLocaleLowerCase('es-MX').includes(texto)
      || encuesta.moderador.toLocaleLowerCase('es-MX').includes(texto)
      || encuesta.correoModerador.toLowerCase().includes(texto);
    return coincide && (!estado || estadoEncuesta(encuesta) === estado);
  });

  function cerrarEncuesta(encuesta) {
    setAccion({
      titulo: 'Cerrar encuesta o votación',
      mensaje: `«${encuesta.titulo}» quedará cerrada y dejará de recibir votos.`,
      boton: 'Cerrar encuesta',
      variante: 'primary',
      ejecutar: () => api.patch(`/admin/encuestas/${encuesta.idEncuesta}/cerrar`),
    });
  }

  function eliminarEncuesta(encuesta) {
    setAccion({
      titulo: 'Eliminar encuesta o votación',
      mensaje: `Se eliminará «${encuesta.titulo}» junto con sus preguntas y votos. Esta acción es permanente.`,
      boton: 'Eliminar encuesta',
      ejecutar: () => api.delete(`/admin/encuestas/${encuesta.idEncuesta}`),
    });
  }

  return (
    <>
      <h1 className="admin-title">Supervisión global</h1>
      <FiltrosAdmin>
        <div className="min-w-44 flex-1">
          <Input id="buscar-encuesta" type="search" placeholder="Buscar por título o moderador" aria-label="Buscar por título o moderador" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
        </div>
        <select className="admin-select" aria-label="Filtrar por estado" value={estado} onChange={(evento) => setEstado(evento.target.value)}>
          <option value="">Todos los estados</option>
          {Object.entries(estados).map(([clave, { texto }]) => <option key={clave} value={clave}>{texto}</option>)}
        </select>
      </FiltrosAdmin>

      {datos && !error ? (
        <TablaAdmin columnas={['Título', 'Moderador', 'Participantes', 'Fecha límite', 'Estado', 'Acciones']} vacia={!encuestas.length} mensajeVacio="No se encontraron encuestas o votaciones.">
          {encuestas.map((encuesta) => {
            const estadoActual = estados[estadoEncuesta(encuesta)];
            return (
              <tr key={encuesta.idEncuesta}>
                <td>
                  <div className="min-w-40 font-semibold">{encuesta.titulo}</div>
                  <div className="text-slate-600">{encuesta.tipo === 'VOTACION' ? 'Votación' : 'Encuesta'}</div>
                </td>
                <td>
                  <div>{encuesta.moderador}</div>
                  <div className="break-all text-slate-600">{encuesta.correoModerador}</div>
                </td>
                <td>{encuesta.participantes.toLocaleString('es-MX')}</td>
                <td className="whitespace-nowrap">{new Date(encuesta.fechaLimite).toLocaleDateString('es-MX')}</td>
                <td><Badge variant={estadoActual.variante}>{estadoActual.texto}</Badge></td>
                <td>
                  <div className="admin-actions">
                    <Button variant="secondary" disabled={!encuesta.activa} onClick={() => cerrarEncuesta(encuesta)}>Cerrar</Button>
                    <Button variant="danger" onClick={() => eliminarEncuesta(encuesta)}>Eliminar</Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </TablaAdmin>
      ) : <CargaAdmin error={error} reintentar={cargar} />}

      {accion && <ConfirmacionAdmin accion={accion} actualizar={cargar} cerrar={() => setAccion(null)} />}
    </>
  );
}
