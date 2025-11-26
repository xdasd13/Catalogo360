-- Actualizar tabla etiquetas para agregar campo de color
-- Ejecutar este script en la base de datos

USE catalogo;

-- Agregar columna de color si no existe
ALTER TABLE etiquetas 
ADD COLUMN IF NOT EXISTS color VARCHAR(7) DEFAULT '#3b82f6' 
AFTER slug;

-- Actualizar etiquetas existentes con colores por defecto
UPDATE etiquetas SET color = '#3b82f6' WHERE color IS NULL;

SELECT 'Tabla etiquetas actualizada correctamente' AS message;
