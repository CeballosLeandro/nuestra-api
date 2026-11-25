import { useEffect, useState } from 'react';

function useFetch(obtenerDatos) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!obtenerDatos) {
      setCargando(false);
      return;
    }

    let activo = true;

    async function ejecutarConsulta() {
      setCargando(true);
      setError('');
      setDatos(null);

      try {
        const resultado = await obtenerDatos();

        if (activo) {
          setDatos(resultado);
        }
      } catch (err) {
        if (activo) {
          setError(err.message || 'Error al obtener los datos.');
        }
      } finally {
        if (activo) {
          setCargando(false);
        }
      }
    }

    ejecutarConsulta();

    return () => {
      activo = false;
    };
  }, [obtenerDatos]);

  return { datos, cargando, error };
}

export default useFetch;