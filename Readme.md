# 🛍️ Catalogo360

<div align="center">

![Catalogo360](https://img.shields.io/badge/Catalogo360-v1.0.0-green?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18+-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0+-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

**Una plataforma moderna de catálogo de productos con filtrado inteligente, autenticación de usuarios y experiencia de usuario premium.**

[Características](#-características) • [Instalación](#-instalación) • [Uso](#-uso) • [Tecnologías](#-tecnologías) • [Contribuir](#-contribuir)

</div>

---

## ✨ Características

### 🎨 **Interfaz de Usuario Premium**

- ✅ Diseño moderno y responsivo con **Tailwind CSS**
- ✅ Animaciones fluidas con **GSAP** y **ScrollTrigger**
- ✅ Efecto de escritura dinámica con **TypewriterJS**
- ✅ Notificaciones toast personalizadas
- ✅ Modo oscuro y paleta de colores armoniosa

### 🔐 **Sistema de Autenticación Completo**

- ✅ Registro de usuarios con validación
- ✅ Inicio de sesión seguro con **JWT**
- ✅ Cookies HTTP-only para máxima seguridad
- ✅ Menú desplegable de perfil de usuario
- ✅ Gestión de sesiones persistentes

### 🔍 **Filtrado Inteligente de Productos**

- ✅ Búsqueda en tiempo real con **Fuse.js**
- ✅ Filtros por categoría, precio y etiquetas
- ✅ Ordenamiento múltiple (precio, valoración, destacados)
- ✅ Visualización dinámica de resultados
- ✅ Chips de filtros activos

### 💰 **Sistema de Monedas**

- ✅ Conversión de monedas en tiempo real
- ✅ Soporte para múltiples divisas (USD, EUR, MXN, COP, ARS)
- ✅ Integración con **Currency API**
- ✅ Tasas de cambio offline como fallback

### 🎪 Características Adicionales

- ✅ Carrusel de productos destacados con **Swiper**
- ✅ Formateo de precios con **Dinero.js**
- ✅ Iconos vectoriales con **Iconify**
- ✅ Interactividad con **Alpine.js**
- ✅ Arquitectura MVC limpia y escalable
- ✅ **Panel de administración profesional** con TailwindCSS
- ✅ Gestión modular con Services, Controllers y Validators
- ✅ Flash messages y notificaciones automáticas
- ✅ Validación de formularios en servidor y cliente

---

## 🚀 Instalación

### Prerrequisitos

Asegúrate de tener instalado:

- **Node.js** v18 o superior
- **MySQL** v8.0 o superior
- **npm** o **yarn**

### Paso 1: Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/catalogo360.git
cd catalogo360
```

### Paso 2: Instalar dependencias

```bash
npm install
```

### Paso 3: Configurar la base de datos

1. Crea una base de datos MySQL:

```sql
CREATE DATABASE catalogo;
```

2. Importa el esquema de la base de datos:

```bash
mysql -u root -p catalogo_db < database/schema.sql
```

### Paso 4: Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=catalogo_db
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_aqui

# Currency API
CURRENCY_API_KEY=tu_api_key_de_currency_api
```

### Paso 5: Ejecutar el proyecto

```bash
npm start
```

El servidor estará disponible en `http://localhost:3000` 🎉

---

## 📖 Uso

### Desarrollo

Para ejecutar el proyecto en modo desarrollo con recarga automática:

```bash
npm run dev
```

### Construcción de CSS

Para compilar los estilos de Tailwind:

```bash
npm run build:css
```

### Estructura del Proyecto

```
catalogo/
├── public/                 # Archivos estáticos
│   ├── assets/
│   │   ├── css/           # Estilos compilados
│   │   │   ├── tailwind.css       # Estilos del frontend
│   │   │   └── admin.css          # Estilos del admin panel
│   │   ├── js/            # Scripts del cliente
│   │   │   ├── admin.js           # Funciones globales del admin
│   │   │   ├── admin-forms.js     # Helpers para formularios
│   │   │   └── *.js               # Scripts específicos
│   │   └── img/           # Imágenes
├── src/
│   ├── admin/             # Panel de administración
│   │   ├── controllers/   # Controladores del admin
│   │   ├── middlewares/   # Middlewares (validadores, auth)
│   │   ├── services/      # Servicios de lógica de negocio
│   │   ├── utils/         # Utilidades (slug generator)
│   │   └── routes/        # Rutas del admin
│   ├── config/            # Configuración de la app
│   ├── controllers/       # Controladores públicos
│   ├── middlewares/       # Middlewares personalizados
│   ├── repositories/      # Capa de acceso a datos
│   ├── routes/            # Definición de rutas públicas
│   ├── validators/        # Validadores de entrada
│   ├── Views/             # Vistas EJS
│   │   ├── layouts/       # Layouts (main, admin)
│   │   ├── admin/         # Vistas del panel admin
│   │   ├── Home/          # Vistas del frontend
│   │   ├── Auth/          # Vistas de autenticación
│   │   └── ...
│   ├── app.js             # Configuración de Express
│   └── server.js          # Punto de entrada
├── .env                   # Variables de entorno
├── package.json
└── README.md
```

---

## 🛠️ Tecnologías

### Backend

- **[Node.js](https://nodejs.org/)** - Entorno de ejecución
- **[Express](https://expressjs.com/)** - Framework web
- **[MySQL2](https://www.npmjs.com/package/mysql2)** - Cliente de base de datos
- **[JWT](https://jwt.io/)** - Autenticación basada en tokens
- **[bcryptjs](https://www.npmjs.com/package/bcryptjs)** - Hash de contraseñas
- **[express-validator](https://express-validator.github.io/)** - Validación de datos
- **[Sharp](https://sharp.pixelplumbing.com/)** - Procesamiento de imágenes
- **[Multer](https://www.npmjs.com/package/multer)** - Manejo de uploads
- **[connect-flash](https://www.npmjs.com/package/connect-flash)** - Flash messages

### Frontend

- **[EJS](https://ejs.co/)** - Motor de plantillas
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de CSS
- **[Alpine.js](https://alpinejs.dev/)** - Framework JavaScript reactivo
- **[GSAP](https://greensock.com/gsap/)** - Animaciones
- **[Swiper](https://swiperjs.com/)** - Carrusel de productos
- **[Fuse.js](https://fusejs.io/)** - Búsqueda difusa
- **[Dinero.js](https://dinerojs.com/)** - Manejo de monedas
- **[TypewriterJS](https://github.com/tameemsafi/typewriterjs)** - Efecto de escritura
- **[Iconify](https://iconify.design/)** - Iconos vectoriales

### Herramientas

- **[dotenv](https://www.npmjs.com/package/dotenv)** - Gestión de variables de entorno
- **[cookie-parser](https://www.npmjs.com/package/cookie-parser)** - Manejo de cookies
- **[node-fetch](https://www.npmjs.com/package/node-fetch)** - Cliente HTTP

---
# 🎛️ Panel de Administración - Checklist Completo

## ✅ Funcionalidades Implementadas

### 🏠 Dashboard

- [x] Vista principal con estadísticas en tiempo real
  - Total de productos activos
  - Total de categorías
  - Total de marcas
  - Total de usuarios registrados
  - Stock disponible y reservado
  - Productos sin stock
  - Productos destacados
- [x] Gráficos y cards de métricas
- [x] Sidebar profesional col apsable
- [x] Navbar con breadcrumbs y perfil de usuario
- [x] Diseño responsivo completo

###📦 Gestión de Productos

- [x] **Lista de productos** con tabla moderna
  - Búsqueda en tiempo real
  - Filtros por estado
  - Paginación
  - Estados visuales (activo/inactivo/destacado)
- [x] **Crear productos**
  - Formulario con validación completa
  - **🤖 Generación automática de descripciones con IA (Mistral AI)** ✨
- Botón "Generar descripción corta" con IA
- Botón "Generar descripción completa" con IA
- Botón "Generar ambas" para llenar los dos campos
- Asignación de categorías múltiples (multi-select)
- Asignación de etiquetas con checkboxes
- Gestión de marcas con selector
- Precios base y precios de oferta
- SKU y slug automático
- Estados (activo/destacado)
- [x] **Editar productos** (formulario pre-llenado)
- [x] **Eliminar productos** con confirmación

### 🏷️ Gestión de Categorías

- [x] Lista de categorías con jerarquía visual
- [x] Crear categorías
  - Categorías padre-hijo (jerárquicas)
  - Descripción
  - Slug automático
  - Orden de visualización
- [x] Editar categorías
- [x] Eliminar categorías

### 🔖 Gestión de Marcas

- [x] Lista de marcas
- [x] Crear marcas
  - Nombre y descripción
  - Slug automático
- [x] Editar marcas
- [x] Eliminar marcas

### 🎨 Gestión de Etiquetas

- [x] Lista de etiquetas con vista de colores
- [x] Crear etiquetas
  - Selector de color en tiempo real (color picker)
  - Preview de etiqueta con el color seleccionado
  - Validación de formato hexadecimal
  - Slug automático
- [x] Editar etiquetas (inline editing)
- [x] Eliminar etiquetas

### 👥 Gestión de Usuarios

- [x] Lista de usuarios con información completa
  - Vista de tabla con roles
  - Estados (activo/inactivo)
  - Fecha de registro
- [ ] Crear usuarios desde admin (pendiente)
- [ ] Editar usuarios (pendiente)
- [ ] Sistema de roles y permisos (RBAC) (pendiente)

### 📊 Gestión de Stock/Inventario

- [x] Vista de inventario
  - Tabla de productos con stock actual
  - Filtro por disponibilidad
  - Búsqueda de productos
  - Stock disponible vs reservado
- [ ] Actualización manual de stock (pendiente)
- [ ] Alertas de stock bajo (pendiente)
- [ ] Historial de movimientos de inventario (pendiente)

### 🤖 Integración con Inteligencia Artificial

- [x] **Generación automática de descripciones de productos**
  - Integración completa con **Mistral AI**
  - API endpoint: `POST /api/ia/generar-descripcion`
  - SDK oficial de Mistral (`@mistralai/mistralai`)
  - Modelo: `mistral-small-latest`
  - Funcionalidades:
    - Generar solo descripción corta
    - Generar solo descripción completa
    - Generar ambas descripciones simultáneamente
  - Procesamiento en tiempo real
  - Manejo robusto de errores
  - Validaciones de entrada
  - Animaciones y feedback visual
  - Loading states en botones
  - Notificaciones de éxito/error

### 🎨 Diseño y Experiencia de Usuario

- [x] **Sidebar profesional**
  - Logo animado con iconos
  - Menú de navegación organizado por secciones
    - 📦 Catálogo (Productos, Categorías, Marcas, Etiquetas)
    - 👥 Gestión (Usuarios, Stock)
    - ⚙️ Sistema (Configuración)
  - Perfil de usuario en la parte inferior
  - Colapsable en dispositivos móviles
  - Responsive con breakpoints
- [x] **Navbar superior**

  - Toggle de sidebar hamburger
  - Breadcrumbs de navegación contextual
  - Notificaciones (placeholder)
  - Menú desplegable de perfil

- [x] **Sistema de colores personalizado**
  - Paleta consistente definida en variables CSS
    - `--app-gray: #f2f2f2`
    - `--app-deep: #1a2b2a`
    - `--app-dark: #0a0c0d`
    - `--app-green: #348e91`
    - `--app-green-dark: #2b6f72`
    - `--app-muted: #1c5052`
    - `--app-card: #ffffff`
    - `--app-border: rgba(28, 80, 82, 0.15)`
    - `--shadow-lg: 0 25px 50px -12px rgba(28, 80, 82, 0.25)`
  - Sombras y bordes armoniosos
  - Estados hover y active
- [x] **Formularios profesionales** (`crear.css`)
  - Estilos consistentes y modernos
  - Validación en tiempo real (client-side)
  - Estados de hover y focus personalizados
  - Mensajes de ayuda y error
  - Checkboxes y radios personalizados
  - File uploads con preview de imágenes
  - Grids responsivos (2 y 3 columnas)
  - Sistema de tags/chips
- [x] **Tablas modernas**
  - Hover effects en filas
  - Acciones inline (editar/eliminar)
  - Estados visuales con badges de colores
  - Empty states con iconos y llamadas a la acción
  - Headers con iconos
  - Zebra striping sutil
- [x] **Animaciones y transiciones**
  - Fade in/out en modals y notificaciones
  - Highlight animation en campos actualizados por IA
  - Loading states con spinners en botones
  - Micro-interacciones en hover
  - Transiciones suaves (0.2s-0.3s)

### 🔧 Funcionalidades Técnicas

#### Arquitectura

- [x] **Patrón MVC completo**
  - Controllers para cada módulo (productos, categorías, etc.)
  - Services con lógica de negocio separada
  - Repositories para acceso a datos (capa de abstracción)
  - Middlewares de validación y autenticación
- [x] **Sistema de rutas modular**
  - Rutas organizadas por módulo en `/src/admin/routes`
  - Prefijo `/admin` para todas las rutas administrativas
  - Separación de rutas públicas y privadas
- [x] **Flash messages**
  - Notificaciones de éxito/error persistentes
  - Persistencia entre redirecciones
  - Integración con `connect-flash`
- [x] **Validación robusta**
  - Server-side con `express-validator`
  - Client-side con JavaScript (`crear.js`)
  - Mensajes de error personalizados y descriptivos
  - Validación de tipos de datos
  - Sanitización de entradas
- [x] **Generación automática de slugs**
  - Utilidad para crear URLs amigables
  - Normalización de texto (eliminación de acentos)
  - Conversión a lowercase
  - Reemplazo de espacios por guiones
  - Prevención de slugs duplicados
- [x] **Helpers de JavaScript**
  - `crear.js` - Funciones para formularios
    - Preview de imágenes
    - Generación de slugs
    - Validación dinámica
    - Contador de caracteres
  - `ia-producto.js` - Integración con IA
    - Llamadas AJAX a la API
    - Manejo de estados de carga
    - Actualización dinámica de campos
  - `dashboard.js` - Funcionalidad del panel principal

## 🚧 Roadmap - Próximas Funcionalidades

### En Progreso

- [ ] **Sistema de upload de imágenes para productos**
  - Drag & drop de archivos
  - Preview de múltiples imágenes
  - Compresión automática con Sharp
  - Galería de productos
  - Orden de imágenes
  - Imagen principal destacada

### Planificado

#### Corto Plazo

- [ ] **Gestión avanzada de usuarios**
  - Crear/editar usuarios desde el admin
  - Sistema de roles y permisos (RBAC)
  - Actividad y logs de usuarios
  - Bloqueo/desbloqueo de cuentas
- [ ] **Módulo de pedidos/órdenes**
  - Vista de todos los pedidos
  - Cambio de estados (pendiente, procesando, enviado, completado, cancelado)
  - Detalles completos de pedidos
  - Exportación a PDF y Excel
  - Búsqueda y filtros avanzados

#### Mediano Plazo

- [ ] **Analytics y reportes**
  - Gráficos de ventas con Chart.js/ApexCharts
  - Reportes de productos más vendidos
  - Estadísticas de usuarios y comportamiento
  - Dashboard de KPIs
  - Exportación de datos (CSV, Excel, PDF)
- [ ] **Configuración general del sistema**
  - Datos de la empresa/tienda
  - Configuración de correos electrónicos (SMTP)
  - Métodos de pago habilitados
  - Opciones y zonas de envío
  - Impuestos y monedas
- [ ] **SEO Manager**
  - Meta tags personalizados por producto/categoría
  - URLs canónicas
  - Generación automática de sitemap.xml
  - Robots.txt editor
  - Open Graph tags

#### Largo Plazo

- [ ] **Media Manager**
  - Biblioteca centralizada de medios
  - Organización por carpetas virtuales
  - Búsqueda y filtrado de archivos
  - Edición básica de imágenes (recorte, resize, filtros)
  - Metadatos de archivos
- [ ] **Sistema de notificaciones**
  - Notificaciones push en tiempo real
  - Centro de notificaciones interno
  - Notificaciones por email
  - Alertas personalizables
- [ ] **Multi-idioma (i18n)**
  - Soporte para múltiples idiomas
  - Traducción de productos y categorías
  - Selector de idioma en el admin
  - Archivos de traducción JSON

## 📍 Información de Acceso

### Admin Panel

```
URL: http://localhost:3000/admin
Email: admin@catalogo360.com (ejemplo)
Password: Admin@2024 (ejemplo)
```

## 🛠️ Stack Tecnológico del Admin

### Backend

- **Runtime**: Node.js v18+
- **Framework**: Express.js 4.18+
- **Base de datos**: MySQL 8.0+ con pool de conexiones
- **ORM/Query Builder**: SQL directo (repositorios personalizados)
- **IA**: Mistral AI (`@mistralai/mistralai`)
- **Autenticación**: JWT + cookies HTTP-only
- **Validación**: express-validator
- **Sessions**: express-session + connect-flash

### Frontend

- **Template Engine**: EJS (Embedded JavaScript Templates)
- **CSS Framework**: Tailwind CSS 3.0+ (vía CDN)
- **CSS Custom**: `crear.css`, `dashboard.css`
- **JavaScript**: Vanilla JS (modular)
- **Iconos**: Boxicons
- **Fuentes**: Inter (Google Fonts)

### APIs y Servicios

- **IA**: Mistral AI (generación de descripciones)
- **Currency**: Currency API (conversiones)

## 📦 Archivos Clave

### Backend

- `src/app.js` - Configuración principal de Express
- `src/admin/routes/ia.routes.js` - Rutas de IA
- `src/admin/services/ia.service.js` - Lógica de IA (removido, integrado en routes)
- `src/admin/controllers/*` - Controladores de cada módulo
- `src/admin/middlewares/*` - Validadores

### Frontend

- `public/assets/css/crear.css` - Estilos de formularios
- `public/assets/css/dashboard.css` - Estilos del panel
- `public/assets/js/crear.js` - Helpers de formularios
- `public/assets/js/ia-producto.js` - Funcionalidad de IA
- `public/assets/js/dashboard.js` - Scripts del dashboard

### Vistas

- `src/Views/Admin/dashboard.ejs` - Dashboard principal
- `src/Views/Admin/pages/productos/nuevo.ejs` - Crear producto
- `src/Views/Admin/pages/productos/index.ejs` - Lista de productos
- `src/Views/Admin/Layouts/sidebar.ejs` - Sidebar compartido
- `src/Views/Admin/Layouts/navbar.ejs` - Navbar compartido

## 🔑 Variables de Entorno Requeridas

```env
# Servidor
PORT=3000
NODE_ENV=development

# Base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=catalogo_db
DB_PORT=3306

# JWT
JWT_SECRET=tu_clave_secreta_super_segura_aqui

# Currency API
CURRENCY_API_KEY=tu_api_key_de_currency_api

# Mistral AI (para generación de descripciones)
MISTRAL_API_KEY=tu_api_key_de_mistral_aqui
```

## 📊 Estadísticas del Proyecto

- **Módulos del Admin**: 7 (Dashboard, Productos, Categorías, Marcas, Etiquetas, Usuarios, Stock)
- **Vistas EJS creadas**: ~15
- **Archivos CSS personalizados**: 2
- **Archivos JS helpers**: 3
- **Endpoints de IA**: 1
- **Líneas de código (aprox)**: 5000+

---
## 🎯 Características Destacadas

### 🎨 Sistema de Diseño

El proyecto utiliza un sistema de diseño coherente con:

- **Paleta de colores personalizada**: Verde vibrante (#10b981), tonos profundos y neutros
- **Tipografía moderna**: Inter como fuente principal
- **Espaciado consistente**: Sistema de espaciado basado en Tailwind
- **Componentes reutilizables**: Botones, tarjetas, chips, etc.

### 🔐 Seguridad

- Contraseñas hasheadas con **bcrypt** (10 rondas)
- Tokens JWT con expiración de 24 horas
- Cookies HTTP-only para prevenir XSS
- Validación de entrada en servidor y cliente
- Protección contra inyección SQL con consultas preparadas

### 📱 Responsive Design

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**Tu Nombre**

[![GitHub](https://img.shields.io/badge/GitHub-000?logo=github&logoColor=white)](https://github.com/xdasd13)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white)](https://www.linkedin.com/in/fabianyataco/)

- **Email:** fabianyataco9@gmail.com

---

## 🙏 Agradecimientos

- Inspiración de diseño de [Dribbble](https://dribbble.com/)
- Iconos de [Iconify](https://iconify.design/)
- Comunidad de [Stack Overflow](https://stackoverflow.com/)

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella en GitHub ⭐**

Hecho con ❤️ y ☕

</div>
