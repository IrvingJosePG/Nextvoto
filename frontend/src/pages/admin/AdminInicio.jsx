import { CircleCheck, ClipboardList, Radio, Users, Vote } from 'lucide-react';
import { CargaAdmin } from './AdminComun';
import { useDatosAdmin } from './datosAdmin';

const metricas = [
  { clave: 'usuariosRegistrados', texto: 'Usuarios registrados', icono: Users },
  { clave: 'usuariosActivos', texto: 'Usuarios activos', icono: CircleCheck },
  { clave: 'encuestasTotales', texto: 'Encuestas y votaciones', icono: ClipboardList },
  { clave: 'encuestasAbiertas', texto: 'Encuestas abiertas', icono: Radio },
  { clave: 'votosEmitidos', texto: 'Votos emitidos', icono: Vote },
];

export default function AdminInicio() {
  const { datos, error, cargar } = useDatosAdmin('/admin/resumen');

  return (
    <>
      <h1 className="admin-title">Panel de administración</h1>
      {datos && !error ? (
        <dl className="admin-metrics">
          {metricas.map(({ clave, texto, icono: Icono }) => (
            <div key={clave} className="admin-metric">
              <dt><Icono size={18} aria-hidden="true" />{texto}</dt>
              <dd>{datos[clave].toLocaleString('es-MX')}</dd>
            </div>
          ))}
        </dl>
      ) : <CargaAdmin error={error} reintentar={cargar} />}
    </>
  );
}
