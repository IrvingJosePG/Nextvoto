import { BarraResultado } from './BarraResultado';

export const PreguntaResultadosCard = ({
  estadoTexto = 'Elección Activa',
  enunciado,
  opciones = [],
  idOpcionSeleccionada = null,
}) => {
  const totalVotosPregunta = opciones.reduce(
    (acc, op) => acc + Number(op.votos ?? op.totalVotos ?? 0),
    0
  );

  const maxVotos = Math.max(
    ...opciones.map((op) => Number(op.votos ?? op.totalVotos ?? 0)),
    0
  );

  return (
    <div className="bg-white rounded-3xl p-7 sm:p-9 shadow-2xs border border-slate-100">
      {/* Cabecera de la pregunta */}
      <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 mb-7">
        <span className="text-base sm:text-lg font-extrabold text-slate-900">
          {estadoTexto}
        </span>
        <h2 className="text-sm sm:text-base font-medium text-slate-500">
          {enunciado}
        </h2>
      </div>

      {/* Lista de barras de resultado */}
      <div className="space-y-4">
        {opciones.map((opcion) => {
          const votos = Number(opcion.votos ?? opcion.totalVotos ?? 0);
          const porcentajeCalculado =
            opcion.porcentaje !== undefined && opcion.porcentaje !== null
              ? Number(opcion.porcentaje)
              : totalVotosPregunta > 0
              ? (votos / totalVotosPregunta) * 100
              : 0;

          const esGanadora = maxVotos > 0 && votos === maxVotos;
          const esTuEleccion = Boolean(
            opcion.seleccionada ||
              opcion.esMiVoto ||
              opcion.miVoto ||
              opcion.votada ||
              opcion.elegida ||
              (idOpcionSeleccionada !== null &&
                Number(idOpcionSeleccionada) === Number(opcion.idOpcion))
          );

          return (
            <BarraResultado
              key={opcion.idOpcion}
              etiqueta={opcion.texto ?? opcion.descripcion}
              votos={votos}
              porcentaje={porcentajeCalculado}
              esGanadora={esGanadora}
              esTuEleccion={esTuEleccion}
            />
          );
        })}
      </div>
    </div>
  );
};