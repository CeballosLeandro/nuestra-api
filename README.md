🎬 Vivi Show

Vivi Show es una aplicación web desarrollada con React que permite buscar películas y series, consultar información detallada, crear una cuenta y guardar contenido favorito en la nube.

Este proyecto utiliza la API de The Movie Database (TMDB) para obtener información actualizada sobre películas y series, y Supabase para gestionar la autenticación, el almacenamiento de favoritos y su sincronización en tiempo real.

👥 Integrantes

Este proyecto fue realizado por:

MIJAEL AYALA

LEANDRO CEBALLOS

🛠️ Tecnologías utilizadas

React

Vite

JavaScript

CSS

React Router

API de The Movie Database (TMDB)

Supabase (autenticación, base de datos y Realtime)

Web Speech API (búsqueda por voz)

✨ Funcionalidades


Buscar películas y series por título, por texto o mediante el micrófono.

Consultar los resultados de búsqueda.

Ver información detallada de películas y series.

Filtrar resultados por tipo de contenido, filtrar resultados por año de lanzamiento.

Navegar de resultados.

Registro e inicio de sesión con una cuenta, cerrar sesión y mantener la sesión al recargar la página.

Agregar/quitar películas y series a favoritos

Guardar los favoritos en una base de datos en la nube

Sincronizar los cambios en favoritos en tiempo real

🎞️ API de TMDB

Se reemplazó la API de OMDb por The Movie Database (TMDB) para realizar las búsquedas y obtener los detalles de películas y series.

🔐 Autenticación y almacenamiento

Cada usuario puede consultar, agregar y eliminar únicamente sus propios favoritos. Para garantizarlo, implementamos políticas de seguridad mediante Row Level Security (RLS) en la base de datos.

🎙️ Búsqueda por voz

Incorporamos la Web Speech API para permitir que los usuarios realicen búsquedas utilizando el micrófono de su dispositivo.

La aplicación utiliza el reconocimiento de voz en español (es-AR) para convertir el audio en texto y ejecutar la búsqueda correspondiente.

Nota: La compatibilidad depende del navegador. Se recomienda utilizar Google Chrome o Microsoft Edge. En otros navegadores, como Firefox o Brave, esta funcionalidad puede no estar disponible o presentar problemas.

⚙️ Instalación del proyecto

1. Clonar el repositorio

Reemplazar TU-USUARIO por el nombre de usuario de GitHub donde se haya creado el fork.

git clone https://github.com/TU-USUARIO/final-2026.git

2. Ingresar a la carpeta

cd final-2026

3. Instalar las dependencias

npm install

4. Configurar las variables de entorno

Crear un archivo .env en la raíz del proyecto, utilizando como referencia .env.ejemplo.

El archivo debe contener las siguientes variables:

VITE_TMDB_API_URL=https://api.themoviedb.org/3
VITE_TMDB_TOKEN=TU_API_READ_ACCESS_TOKEN
VITE_TMDB_IMAGE_URL=https://image.tmdb.org/t/p
VITE_TITULO=Vivi Show

VITE_SUPABASE_URL=TU_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY=TU_SUPABASE_PUBLISHABLE_KEY

Es necesario contar con:

Una cuenta y credenciales de API de TMDB.

Un proyecto de Supabase.

La tabla de favoritos configurada con los campos correspondientes.

La autenticación de usuarios habilitada.

Las políticas RLS configuradas para proteger los favoritos de cada usuario.

▶️ Ejecutar el proyecto

npm run dev