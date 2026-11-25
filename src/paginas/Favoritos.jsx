import { Link } from 'react-router';
import { useFavoritosContext } from '../contexto/FavoritosContext';
import { crearUrlImagen } from '../api/tmdb';

function Favoritos() {
  const { favoritos, quitarFavorito, cargando, error } =
    useFavoritosContext();

  return (
    <main className="app">
      <header className="encabezado">
        <h1>Mis <span>Favoritos</span></h1>
        <p>Tu colección de películas y series favoritas.</p>
      </header>

      <Link to="/">← Volver al inicio</Link>

      {cargando ? (
        <p role="status">Cargando favoritos...</p>
      ) : error ? (
        <p role="alert">Ocurrió un error al cargar tus favoritos: {error}</p>
      ) : favoritos.length === 0 ? (
        <p>Todavía no agregaste favoritos.</p>
      ) : (
        <section className="grilla-peliculas">
          {favoritos.map((contenido) => (
            <article
              className="tarjeta-pelicula"
              key={`${contenido.tipo}-${contenido.id}`}
            >
              <img
                src={crearUrlImagen(contenido.poster)}
                alt={`Póster de ${contenido.titulo}`}
              />

              <h3>{contenido.titulo}</h3>
              <p>{contenido.anio}</p>
              <p>
                {contenido.tipo === 'tv' ? 'Serie' : 'Película'}
              </p>

              <button
                type="button"
                onClick={() =>
                  quitarFavorito(contenido.id, contenido.tipo)
                }
              >
                Quitar de favoritos
              </button>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default Favoritos;