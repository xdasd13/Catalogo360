-- Insertar roles por defecto si no existen
USE catalogo;

INSERT IGNORE INTO roles (nombre, descripcion) VALUES 
('admin', 'Administrador con acceso total al sistema'),
('editor', 'Editor con acceso a gestión de productos y contenido'),
('cliente', 'Cliente registrado con acceso a compras y perfil');

SELECT * FROM roles;
