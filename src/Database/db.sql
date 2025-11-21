CREATE DATABASE catalogo CHARACTER SET utf8mb4;
USE catalogo;

CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion VARCHAR(255),
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    apellido VARCHAR(150),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    email_verificado BOOLEAN DEFAULT FALSE,
    fecha_verificacion TIMESTAMP NULL,
    ultimo_acceso TIMESTAMP NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

CREATE TABLE usuario_roles (
    usuario_id INT,
    rol_id INT,
    asignado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (usuario_id, rol_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (rol_id) REFERENCES roles(id) ON DELETE CASCADE
);

CREATE TABLE sesiones (
    id VARCHAR(255) PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expira_en TIMESTAMP NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_expira (expira_en)
);

CREATE TABLE tokens_recuperacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expira_en TIMESTAMP NOT NULL,
    usado BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_token (token)
);

CREATE TABLE marcas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    logo_url VARCHAR(255),
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_slug (slug)
);

CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    descripcion TEXT,
    categoria_padre_id INT,
    imagen_url VARCHAR(255),
    orden INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (categoria_padre_id) REFERENCES categorias(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_padre (categoria_padre_id)
);

CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    marca_id INT,
    nombre VARCHAR(150) NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    sku VARCHAR(100) UNIQUE,
    descripcion_corta VARCHAR(255),
    descripcion_larga TEXT,
    precio_base DECIMAL(10,2) NOT NULL,
    precio_oferta DECIMAL(10,2),
    activo BOOLEAN DEFAULT TRUE,
    destacado BOOLEAN DEFAULT FALSE,
    vistas INT DEFAULT 0,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (marca_id) REFERENCES marcas(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_activo (activo),
    INDEX idx_destacado (destacado)
);

CREATE TABLE variantes_producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    sku VARCHAR(100) UNIQUE,
    nombre VARCHAR(150),
    precio DECIMAL(10,2),
    activo BOOLEAN DEFAULT TRUE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id)
);

CREATE TABLE imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    variante_id INT,
    url_imagen VARCHAR(255) NOT NULL,
    alt_text VARCHAR(255),
    orden INT DEFAULT 0,
    es_principal BOOLEAN DEFAULT FALSE,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (variante_id) REFERENCES variantes_producto(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id),
    INDEX idx_variante (variante_id)
);

CREATE TABLE producto_categorias (
    producto_id INT,
    categoria_id INT,
    PRIMARY KEY (producto_id, categoria_id),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE CASCADE
);

CREATE TABLE etiquetas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) UNIQUE NOT NULL,
    INDEX idx_slug (slug)
);

CREATE TABLE producto_etiquetas (
    producto_id INT,
    etiqueta_id INT,
    PRIMARY KEY (producto_id, etiqueta_id),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id) ON DELETE CASCADE
);

CREATE TABLE atributos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL UNIQUE,
    tipo ENUM('texto', 'numero', 'booleano', 'seleccion') DEFAULT 'texto'
);

CREATE TABLE atributos_producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    atributo_id INT NOT NULL,
    valor VARCHAR(255) NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (atributo_id) REFERENCES atributos(id) ON DELETE CASCADE,
    INDEX idx_producto (producto_id)
);

CREATE TABLE stock (
    variante_id INT PRIMARY KEY,
    cantidad INT DEFAULT 0,
    cantidad_reservada INT DEFAULT 0,
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (variante_id) REFERENCES variantes_producto(id) ON DELETE CASCADE
);

CREATE TABLE seo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT UNIQUE,
    meta_titulo VARCHAR(255),
    meta_descripcion VARCHAR(255),
    meta_palabras_clave VARCHAR(255),
    canonical_url VARCHAR(255),
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE
);

-- Datos iniciales
INSERT INTO roles (nombre, descripcion) VALUES
('admin', 'Administrador con acceso total'),
('editor', 'Puede editar productos y contenido'),
('cliente', 'Usuario cliente estándar');