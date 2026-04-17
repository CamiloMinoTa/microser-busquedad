# Microservicio de Busqueda

Servicio NestJS conectado a Mongo Atlas para listar productos, consultar detalle, buscar y autocompletar. Incluye un `frontend/` en React para hacer pruebas manuales desde navegador.

## Variables de entorno

Crea un archivo `.env` en la raiz:

```env
PORT=3001
FRONTEND_ORIGIN=http://localhost:5173
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<database>?retryWrites=true&w=majority
MONGODB_DB_NAME=busquedad
MONGODB_COLLECTION=search_results
```

Notas:
- `FRONTEND_ORIGIN` habilita CORS para el cliente React.
- `MONGODB_DB_NAME` puede omitirse si ya viene en el URI.
- La coleccion debe tener al menos `title`, `description`, `category` y `tags`.

## Backend

```bash
npm install
npm run start:dev
```

API disponible en `http://localhost:3001`.

Endpoints:
- `GET /products`
- `GET /products/:id`
- `GET /search?q={query}`
- `GET /search/autocomplete?q={query}&limit=6`

## Frontend

Desde `frontend/`:

```bash
npm install
npm run dev
```

Interfaz disponible en `http://localhost:5173`.

Tambien puedes usar desde la raiz:

```bash
npm run frontend:dev
```

## Docker Compose

```bash
docker compose up --build
```

## Pruebas

```bash
npm test
npm run test:e2e
```
