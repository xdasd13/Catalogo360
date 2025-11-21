# Catálogo API

API REST construida con Express y MySQL para administrar productos.

## Requisitos

- Node.js 18+
- Servidor MySQL 8+

## Configuración

1. Copia el archivo de ejemplo y ajusta los valores:

```bash
cp .env.example .env
```

2. Instala dependencias:

```bash
npm install
```

3. Levanta el servidor:

```bash
npm start
```

El servidor usa `PORT` (por defecto 3000) y expone rutas bajo `API_PREFIX` (`/api`).

## Arquitectura de carpetas

```
src/
├── app.js                 # Configuración de Express y middlewares globales
├── server.js              # Punto de entrada que levanta el servidor HTTP
├── config/
│   ├── env.js             # Manejo de variables de entorno
│   └── database.js        # Pool de conexiones MySQL (mysql2/promise)
├── controllers/           # Traduce la petición HTTP a llamadas de servicio
├── services/              # Reglas de negocio y validaciones
├── repositories/          # Acceso a datos usando SQL parametrizado
├── routes/                # Definición de endpoints Express
├── middlewares/           # Manejo de errores y rutas inexistentes
├── errors/                # Clases de error comunes (HttpError)
└── utils/                 # Utilidades compartidas (async handler, etc.)
```

## Conexión a MySQL

Los parámetros de conexión se cargan desde `env.js`, que usa `mysql2/promise` para crear un pool reutilizable (`src/config/database.js`).

- Ajusta los valores `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD` y `DB_NAME` en `.env`.
- `DB_CONNECTION_LIMIT`, `DB_WAIT_FOR_CONNECTIONS` y `DB_QUEUE_LIMIT` controlan el comportamiento del pool.

## Rutas disponibles

- `GET /health`: verificación básica.
- `GET /api/products`: listado de productos.
- `GET /api/products/:id`: producto por id.
- `POST /api/products`: creación (requiere `name`, `price`, `stock`).
- `PUT /api/products/:id`: actualización.
- `DELETE /api/products/:id`: eliminación.

Usa un cliente como Postman o curl para interactuar con la API.
