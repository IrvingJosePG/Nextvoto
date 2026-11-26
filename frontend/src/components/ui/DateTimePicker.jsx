import { useEffect, useRef, useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Clock } from 'lucide-react';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DIAS_SEMANA = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do'];

const HORAS_12 = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTOS = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function parsearValor(valor) {
  if (!valor || valor.length < 16) return null;
  const [fechaParte, horaParte] = valor.split('T');
  if (!fechaParte || !horaParte) return null;

  const [anio, mes, dia] = fechaParte.split('-').map(Number);
  const [hora24, minuto] = horaParte.split(':').map(Number);
  if ([anio, mes, dia, hora24, minuto].some(Number.isNaN)) return null;

  const periodo = hora24 >= 12 ? 'PM' : 'AM';
  const hora12 = hora24 % 12 === 0 ? 12 : hora24 % 12;

  return {
    anio,
    mes: mes - 1,
    dia,
    hora24,
    hora12: String(hora12).padStart(2, '0'),
    minuto: String(minuto).padStart(2, '0'),
    periodo,
  };
}

function construirValor(anio, mes, dia, hora12Str, minutoStr, periodo) {
  let h = Number(hora12Str);
  if (periodo === 'AM') {
    h = h === 12 ? 0 : h;
  } else {
    h = h === 12 ? 12 : h + 12;
  }

  const mm = String(mes + 1).padStart(2, '0');
  const dd = String(dia).padStart(2, '0');
  const hh = String(h).padStart(2, '0');
  return `${anio}-${mm}-${dd}T${hh}:${minutoStr}`;
}

function formatearLegible(parsed) {
  if (!parsed) return '';
  const fecha = new Date(parsed.anio, parsed.mes, parsed.dia, parsed.hora24, Number(parsed.minuto));
  return fecha.toLocaleString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DateTimePicker({ id, label, value, onChange, placeholder = 'Seleccionar fecha y hora' }) {
  const parsed = parsearValor(value);
  const hoy = new Date();

  const [abierto, setAbierto] = useState(false);
  const [mesVista, setMesVista] = useState(parsed ? parsed.mes : hoy.getMonth());
  const [anioVista, setAnioVista] = useState(parsed ? parsed.anio : hoy.getFullYear());

  const contenedorRef = useRef(null);

  useEffect(() => {
    const manejarClickFuera = (e) => {
      if (contenedorRef.current && !contenedorRef.current.contains(e.target)) {
        setAbierto(false);
      }
    };
    document.addEventListener('mousedown', manejarClickFuera);
    return () => document.removeEventListener('mousedown', manejarClickFuera);
  }, []);

  const abrirCalendario = () => {
    if (parsed) {
      setMesVista(parsed.mes);
      setAnioVista(parsed.anio);
    }
    setAbierto((prev) => !prev);
  };

  const irMesAnterior = () => {
    if (mesVista === 0) {
      setMesVista(11);
      setAnioVista((a) => a - 1);
    } else {
      setMesVista((m) => m - 1);
    }
  };

  const irMesSiguiente = () => {
    if (mesVista === 11) {
      setMesVista(0);
      setAnioVista((a) => a + 1);
    } else {
      setMesVista((m) => m + 1);
    }
  };

  const primerDiaSemana = (new Date(anioVista, mesVista, 1).getDay() + 6) % 7; // Lunes = 0
  const diasEnMes = new Date(anioVista, mesVista + 1, 0).getDate();

  const celdas = [
    ...Array.from({ length: primerDiaSemana }, () => null),
    ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
  ];

  const horaActual12 = parsed?.hora12 ?? '12';
  const minutoActual = parsed?.minuto ?? '00';
  const periodoActual = parsed?.periodo ?? 'PM';

  const seleccionarDia = (dia) => {
    onChange(construirValor(anioVista, mesVista, dia, horaActual12, minutoActual, periodoActual));
  };

  const actualizarHora = (nuevaHora12, nuevoMinuto, nuevoPeriodo) => {
    const anio = parsed?.anio ?? anioVista;
    const mes = parsed?.mes ?? mesVista;
    const dia = parsed?.dia ?? hoy.getDate();
    onChange(construirValor(anio, mes, dia, nuevaHora12, nuevoMinuto, nuevoPeriodo));
  };

  const textoMostrado = formatearLegible(parsed);

  return (
    <div ref={contenedorRef} className="relative w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}

      <button
        id={id}
        type="button"
        onClick={abrirCalendario}
        className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm flex items-center justify-between gap-2 transition-all cursor-pointer text-left ${
          abierto
            ? 'border-blue-600 ring-2 ring-blue-500/20'
            : 'border-slate-300 hover:border-slate-400'
        }`}
      >
        <span className={textoMostrado ? 'text-slate-900 font-medium' : 'text-slate-400'}>
          {textoMostrado || placeholder}
        </span>
        <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
      </button>

      {abierto && (
        <div className="absolute z-30 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 space-y-4">
          {/* Cabecera de navegación por mes */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={irMesAnterior}
              aria-label="Mes anterior"
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-extrabold text-slate-900">
              {MESES[mesVista]} {anioVista}
            </span>
            <button
              type="button"
              onClick={irMesSiguiente}
              aria-label="Mes siguiente"
              className="p-1.5 rounded-full hover:bg-slate-100 text-slate-600 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Días de la semana */}
          <div className="grid grid-cols-7 text-center text-[11px] font-bold text-slate-400">
            {DIAS_SEMANA.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          {/* Cuadrícula de días */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {celdas.map((dia, idx) => {
              if (!dia) return <span key={`vacio-${idx}`} />;

              const esSeleccionado =
                parsed &&
                parsed.anio === anioVista &&
                parsed.mes === mesVista &&
                parsed.dia === dia;

              const esHoy =
                hoy.getFullYear() === anioVista &&
                hoy.getMonth() === mesVista &&
                hoy.getDate() === dia;

              return (
                <button
                  key={dia}
                  type="button"
                  onClick={() => seleccionarDia(dia)}
                  className={`h-8 w-8 mx-auto rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    esSeleccionado
                      ? 'bg-blue-600 text-white shadow-2xs'
                      : esHoy
                      ? 'bg-blue-50 text-blue-700 font-extrabold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {dia}
                </button>
              );
            })}
          </div>

          {/* Selector de hora y minutos */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-4 h-4 text-blue-600" />
              <select
                aria-label="Hora"
                value={horaActual12}
                onChange={(e) => actualizarHora(e.target.value, minutoActual, periodoActual)}
                className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 cursor-pointer outline-none focus:border-blue-500"
              >
                {HORAS_12.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>

              <span className="font-bold text-slate-400">:</span>

              <select
                aria-label="Minutos"
                value={minutoActual}
                onChange={(e) => actualizarHora(horaActual12, e.target.value, periodoActual)}
                className="px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 cursor-pointer outline-none focus:border-blue-500"
              >
                {MINUTOS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-bold">
                {['AM', 'PM'].map((per) => (
                  <button
                    key={per}
                    type="button"
                    onClick={() => actualizarHora(horaActual12, minutoActual, per)}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      periodoActual === per
                        ? 'bg-white text-blue-700 shadow-2xs'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {per === 'AM' ? 'a. m.' : 'p. m.'}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-full cursor-pointer"
            >
              Listo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}