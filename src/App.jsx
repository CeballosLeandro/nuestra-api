import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { usePeliculas } from './hooks/usePeliculas';

import TarjetaPelicula from './componentes/TarjetaPelicula';
import EstadoCarga from './componentes/EstadoCarga';
import Buscador from './componentes/Buscador';
import Paginacion from './componentes/Paginacion';
import Filtros from './componentes/Filtros';

import './App.css';

function App() {
  const navegar = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [busqueda, setBusqueda] = useState(
    searchParams.get('q') || ''
  );

  const [filtro, setFiltro] = useState(
    searchParams.get('tipo') || 'todos'
  );

  const [anio, setAnio] = useState(
    searchParams.get('anio') || 'todos'
  );

  const [pagina, setPagina] = useState(
    Math.max(1, Number(searchParams.get('pagina')) || 1)
  );

  const {
    peliculas,
    totalResultados,
    totalPaginas,
    cargando,
    error,
    busquedaRealizada,
    buscar,
  } = usePeliculas();

  useEffect(() => {
    const termino = searchParams.get('q');

    if (termino) {
      buscar(termino, pagina, filtro, anio);
    }
  }, []);

  useEffect(() => {
    const nuevosParametros = new URLSearchParams();

    if (busqueda.trim()) nuevosParametros.set('q', busqueda.trim());
    if (filtro !== 'todos') nuevosParametros.set('tipo', filtro);
    if (anio !== 'todos') nuevosParametros.set('anio', anio);
    if (pagina > 1) nuevosParametros.set('pagina', String(pagina));

    setSearchParams(nuevosParametros, { replace: true });
  }, [busqueda, filtro, anio, pagina, setSearchParams]);

  function manejarBusqueda(evento, termino = busqueda) {
    evento?.preventDefault();

    setBusqueda(termino);
    setPagina(1);
    buscar(termino, 1, filtro, anio);
  }

  function cambiarPagina(nuevaPagina) {
    setPagina(nuevaPagina);
    buscar(busqueda, nuevaPagina, filtro, anio);
  }

  function cambiarFiltro(nuevoFiltro) {
    setFiltro(nuevoFiltro);
    setPagina(1);
    buscar(busqueda, 1, nuevoFiltro, anio);
  }

  function cambiarAnio(nuevoAnio) {
    setAnio(nuevoAnio);
    setPagina(1);
    buscar(busqueda, 1, filtro, nuevoAnio);
  }

  function abrirDetalle(tipo, id) {
    navegar(`/pelicula/${tipo}/${id}`);
  }

  const anioActual = new Date().getFullYear();

  const aniosDisponibles = Array.from(
    { length: anioActual - 1899 },
    (_, indice) => String(anioActual - indice)
  );

const peliculasFiltradas = peliculas;

  return (
    <main className="app">
      <Buscador
        busqueda={busqueda}
        setBusqueda={setBusqueda}
        alBuscar={manejarBusqueda}
        cargando={cargando}
      />

      <section className="resultados" aria-live="polite">
        <h2>
          {busquedaRealizada
            ? 'Resultados'
            : 'Explorá tu entretenimiento'}
        </h2>

        <EstadoCarga
          cargando={cargando}
          error={error}
          vacio={
            busquedaRealizada &&
            !cargando &&
            !error &&
            peliculas.length === 0
          }
          mensajeVacio="No encontramos resultados para tu búsqueda."
        />

        {!cargando && !error && !busquedaRealizada && (
          <p>Buscá tus títulos favoritos y descubrí nuevas historias.</p>
        )}

        {!cargando && !error && peliculas.length > 0 && (
          <>
            <Filtros
              filtro={filtro}
              cambiarFiltro={cambiarFiltro}
              anio={anio}
              cambiarAnio={cambiarAnio}
              aniosDisponibles={aniosDisponibles}
            />

            {peliculasFiltradas.length === 0 ? (
              <p>No hay resultados con esos filtros.</p>
            ) : (
              <div className="grilla-peliculas">
                {peliculasFiltradas.map((pelicula) => (
                  <TarjetaPelicula
                    key={`${pelicula.tipo}-${pelicula.id}`}
                    pelicula={pelicula}
                    alVerDetalle={() =>
                      abrirDetalle(pelicula.tipo, pelicula.id)
                    }
                  />
                ))}
              </div>
            )}

            <Paginacion
              paginaActual={pagina}
              totalPaginas={totalPaginas}
              cambiarPagina={cambiarPagina}
            />

            <p>
              Se encontraron {totalResultados} resultados.
            </p>
          </>
        )}
      </section>
    </main>
  );
}

export default App;