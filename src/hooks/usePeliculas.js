import { useState } from 'react';
import { buscarPeliculas } from '../api/tmdb';

export function usePeliculas() {
  const [peliculas, setPeliculas] = useState([]);
  const [totalResultados, setTotalResultados] = useState(0);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  async function buscar(
    termino,
    pagina = 1,
    filtro = 'todos',
    anio = 'todos'
  ) {
    const texto = termino.trim();

    if (!texto) {
      setPeliculas([]);
      setTotalResultados(0);
      setTotalPaginas(0);
      setError('Escribí el nombre de una película o serie.');
      setBusquedaRealizada(true);
      return;
    }

    setCargando(true);
    setError('');
    setBusquedaRealizada(true);

    try {
      const datos = await buscarPeliculas(texto, pagina, filtro, anio);

      setPeliculas(datos.resultados);
      setTotalResultados(datos.totalResultados);
      setTotalPaginas(datos.totalPaginas);

      if (datos.resultados.length === 0) {
        setError('No encontramos resultados para esa búsqueda.');
      }
    } catch (error) {
      console.error(error);
      setPeliculas([]);
      setTotalResultados(0);
      setTotalPaginas(0);
      setError('Ocurrió un error al buscar. Intentá nuevamente.');
    } finally {
      setCargando(false);
    }
  }

  return {
    peliculas,
    totalResultados,
    totalPaginas,
    cargando,
    error,
    busquedaRealizada,
    buscar,
  };
}