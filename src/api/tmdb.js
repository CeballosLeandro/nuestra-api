const API_URL = import.meta.env.VITE_TMDB_API_URL;
const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const IMAGE_URL = import.meta.env.VITE_TMDB_IMAGE_URL;

async function consultarTMDB(endpoint, parametros = {}) {
  const query = new URLSearchParams({
    language: 'es-ES',
    ...parametros,
  });

  const respuesta = await fetch(`${API_URL}${endpoint}?${query}`, {
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(
      `TMDB ${respuesta.status}: ${datos.status_message || 'Error desconocido'}`
    );
  }

  return datos;
}

function adaptarContenido(contenido, tipo) {
  const esSerie = tipo === 'tv';
  const fecha = esSerie
    ? contenido.first_air_date
    : contenido.release_date;

  return {
    id: contenido.id,
    titulo: esSerie ? contenido.name : contenido.title,
    anio: fecha ? fecha.slice(0, 4) : 'Sin fecha',
    poster: contenido.poster_path,
    tipo,
    sinopsis: contenido.overview || 'Sin sinopsis disponible.',
    calificacion: contenido.vote_average ?? 0,
  };
}

async function buscarPorTipo(termino, pagina, tipo, anio) {
  const parametros = {
    query: termino,
    page: String(pagina),
    include_adult: 'false',
  };

  if (anio !== 'todos') {
    parametros[tipo === 'movie' ? 'primary_release_year' : 'first_air_date_year'] = anio;
  }

  const datos = await consultarTMDB(`/search/${tipo}`, parametros);

  return {
    resultados: datos.results.map((contenido) =>
      adaptarContenido(contenido, tipo)
    ),
    totalResultados: datos.total_results,
    totalPaginas: datos.total_pages,
  };
}

export async function buscarPeliculas(
  termino,
  pagina = 1,
  filtro = 'todos',
  anio = 'todos'
) {
  if (filtro === 'movie' || filtro === 'tv') {
    return buscarPorTipo(termino, pagina, filtro, anio);
  }

  const [peliculas, series] = await Promise.all([
    buscarPorTipo(termino, pagina, 'movie', anio),
    buscarPorTipo(termino, pagina, 'tv', anio),
  ]);

  const resultados = [
    ...peliculas.resultados,
    ...series.resultados,
  ].sort((a, b) => b.calificacion - a.calificacion);

  return {
    resultados,
    totalResultados:
      peliculas.totalResultados + series.totalResultados,
    totalPaginas: Math.max(
      peliculas.totalPaginas,
      series.totalPaginas
    ),
  };
}

export function crearUrlImagen(ruta, tamaño = 'w500') {
  if (!ruta) {
    return 'https://placehold.co/300x450?text=Sin+poster';
  }

  return `${IMAGE_URL}/${tamaño}${ruta}`;
}

export async function obtenerDetalle(tipo, id) {
  if (tipo !== 'movie' && tipo !== 'tv') {
    throw new Error('Tipo de contenido inválido.');
  }

  return consultarTMDB(`/${tipo}/${id}`, {
    append_to_response: 'credits',
  });
}