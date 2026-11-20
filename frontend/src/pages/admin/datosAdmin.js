import { useCallback, useEffect, useState } from 'react';
import api from '../../api/axiosConfig';

export function mensajeError(error) {
  const datos = error.response?.data;
  return Object.values(datos?.errors ?? {})[0] ?? datos?.message ?? 'No se pudo completar la solicitud.';
}

export function useDatosAdmin(ruta) {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState('');

  const cargar = useCallback((signal) => api.get(ruta, { signal })
    .then((respuesta) => {
      setDatos(respuesta.data);
      setError('');
    })
    .catch((error) => {
      if (!signal?.aborted) setError(mensajeError(error));
    }), [ruta]);

  useEffect(() => {
    const controlador = new AbortController();
    cargar(controlador.signal);
    return () => controlador.abort();
  }, [cargar]);

  return { datos, error, cargar };
}
