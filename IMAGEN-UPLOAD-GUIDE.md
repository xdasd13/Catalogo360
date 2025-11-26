# 📸 Sistema de Upload de Imágenes - Catalogo360

## ✅ ¿Qué se ha implementado?

Se ha implementado un **sistema completo de gestión de imágenes** para productos con las siguientes características:

### **Features Implementados:**

1. **✅ Upload Múltiple con Drag & Drop**

   - Arrastra y suelta imágenes directamente
   - Selección múltiple de archivos (hasta 10 imágenes a la vez)
   - Validación de tipos (JPG, PNG, GIF, WEBP)
   - Validación de tamaño (máx. 10MB por imagen)

2. **✅ Procesamiento Automático con Sharp**

   - Genera 3 tamaños automáticamente:
     - **Thumbnail**: 150x150px (para listas/grid)
     - **Medium**: 500x500px (para vista de producto)
     - **Large**: 1200x1200px (para zoom/detalles)
   - Compresión automática (85% calidad)
   - Mantiene proporciones (fit: inside)
   - No agranda imágenes pequeñas

3. **✅ Preview en Tiempo Real**

   - Vista previa de imágenes antes de subir
   - Grid responsivo (2 cols móvil, 4 cols desktop)
   - Indicador de imagen principal
   - Hover effects con acciones

4. **✅ Gestión de Imágenes**

   - Establecer imagen principal
   - Eliminar imágenes
   - Reordenar imágenes (preparado para drag & drop futuro)
   - Auto-establecer la primera como principal

5. **✅ Integración con BD**
   - Tabla `imagenes` totalmente funcional
   - Relación con productos
   - Soporte para variantes (preparado)
   - Orden y estado principal

---

## 📂 Archivos Creados/Modificados

### **Nuevos Archivos:**

```
src/config/multer.js                    ← Configuración de Multer
src/admin/services/imagenService.js     ← Servicio de procesamiento imágenes
public/assets/js/image-manager.js       ← Frontend: drag & drop, preview, upload
```

### **Archivos Modificados:**

```
src/admin/controllers/mediaController.js  ← CRUD de imágenes implementado
src/admin/routes/index.js                 ← Rutas de media actualizadas
src/Views/Admin/pages/productos/editar.ejs ← Sección de imágenes añadida
```

---

## 🚀 Cómo Usar el Sistema de Imágenes

### **1. Editar un Producto Existente**

1. Ve a: `http://localhost:3000/admin/productos`
2. Click en **editar** (ícono de lápiz) de cualquier producto
3. Baja hasta la sección **"Imágenes del Producto"**
4. Arrastra imágenes o click en la zona de drop

### **2. Subir Imágenes**

**Opción A: Drag & Drop**

```
1. Arrastra archivos de imagen al área de drop zone
2. Las imágenes aparecerán en preview
3. Click en "Subir Imágenes"
4. ¡Listo! Las imágenes se procesarán automáticamente
```

**Opción B: Click para Seleccionar**

```
1. Click en el área de drop zone
2. Selecciona una o varias imágenes
3. Click en "Subir Imágenes"
```

### **3. Gestionar Imágenes**

Una vez subidas, puedes:

- **Ver todas las imágenes** del producto en grid
- **Establecer como principal**: Hover sobre imagen → Click "Principal"
- **Eliminar imagen**: Hover sobre imagen → Click botón de basura
- La **primera imagen** subida se marca como principal automáticamente

---

## 🔌 API Endpoints

### **POST /admin/media/subir**

Sube múltiples imágenes para un producto.

**Body (multipart/form-data):**

```javascript
{
  producto_id: 123,
  imagenes: [File, File, File],  // array de archivos
  alt_text: "Texto alternativo"  // opcional
}
```

**Response:**

```json
{
  "success": true,
  "message": "3 imagen(es) subida(s) correctamente",
  "imagenes": [
    {
      "id": 1,
      "producto_id": 123,
      "url_imagen": "/uploads/products/producto-123-timestamp_large.jpg",
      "thumbnail": "/uploads/products/producto-123-timestamp_thumb.jpg",
      "medium": "/uploads/products/producto-123-timestamp_medium.jpg",
      "large": "/uploads/products/producto-123-timestamp_large.jpg",
      "es_principal": true,
      "orden": 0
    }
  ]
}
```

### **GET /admin/media/producto/:producto_id**

Obtiene todas las imágenes de un producto.

**Response:**

```json
{
  "success": true,
  "imagenes": [...]
}
```

### **PUT /admin/media/principal**

Establece una imagen como principal.

**Body:**

```json
{
  "imagen_id": 1,
  "producto_id": 123
}
```

### **DELETE /admin/media/:id**

Elimina una imagen (BD + archivos físicos).

**Response:**

```json
{
  "success": true,
  "message": "Imagen eliminada correctamente"
}
```

### **PUT /admin/media/orden**

Actualiza el orden de las imágenes.

**Body:**

```json
{
  "imagenes": [
    { "id": 1, "orden": 0 },
    { "id": 2, "orden": 1 },
    { "id": 3, "orden": 2 }
  ]
}
```

---

## 📁 Estructura de Almacenamiento

Las imágenes se guardan en:

```
public/uploads/products/
├── producto-{id}-{timestamp}_thumb.jpg   (150x150)
├── producto-{id}-{timestamp}_medium.jpg  (500x500)
└── producto-{id}-{timestamp}_large.jpg   (1200x1200)
```

**Ejemplo:**

```
producto-5-1732633200000_thumb.jpg
producto-5-1732633200000_medium.jpg
producto-5-1732633200000_large.jpg
```

---

## 🗄️ Estructura de Base de Datos

### **Tabla: `imagenes`**

```sql
CREATE TABLE imagenes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT,
    variante_id INT,
    url_imagen VARCHAR(255) NOT NULL,      ← URL de la imagen large
    alt_text VARCHAR(255),                 ← Texto alternativo (SEO)
    orden INT DEFAULT 0,                   ← Orden de visualización
    es_principal BOOLEAN DEFAULT FALSE,    ← Imagen principal del producto
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    FOREIGN KEY (variante_id) REFERENCES variantes_producto(id) ON DELETE CASCADE
);
```

**Campos importantes:**

- `url_imagen`: Ruta de la imagen large (1200x1200)
- `es_principal`: Solo 1 imagen por producto puede ser principal
- `orden`: Define el orden de visualización (0 = primero)
- `variante_id`: NULL para imágenes del producto, o ID para imágenes de variante

---

## ⚙️ Configuración

### **Multer (src/config/multer.js)**

```javascript
// Tipos de archivo permitidos
const allowedTypes = /jpeg|jpg|png|gif|webp/;

// Tamaño máximo por archivo
fileSize: 10 * 1024 * 1024; // 10MB

// Almacenamiento
storage: multer.memoryStorage(); // En memoria para Sharp
```

### **Sharp (src/admin/services/imagenService.js)**

```javascript
// Tamaños generados
thumbnail: { width: 150, height: 150 }
medium:    { width: 500, height: 500 }
large:     { width: 1200, height: 1200 }

// Calidad de compresión
jpeg: { quality: 85 }
png:  { quality: 85 }
webp: { quality: 85 }
```

---

## 🎨 Frontend JavaScript

### **Clase: ProductImageManager**

```javascript
// Inicialización
const imageManager = new ProductImageManager({
  productoId: 123, // ID del producto
  dropZoneId: "image-drop-zone", // ID del drop zone
  fileInputId: "image-input", // ID del input file
  previewId: "image-preview", // ID del contenedor de preview
  uploadButtonId: "upload-images-btn", // ID del botón de upload
});
```

**Métodos públicos:**

```javascript
imageManager.loadExistingImages(); // Carga imágenes del servidor
imageManager.uploadImages(); // Sube imágenes seleccionadas
imageManager.setPrincipal(imagenId); // Establece imagen principal
imageManager.deleteImage(imagenId); // Elimina imagen
imageManager.removePreview(index); // Quita preview antes de subir
```

---

## 🔒 Seguridad

### **Validaciones Implementadas:**

1. **Tipo de archivo**: Solo imágenes (MIME type + extensión)
2. **Tamaño máximo**: 10MB por imagen
3. **Middleware de autenticación**: `isAdmin` en todas las rutas
4. **Validación de producto**: Verifica que el producto existe
5. **Sanitización**: Sharp limpia metadata EXIF automáticamente

### **Protecciones:**

- Nombres de archivo únicos (timestamp)
- No se permiten rutas relativas
- Archivos fuera de `/uploads/products/` son bloqueados
- Validación en frontend Y backend

---

## 🐛 Debugging

### **Logs útiles:**

El sistema imprime logs en consola:

```javascript
// Backend
console.log("Error procesando archivo:", file.originalname, error);

// Frontend
console.error("Error uploading images:", error);
console.error("Error deleting image:", error);
```

### **Verificar que funciona:**

1. **Backend funcionando:**

   ```bash
   npm start
   ```

2. **Carpeta de uploads existe:**

   ```bash
   ls public/uploads/products/
   ```

3. **Permisos de escritura:**

   ```bash
   # Windows (PowerShell)
   icacls public\uploads
   ```

4. **Base de datos:**
   ```sql
   SELECT * FROM imagenes WHERE producto_id = 1;
   ```

---

## 🚀 Próximas Mejoras Sugeridas

- [ ] **Drag & Drop para reordenar** imágenes subidas
- [ ] **Crop/Resize manual** antes de subir
- [ ] **Lazy loading** de imágenes en lista
- [ ] **Lightbox/Modal** para ver imágenes en grande
- [ ] **Upload desde URL** externa
- [ ] **Optimización WebP** obligatoria
- [ ] **CDN integration** para servir imágenes
- [ ] **Watermark automático** en imágenes
- [ ] **AI: Auto-tag** de imágenes con Mistral Vision API

---

## 📞 Soporte

Si tienes problemas:

1. Verifica que la carpeta `/public/uploads/products/` existe
2. Revisa los logs en la consola del navegador (F12)
3. Verifica los logs del servidor
4. Confirma que las dependencias están instaladas:
   ```bash
   npm list multer sharp
   ```

---

## ✅ Checklist de Verificación

- [x] Multer configurado
- [x] Sharp instalado y funcional
- [x] Servicio de imágenes creado
- [x] Controlador implementado
- [x] Rutas actualizadas
- [x] Frontend drag & drop funcionando
- [x] Vista de editar producto actualizada
- [x] Preview de imágenes funcional
- [x] Establecer principal funciona
- [x] Eliminar imágenes funciona
- [x] Base de datos integrada

---

**Hecho con ❤️ y ☕**
