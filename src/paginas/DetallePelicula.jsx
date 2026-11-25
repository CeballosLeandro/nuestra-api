import { useParams, useNavigate } from 'react-router';
import { useCallback } from 'react';

import { obtenerDetalle, crearUrlImagen } from '../api/tmdb';
import useFetch from '../hooks/useFetch';
import { useFavoritosContext } from '../contexto/FavoritosContext';
import NoEncontrado from '../componentes/NoEncontrado';

function DetallePelicula() {
  const { tipo, id } = useParams();
  const navegar = useNavigate();

  const {
    agregarFavorito,
    quitarFavorito,
    esFavorito,
  } = useFavoritosContext();

  // Consultar los detalles según el tipo y el ID.
  const consultarDetalle = useCallback(
    () => obtenerDetalle(tipo, id),
    [tipo, id]
  );

  const {
    datos: pelicula,
    cargando,
    error,
  } = useFetch(consultarDetalle);

  // Adaptar los datos de TMDB según el tipo de contenido.
  const esSerie = tipo === 'tv';

  const titulo = esSerie ? pelicula?.name : pelicula?.title;

  const fecha = esSerie
    ? pelicula?.first_air_date
    : pelicula?.release_date;

  const anio = fecha ? fecha.slice(0, 4) : 'Sin fecha';

  const generos = pelicula?.genres
    ?.map((genero) => genero.name)
    .join(', ') || 'No disponible';

  const duracion = esSerie
    ? pelicula?.episode_run_time?.[0]
      ? `${pelicula.episode_run_time[0]} minutos por episodio`
      : 'No disponible'
    : pelicula?.runtime
      ? `${pelicula.runtime} minutos`
      : 'No disponible';

  const director = esSerie
    ? pelicula?.created_by?.map((persona) => persona.name).join(', ')
    : pelicula?.credits?.crew?.find(
        (persona) => persona.job === 'Director'
      )?.name;

  const actores = pelicula?.credits?.cast
    ?.slice(0, 5)
    .map((actor) => actor.name)
    .join(', ') || 'No disponible';

  const sinopsis = pelicula?.overview || 'Sin sinopsis disponible.';

  const calificacion = pelicula?.vote_average != null
    ? `${pelicula.vote_average.toFixed(1)} / 10`
    : 'No disponible';

  // Integración temporal con el sistema de favoritos de TMDb.
  const favorita = esFavorito(id, tipo);

  
  function manejarFavorito() {
    if (favorita) {
      quitarFavorito(Number(id), tipo);
    } else if (pelicula) {
      agregarFavorito({
        id: Number(pelicula.id),
        titulo,
        anio,
        poster: pelicula.poster_path,
        tipo,
      });
    }
  }

  if (cargando) {
    return (
      <main className="app">
        <p role="status">Cargando detalles...</p>
      </main>
    );
  }

  if (error) {
    // TMDB devuelve 404 cuando el contenido no existe.
    if (error.includes('TMDB 404')) {
      return <NoEncontrado />;
    }

    return (
      <main className="app">
        <p role="alert">
          Ocurrió un error al cargar los detalles.
        </p>
        <button onClick={() => navegar(-1)}>Volver</button>
      </main>
    );
  }

  if (!pelicula || !titulo) {
    return <NoEncontrado />;
  }

  return (
    <main className="app">
      <button onClick={() => navegar(-1)}>← Volver</button>

      <section className="detalle-pelicula">
        <img
          src={crearUrlImagen(pelicula.poster_path)}
          alt={`Póster de ${titulo}`}
        />

        <div>
          <h1>{titulo}</h1>

          <p><strong>Año:</strong> {anio}</p>
          <p><strong>Género:</strong> {generos}</p>
          <p><strong>Duración:</strong> {duracion}</p>
          <p>
            <strong>{esSerie ? 'Creadores:' : 'Director:'}</strong>{' '}
            {director || 'No disponible'}
          </p>
          <p><strong>Actores:</strong> {actores}</p>
          <p><strong>Sinopsis:</strong> {sinopsis}</p>
          <p><strong>Calificación TMDB:</strong> {calificacion}</p>

          <button
            type="button"
            onClick={manejarFavorito}
            aria-pressed={favorita}
          >
            {favorita
              ? '♥ Quitar de favoritos'
              : '♡ Agregar a favoritos'}
          </button>
        </div>
      </section>
    </main>
  );
}

export default DetallePelicula;