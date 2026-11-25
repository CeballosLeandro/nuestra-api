import { crearUrlImagen } from '../api/tmdb';

function TarjetaPelicula({ pelicula, alVerDetalle }) {
  return (
    <article className="tarjeta-pelicula">
      <img
        src={crearUrlImagen(pelicula.poster)}
        alt={`Póster de ${pelicula.titulo}`}
        loading="lazy"
      />

      <h3>{pelicula.titulo}</h3>

      <p>{pelicula.anio}</p>

      <p>
        {pelicula.tipo === 'tv' ? 'Serie' : 'Película'}
      </p>

      <button
        type="button"
        onClick={() => alVerDetalle(pelicula.tipo, pelicula.id)}
        aria-label={`Ver detalles de ${pelicula.titulo}`}
      >
        Ver detalles
      </button>
    </article>
  );
}

export default TarjetaPelicula;