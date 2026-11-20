import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import api from '../../api/axiosConfig';
import { Badge, Button, Input } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { CargaAdmin, ConfirmacionAdmin, FiltrosAdmin, TablaAdmin } from './AdminComun';
import { mensajeError, useDatosAdmin } from './datosAdmin';

function NuevoUsuario({ alCrear, cancelar }) {
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  async function crear(evento) {
    evento.preventDefault();
    const datos = Object.fromEntries(new FormData(evento.currentTarget));
    setGuardando(true);
    setError('');

    try {
      await api.post('/admin/usuarios', datos);
      await alCrear(datos.nombre);
    } catch (error) {
      setError(mensajeError(error));
    } finally {
      setGuardando(false);
    }
  }

  return (
    <form onSubmit={crear} className="admin-create">
      <h2 className="text-base font-semibold">Nueva cuenta</h2>
      <fieldset disabled={guardando} className="grid gap-4 sm:grid-cols-2">
        <Input id="admin-nombre" name="nombre" label="Nombre completo" autoComplete="off" required minLength={3} maxLength={100} autoFocus />
        <Input id="admin-email" name="email" label="Correo electrónico" type="email" autoComplete="off" required maxLength={150} />
        <Input id="admin-telefono" name="telefono" label="Teléfono" type="tel" placeholder="+529512345678" required maxLength={16} />
        <div>
          <Input id="admin-password" name="password" label="Contraseña" type="password" autoComplete="new-password" required minLength={8} maxLength={72} aria-describedby="admin-requisito-password" />
          <p id="admin-requisito-password" className="mt-1 text-xs text-slate-600">Mínimo 8 caracteres, con mayúscula, número y símbolo.</p>
        </div>
        <label className="grid gap-1.5 text-sm font-medium" htmlFor="admin-rol-nuevo">
          Rol
          <select id="admin-rol-nuevo" name="rol" className="admin-select" defaultValue="MODERADOR">
            <option value="MODERADOR">Moderador</option>
            <option value="VOTANTE">Votante</option>
          </select>
        </label>
      </fieldset>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="secondary" onClick={cancelar} disabled={guardando}>Cancelar</Button>
        <Button type="submit" isLoading={guardando}>Crear cuenta</Button>
      </div>
    </form>
  );
}

export default function AdminUsuarios() {
  const { user } = useAuth();
  const { datos, error, cargar } = useDatosAdmin('/admin/usuarios');
  const [busqueda, setBusqueda] = useState('');
  const [rol, setRol] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [accion, setAccion] = useState(null);
  const texto = busqueda.trim().toLocaleLowerCase('es-MX');
  const usuarios = (datos ?? []).filter((usuario) => {
    const coincide = usuario.nombre.toLocaleLowerCase('es-MX').includes(texto) || usuario.email.toLowerCase().includes(texto);
    return coincide && (!rol || usuario.rol === rol);
  });

  function cambiarRol(usuario, nuevoRol) {
    setAccion({
      titulo: 'Cambiar rol',
      mensaje: `¿Cambiar el rol de ${usuario.nombre} a ${nuevoRol}?`,
      boton: 'Cambiar rol',
      variante: 'primary',
      ejecutar: () => api.patch(`/admin/usuarios/${usuario.idUsuario}/rol`, { rol: nuevoRol }),
    });
  }

  function cambiarEstado(usuario) {
    const titulo = usuario.activo ? 'Suspender cuenta' : 'Reactivar cuenta';
    setAccion({
      titulo,
      mensaje: `¿${titulo} de ${usuario.nombre}?`,
      boton: titulo,
      variante: usuario.activo ? 'danger' : 'primary',
      ejecutar: () => api.patch(`/admin/usuarios/${usuario.idUsuario}/estado`, { activo: !usuario.activo }),
    });
  }

  function eliminar(usuario) {
    setAccion({
      titulo: 'Eliminar cuenta',
      mensaje: `¿Eliminar permanentemente la cuenta de ${usuario.nombre}?`,
      boton: 'Eliminar cuenta',
      ejecutar: () => api.delete(`/admin/usuarios/${usuario.idUsuario}`),
    });
  }

  async function alCrear(nombre) {
    setBusqueda('');
    setRol('');
    setMostrarFormulario(false);
    setMensaje(`Se creó la cuenta de ${nombre}.`);
    await cargar();
  }

  return (
    <>
      <h1 className="admin-title">Gestión de usuarios</h1>
      <FiltrosAdmin>
        <div className="min-w-40 flex-1">
          <Input id="buscar-usuario" type="search" placeholder="Buscar por nombre o correo" aria-label="Buscar por nombre o correo" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} />
        </div>
        <select className="admin-select" aria-label="Filtrar por rol" value={rol} onChange={(evento) => setRol(evento.target.value)}>
          <option value="">Todos los roles</option>
          <option value="ADMIN">Administrador</option>
          <option value="MODERADOR">Moderador</option>
          <option value="VOTANTE">Votante</option>
        </select>
        {!mostrarFormulario && (
          <Button onClick={() => { setMensaje(''); setMostrarFormulario(true); }}>
            <UserPlus size={16} aria-hidden="true" /> Crear usuario
          </Button>
        )}
      </FiltrosAdmin>

      {mostrarFormulario && <NuevoUsuario alCrear={alCrear} cancelar={() => setMostrarFormulario(false)} />}
      {mensaje && <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800" role="status">{mensaje}</p>}

      {datos && !error ? (
        <TablaAdmin columnas={['Nombre y correo', 'Teléfono', 'Rol', 'Estado', 'Acciones']} vacia={!usuarios.length} mensajeVacio="No se encontraron usuarios.">
          {usuarios.map((usuario) => {
            const esMiCuenta = usuario.idUsuario === user.idUsuario;
            return (
              <tr key={usuario.idUsuario}>
                <td>
                  <div className="font-semibold">{usuario.nombre}</div>
                  <div className="break-all text-slate-600">{usuario.email}</div>
                </td>
                <td className="whitespace-nowrap">{usuario.telefono}</td>
                <td>
                  {esMiCuenta ? <Badge variant="info">Administrador</Badge> : (
                    <select className="admin-select admin-select-compact" aria-label={`Rol de ${usuario.nombre}`} value={usuario.rol} onChange={(evento) => cambiarRol(usuario, evento.target.value)}>
                      {usuario.rol === 'ADMIN' && <option value="ADMIN" disabled>Administrador</option>}
                      <option value="MODERADOR">Moderador</option>
                      <option value="VOTANTE">Votante</option>
                    </select>
                  )}
                </td>
                <td><Badge variant={usuario.activo ? 'success' : 'neutral'}>{usuario.activo ? 'Activo' : 'Inactivo'}</Badge></td>
                <td>
                  {esMiCuenta ? <span className="font-medium text-primary">Tu cuenta</span> : (
                    <div className="admin-actions">
                      <Button variant="secondary" onClick={() => cambiarEstado(usuario)}>{usuario.activo ? 'Suspender' : 'Reactivar'}</Button>
                      <Button variant="danger" onClick={() => eliminar(usuario)}>Eliminar</Button>
                    </div>
                  )}
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
