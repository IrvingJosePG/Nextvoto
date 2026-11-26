import { BarChart3, PieChart } from 'lucide-react';

export const MAX_PREGUNTAS = 15;
export const MAX_OPCIONES = 10;

export const preguntaVacia = () => ({
  texto: '',
  opciones: ['', ''],
  tipoRespuesta: 'UNICA',
  minSel: 1,
  maxSel: 2,
});

export const TIPOS = [
  { valor: 'VOTACION', texto: 'Votación' },
  { valor: 'ENCUESTA', texto: 'Encuesta' },
];

export const TIPOS_VOTO = [
  { valor: 'ANONIMO', texto: 'Anónimo' },
  { valor: 'IDENTIFICADO', texto: 'Identificado' },
];

export const TIPOS_RESPUESTA = [
  { valor: 'UNICA', texto: 'Opción única' },
  { valor: 'MULTIPLE', texto: 'Opción múltiple' },
];

export const GRAFICAS = [
  { valor: 'BARRAS', texto: 'Barras', Icono: BarChart3 },
  { valor: 'PASTEL', texto: 'Pastel', Icono: PieChart },
];