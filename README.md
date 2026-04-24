# Microservicio de Búsqueda con Saga Pattern

Este proyecto es un microservicio de búsqueda implementado en NestJS utilizando el patrón Saga para manejar búsquedas de manera eficiente.

## Descripción

El microservicio proporciona un endpoint REST para realizar búsquedas en un índice simulado. Utiliza el patrón Saga para coordinar las operaciones de búsqueda.

## Arquitectura

- **Saga Pattern**: Implementado en `src/saga/` para manejar la lógica de búsqueda.
- **NestJS**: Framework utilizado para la estructura del microservicio.
- **Docker**: Contenedorizado para fácil despliegue.

## Instalación y Ejecución

### Local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Crear un archivo `.env` basado en `.env.example` y configurar tu conexión MongoDB Atlas:
   ```bash
   cp .env.example .env
   ```

3. Ajustar `MONGO_URI` con la cadena de conexión de Atlas y `MONGO_DB_NAME` con el nombre de la base de datos.

4. Ejecutar en modo desarrollo:
   ```bash
   npm run start:dev
   ```

5. El servicio estará disponible en `http://localhost:3000`

### Con Docker Compose

1. Construir y ejecutar el contenedor:
   ```bash
   docker-compose up --build
   ```

2. El servicio estará disponible en `http://localhost:3000`

3. Para detener:
   ```bash
   docker-compose down
   ```

## Endpoints

- `GET /`: Mensaje de bienvenida
- `GET /search?q={query}`: Realizar búsqueda con query opcional

## Pruebas

### Ejecutar pruebas unitarias
```bash
npm run test
```

### Ejecutar pruebas e2e
```bash
npm run test:e2e
```

### Probar con REST Client

Usa el archivo `test.http` incluido para probar los endpoints desde VS Code (requiere extensión REST Client).

## Estructura del Proyecto

```
src/
├── app.controller.ts
├── app.module.ts
├── app.service.ts
├── main.ts
└── saga/
    ├── search.controller.ts
    ├── search.module.ts
    ├── search.saga.ts
    ├── search.service.ts
    └── search.model.ts
```

## Tecnologías

- NestJS
- TypeScript
- Docker
- Docker Compose

## Frontend React

Se agregó un frontend sencillo en `frontend/` para verificar la conexión al backend y a MongoDB Atlas.

### Ejecutar frontend

1. Ir a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar el frontend:
   ```bash
   npm run dev
   ```
4. Abrir el navegador en `http://localhost:5173`

Asegúrate de que el backend esté corriendo en `http://localhost:3000` antes de usar el frontend.
