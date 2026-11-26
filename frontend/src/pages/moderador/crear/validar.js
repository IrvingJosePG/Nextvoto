export default function validar(form, preguntas) {
  if (!form.titulo.trim()) return 'El título es obligatorio.';
  if (!form.fechaInicio) return 'Elige la fecha y hora de inicio.';
  if (!form.fechaLimite) return 'Elige la fecha y hora límite.';
  if (new Date(form.fechaLimite) <= new Date()) return 'La fecha límite debe ser futura.';
  if (new Date(form.fechaInicio) >= new Date(form.fechaLimite))
    return 'La fecha de inicio debe ser anterior a la fecha límite.';
  if (form.maxParticipantes !== '' && Number(form.maxParticipantes) < 1)
    return 'El máximo de participantes debe ser al menos 1.';
  if (form.tipo === 'VOTACION' && preguntas.length > 1)
    return 'Una votación solo puede tener 1 pregunta. Usa Encuesta para varias.';

  for (const p of preguntas) {
    if (!p.texto.trim()) return 'Todas las preguntas necesitan un enunciado.';
    if (p.opciones.some((o) => !o.trim())) return 'No dejes opciones vacías.';

    const sinRepetir = new Set(p.opciones.map((o) => o.trim().toLowerCase()));
    if (sinRepetir.size !== p.opciones.length) return 'No repitas opciones en una misma pregunta.';

    if (p.tipoRespuesta === 'MULTIPLE') {
      const min = Number(p.minSel);
      const max = Number(p.maxSel);
      if (min < 1) return 'El mínimo de selecciones debe ser al menos 1.';
      if (min > max) return 'El mínimo no puede ser mayor que el máximo.';
      if (max > p.opciones.length) return 'El máximo no puede ser mayor que el número de opciones.';
    }
  }
  return '';
}