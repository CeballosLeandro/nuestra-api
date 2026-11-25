import { useEffect, useState } from 'react';
import { supabase } from '../supabase/cliente';
import { useAuth } from '../contexto/AuthContext';

export function useFavoritos() {
  const { usuario, cargando: cargandoAuth } = useAuth();

  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Obtener los favoritos del usuario autenticado.
  useEffect(() => {
    let activo = true;

    async function obtenerFavoritos() {
      if (cargandoAuth) return;

      if (!usuario) {
        setFavoritos([]);
        setCargando(false);
        setError('');
        return;
      }

      setCargando(true);
      setError('');

      const { data, error } = await supabase
        .from('favoritos')
        .select('*')
        .eq('user_id', usuario.id);

      if (!activo) return;

      if (error) {
        setError(error.message);
        setCargando(false);
        return;
      }

      const contenidos = data.map((favorito) => ({
        id: Number(favorito.tmdb_id),
        titulo: favorito.titulo,
        anio: favorito.anio,
        poster: favorito.poster,
        tipo: favorito.tipo,
      }));

      setFavoritos(contenidos);
      setCargando(false);
    }

    obtenerFavoritos();

    return () => {
      activo = false;
    };
  }, [usuario, cargandoAuth]);

  // Escuchar cambios en tiempo real.
  useEffect(() => {
    if (cargandoAuth || !usuario) return;

    const canal = supabase
      .channel(`favoritos-${usuario.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'favoritos',
          filter: `user_id=eq.${usuario.id}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const nuevo = payload.new;

            const contenido = {
              id: Number(nuevo.tmdb_id),
              titulo: nuevo.titulo,
              anio: nuevo.anio,
              poster: nuevo.poster,
              tipo: nuevo.tipo,
            };

            setFavoritos((actuales) => {
              const existe = actuales.some(
                (favorito) =>
                  favorito.id === contenido.id &&
                  favorito.tipo === contenido.tipo
              );

              return existe ? actuales : [...actuales, contenido];
            });
          }

          if (payload.eventType === 'DELETE') {
            const eliminado = payload.old;

            setFavoritos((actuales) =>
              actuales.filter(
                (favorito) =>
                  !(
                    favorito.id === Number(eliminado.tmdb_id) &&
                    favorito.tipo === eliminado.tipo
                  )
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [usuario, cargandoAuth]);

  // Agregar un favorito.
  async function agregarFavorito(contenido) {
    if (!usuario) {
      setError('Necesitás iniciar sesión para agregar favoritos.');
      return;
    }

    const nuevoFavorito = {
      user_id: usuario.id,
      tmdb_id: contenido.id,
      titulo: contenido.titulo,
      anio: contenido.anio,
      poster: contenido.poster,
      tipo: contenido.tipo,
    };

    const { error } = await supabase
      .from('favoritos')
      .insert(nuevoFavorito);

    if (error) {
      if (error.code !== '23505') {
        setError(error.message);
      }
      return;
    }

    setError('');

    setFavoritos((actuales) => {
      const existe = actuales.some(
        (favorito) =>
          favorito.id === contenido.id &&
          favorito.tipo === contenido.tipo
      );

      return existe ? actuales : [...actuales, contenido];
    });
  }

  // Eliminar un favorito.
  async function quitarFavorito(id, tipo) {
    if (!usuario) return;

    const { error } = await supabase
      .from('favoritos')
      .delete()
      .eq('tmdb_id', id)
      .eq('tipo', tipo)
      .eq('user_id', usuario.id);

    if (error) {
      setError(error.message);
      return;
    }

    setError('');

    setFavoritos((actuales) =>
      actuales.filter(
        (favorito) =>
          !(favorito.id === Number(id) && favorito.tipo === tipo)
      )
    );
  }

  // Comprobar si un contenido es favorito.
  function esFavorito(id, tipo) {
    return favoritos.some(
      (favorito) =>
        favorito.id === Number(id) &&
        favorito.tipo === tipo
    );
  }

  return {
    favoritos,
    cargando,
    error,
    agregarFavorito,
    quitarFavorito,
    esFavorito,
  };
}