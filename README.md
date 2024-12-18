
# Instalación y Ejecución -- Aplicación de Búsqueda de Canciones con Deezer --

La aplicación está dockerizada, por lo que solo es necesario tener **Docker** y **docker-compose** instalados. 
*(en Windows es necesario tener Docker Desktop o WSL2, y tenerlo corriendo)*

## NECESITAS LA API KEY DE DEEZER, loggeate en --> https://rapidapi.com/deezerdevs/api/deezer-1 (Debes configurarla en .env.docker para el docker y .env para local)

## Pasos:

1. Clonar el repositorio del proyecto.
En bash
  git clone (https://github.com/ArkaitzMD/DeezerTest.git)


2. Ejecutar el siguiente comando en la raíz del proyecto:
En bash
  docker-compose down --volumes (opcional/recomendado para borrar los volúmenes persistentes, la bd es persistente)
  docker-compose up --build (la primera vez necesitas --build, si después no cambias nada, puedes lanzarlo sin --build)


3. La aplicación estará disponible en:
  http://localhost:4173

# Frontend - React y TS 

Este es el frontend de una aplicación que permite buscar canciones a través de un buscador. Los datos se obtienen mediante comunicación con el **Backend** que expone una API **GraphQL**.

La aplicación ha sido desarrollada con **React** y **TypeScript**, siguiendo los estándares de **ESLint 2020**. El proyecto está dockerizado para una ejecución sencilla.

## Tecnologías Utilizadas

- **React** + **TypeScript**: Framework para la interfaz de usuario.
- **Apollo Client**: Cliente para consumir la API GraphQL del backend.
- **CSS**: Estilizado de la aplicación.
- **ESLint 2020**: Linter para mantener el código limpio y consistente.
- **Vite**: Herramienta de desarrollo para el proyecto React.
- **Docker**: Contenerización del proyecto para una fácil ejecución.

## Componentes
- **Player**: Reproductor de las pistas de audio.
- **SongCard**: Tarjetas que se listan en la aplicación que contienen la información de la canción.
- **SongList**: Grid que contiene los resultados de la búsqueda del **Header**, pueden ser mensajes o canciones.
- **Header**: Menu superior de la aplicación, contiene el búscador que se comunicará con el Backend mediante el cliente de Apollo

## Hooks
- **useIncrementPlayCount**: configura la llamada al backend para sumar 1 a las reproducciones de cada cancion
- **useSeacrhSongs**: Configura la llamada al backend para obtener las canciones filtradas

## Context
- **AppContext**: Contexto genérico que contiene el estado del listado de canciones resultado del filtrado y la canción seleccionada actual.

## Tipos
-**GraphQLResponse**:
    interface GraphQLResult<T> 
    {
      success: boolean; 
      data: T;          
      errorMessage?: string; 
    }
-**Song**:
    interface Song<T> 
    {
      success: boolean; 
      data: T;          
      errorMessage?: string; 
    }

    *interfaz de apoyo para las llamadas, que recuperan múltiples canciones*
    interface SearchSongsResponse {
      buscar: Song[];
    }

# Backend - Django y GraphQL - (PostgreSQL)

Este backend está construido con **Django** y **Graphene** (para GraphQL) y actúa como una **Middle API** que interactúa con la API externa de Deezer y proporciona datos relacionados con canciones y artistas.


## Tecnologías utilizadas

- **Python**: Lenguaje de programación principal.
- **Django**: Framework para desarrollo rápido y robusto del backend.
- **Graphene-Django**: Extensión para implementar GraphQL en Django.
- **PostgreSQL**: Base de datos relacional.
- **Requests**: Para realizar llamadas HTTP a la API externa de Deezer.
- **gunicorn**: Para servir el Backend.

## Modelos y sentencias de la base de datos

### 1. Artist
Modelo que representa a un artista.

| Campo       | Tipo                | Descripción                      |
|-------------|---------------------|----------------------------------|
| `deezer_id` | `CharField`         | ID único del artista en Deezer   |
| `name`      | `CharField`         | Nombre del artista               |

### 2. Song
Modelo que representa una canción.

| Campo          | Tipo                | Descripción                        |
|-----------------|---------------------|------------------------------------|
| `deezer_id`    | `BigIntegerField`   | ID único de la canción en Deezer   |
| `title`        | `CharField`         | Título de la canción               |
| `artist`       | `ForeignKey`        | Relación con el modelo `Artist`    |
| `numPlays`     | `IntegerField`      | Número de reproducciones           |


### Sentencias interesantes 
  Desde el contendor de postgre de docker ( usuario y bd definidos en el docker-compose ):
    docker exec -it postgres-db psql -U tuUsuario -d deezertest_db_docker

  **Información de canciones más reproducidas**
    SELECT * 
    FROM app_song 
    INNER JOIN app_artist ON app_song.artist_id = app_artist.id 
    ORDER BY "app_song"."numPlays" DESC;

  **Información de Artistas más reproducidos:**
    SELECT app_artist.id AS artist_id, app_artist.name, MAX("app_song"."numPlays") AS max_numplays
    FROM app_song
    INNER JOIN app_artist ON app_song.artist_id = app_artist.id
    GROUP BY app_artist.id, app_artist.name
    ORDER BY max_numplays DESC;


## Endpoints de GraphQL

El backend utiliza **GraphQL** como endpoint principal. Puedes acceder al esquema en:

http://localhost:8000/deezer/


### Queries disponibles

1. **Buscar canciones (`buscar`)**
   - **Descripción**: Busca canciones usando la API de Deezer, la app filtra por artistas, no por canciones, por defecto si no se pasa ningún valor, como la api de deezer no acepta valor vacío, pasamos 'a' para que no dé sensación de vacía la página cuando se entra ello sobre todo, en ese caso no filtramos por artista, para aportar más variedad a la vista principal del buscador
   - **Argumentos**:
     - `query`: Nombre del artista o de la canción (opcional).
   - **Ejemplo de Query**:
    graphql
      query {
        buscar(query: "Coldplay") {
          id
          title
          preview
          artist {
            id
            name
          }
          album {
            title
            cover
          }
        }
      }

   - **Respuesta**:
     json
      {
        "data": {
          "buscar": [
            {
              "id": 12345,
              "title": "Adventure of a Lifetime",
              "preview": "https://deezer.com/preview.mp3", **pista de audio**
              "artist": {
                "id": 67890,
                "name": "Coldplay"
              },
              "album": {
                "title": "A Head Full of Dreams",
                "cover": "https://deezer.com/album_cover.jpg" **imagen del grid**
              }
            }
          ]
        }
      }

### Mutations disponibles

1. **Incrementar Reproducciones (`incrementarReproducciones`)**
   - **Descripción**: Incrementa el número de reproducciones de una canción si existe; de lo contrario, la crea con 1 reproducción inicial.
   - **Argumentos**:
     - `songDeezerId`: ID de la canción en Deezer (requerido).
     - `songTitle`: Título de la canción (requerido).
     - `artistDeezerId`: ID del artista en Deezer (requerido).
     - `artistName`: Nombre del artista (requerido).
   - **Ejemplo de Mutation**:
      graphql
        mutation {
          incrementarReproducciones(
            songDeezerId: 12345,
            songTitle: "Fix You",
            artistDeezerId: 67890,
            artistName: "Coldplay"
          )
      }   
    **Respuesta**: 
      json
      {
        "data": {
          "incrementarReproducciones": true
        }
      }
      Devolvemos un booleano que realmente para la lógica actual de la app no es necesario, pero lo normal puede ser devolver información del resultado y utilizarlo directamente en el frontend, como devolver el nº actual de reproducciones después de haberlas incrementado, para mostrarlo.

## Servicios Externos

  El backend se comunica con la *API de Deezer* para buscar canciones. https://deezerdevs-deezer.p.rapidapi.com
  La lógica está centralizada en *services/deezer_api.py* para manejar la interacción externa. *solo se hace una petición de canciones en este caso*
  Debes aportar tu APIKEY de Deezer en .env.docker para docker y .env para local **RAPIDAPI_KEY=tudeezerkey**


## Tests

El proyecto incluye **tests unitarios** usando **pytest**:

**Tests de Queries**: Validan las búsquedas de canciones a través de la API de Deezer.
**Tests de Mutations**: Verifican la funcionalidad de incrementar reproducciones y manejar errores.

para lanzar los test:

### Docker:
  Entramos en el contenedor *django-backend*, o como se quiera definir en el docker-composer.yml:
    docker exec -it *django-backend* 
  Lanzamos los test:
    pytest app/tests
  Se puede lanzar directamente:
    docker exec -it django-backend pytest app/tests

### Local (NO RECOMENDADO)
  En nuestro IDE, accedemos por consola a la carpeta backend y activamos el venv:
    .\venv\Scripts\Activate
  Una vez dentro (venv):
    pytest app/tests

### Logger
  Se incorpora un logger muy sencillo para monitorizar los errores relacionados con los servicios

### Interfaz gráfica GraphQL habilitada
  En la dirección http://localhost:8000/deezer 

## Instrucciones de configuración

### 1. Configurar variables de entorno

el proyecto aporta los archivos .env sin configurar las claves, he puesto unos valores por defecto para que se identifiquen los valores que deben ser iguales para docker

### Importante
    Asegurate de que el archivo .env.docker

    contenga los mismos parametros que tu docker-compose para la BD

    **DOCKER-COMPOSE**
      **db**:
        image: postgres:17
        container_name: postgres-db
        ports:
          - "**5432**:**5432**"
        environment:
          POSTGRES_DB: **nombreBD**
          POSTGRES_USER: **tuUsuario**
          POSTGRES_PASSWORD: **tuPassword**
        volumes:
          - postgres_data:/var/lib/postgresql/data

    **.ENV.DOCKER**  
      POSTGRES_DB=**nombreBD**
      POSTGRES_USER=**tuUsuario**
      POSTGRES_PASSWORD=**tuPassword**
      POSTGRES_HOST=**db**
      POSTGRES_PORT=**5432**

### 2. Ejecutar migraciones
  docker ya genera y ejecuta las migraciones que pueda tener pendientes o las que se hayan realizado en el desarrollo
  en desarrollo paras generar y ejecutar las migrations:
  (venv) ->
    *python manage.py makemigrations*
    *python manage.py migrate*..

  después ya puedes lanzar (venv) python manage.py runserver para levantar el servidor en local


# SE RECOMIENDA UTILIZAR DOCKER PARA EJECUTAR EL PROYECTO. SINO DEBERÁS CREAR LA BASE DE DATOS PRIMERO EN TU MÁQUINA ENTRE OTRAS CONFIGURACIONES.