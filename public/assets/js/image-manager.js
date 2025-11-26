/**
 * Gestor de Imágenes de Productos
 * Drag & Drop, Preview, Upload, Reordenar, Eliminar
 */

class ProductImageManager {
  constructor(options = {}) {
    this.productoId = options.productoId || null;
    this.dropZone = document.getElementById(
      options.dropZoneId || "image-drop-zone"
    );
    this.fileInput = document.getElementById(
      options.fileInputId || "image-input"
    );
    this.previewContainer = document.getElementById(
      options.previewId || "image-preview"
    );
    this.uploadButton = document.getElementById(
      options.uploadButtonId || "upload-images-btn"
    );

    this.selectedFiles = [];
    this.uploadedImages = [];

    if (this.dropZone && this.fileInput) {
      this.init();
    }
  }

  init() {
    this.setupDropZone();
    this.setupFileInput();
    this.setupUploadButton();

    if (this.productoId) {
      this.loadExistingImages();
    }
  }

  setupDropZone() {
    // Prevenir comportamiento por defecto del navegador
    ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
      this.dropZone.addEventListener(eventName, this.preventDefaults, false);
      document.body.addEventListener(eventName, this.preventDefaults, false);
    });

    // Efectos visuales
    ["dragenter", "dragover"].forEach((eventName) => {
      this.dropZone.addEventListener(
        eventName,
        () => {
          this.dropZone.classList.add("border-app-green", "bg-green-50");
        },
        false
      );
    });

    ["dragleave", "drop"].forEach((eventName) => {
      this.dropZone.addEventListener(
        eventName,
        () => {
          this.dropZone.classList.remove("border-app-green", "bg-green-50");
        },
        false
      );
    });

    // Handle drop
    this.dropZone.addEventListener(
      "drop",
      (e) => {
        const files = e.dataTransfer.files;
        this.handleFiles(files);
      },
      false
    );

    // Click para abrir selector
    this.dropZone.addEventListener("click", () => {
      this.fileInput.click();
    });
  }

  setupFileInput() {
    this.fileInput.addEventListener("change", (e) => {
      this.handleFiles(e.target.files);
    });
  }

  setupUploadButton() {
    if (this.uploadButton) {
      this.uploadButton.addEventListener("click", () => {
        this.uploadImages();
      });
    }
  }

  preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  handleFiles(files) {
    const validFiles = [...files].filter((file) => this.validateFile(file));

    if (validFiles.length === 0) {
      this.showToast("No se seleccionaron archivos de imagen válidos", "error");
      return;
    }

    this.selectedFiles = [...this.selectedFiles, ...validFiles];
    this.renderPreviews();

    // Si hay producto ID, subir automáticamente
    if (this.productoId && this.uploadButton) {
      this.uploadButton.disabled = false;
      this.uploadButton.classList.remove("opacity-50", "cursor-not-allowed");
    }
  }

  validateFile(file) {
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      this.showToast(`${file.name} no es un archivo de imagen válido`, "error");
      return false;
    }

    if (file.size > maxSize) {
      this.showToast(`${file.name} excede el tamaño máximo de 10MB`, "error");
      return false;
    }

    return true;
  }

  renderPreviews() {
    if (!this.previewContainer) return;

    this.previewContainer.innerHTML = "";

    this.selectedFiles.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const previewDiv = this.createPreviewElement(
          e.target.result,
          file.name,
          index,
          false
        );
        this.previewContainer.appendChild(previewDiv);
      };

      reader.readAsDataURL(file);
    });
  }

  createPreviewElement(src, name, index, isUploaded = false, imageData = null) {
    const div = document.createElement("div");
    div.className =
      "relative group border-2 border-gray-200 rounded-lg overflow-hidden hover:border-app-green transition-colors";
    div.dataset.index = index;

    if (isUploaded && imageData) {
      div.dataset.imageId = imageData.id;
    }

    div.innerHTML = `
      <img src="${src}" alt="${name}" class="w-full h-48 object-cover">
      <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2">
        ${
          isUploaded && imageData
            ? `
          <button type="button" onclick="imageManager.setPrincipal(${imageData.id})" 
                  class="hidden group-hover:block bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  title="Establecer como principal">
            <i class='bx bx-star'></i> Principal
          </button>
          <button type="button" onclick="imageManager.deleteImage(${imageData.id})" 
                  class="hidden group-hover:block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  title="Eliminar">
            <i class='bx bx-trash'></i>
          </button>
        `
            : `
          <button type="button" onclick="imageManager.removePreview(${index})" 
                  class="hidden group-hover:block bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm transition-colors">
            <i class='bx bx-x'></i> Quitar
          </button>
        `
        }
      </div>
      ${
        isUploaded && imageData && imageData.es_principal
          ? `
        <div class="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
          <i class='bx bxs-star'></i> Principal
        </div>
      `
          : ""
      }
      <div class="p-2 bg-white">
        <p class="text-xs text-gray-600 truncate">${name}</p>
      </div>
    `;

    return div;
  }

  removePreview(index) {
    this.selectedFiles.splice(index, 1);
    this.renderPreviews();

    if (this.selectedFiles.length === 0 && this.uploadButton) {
      this.uploadButton.disabled = true;
      this.uploadButton.classList.add("opacity-50", "cursor-not-allowed");
    }
  }

  async uploadImages() {
    if (!this.productoId) {
      this.showToast("Debes guardar el producto primero", "error");
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.showToast("No hay imágenes para subir", "error");
      return;
    }

    const formData = new FormData();
    formData.append("producto_id", this.productoId);

    this.selectedFiles.forEach((file) => {
      formData.append("imagenes", file);
    });

    // Mostrar loading
    if (this.uploadButton) {
      this.uploadButton.disabled = true;
      this.uploadButton.innerHTML =
        '<i class="bx bx-loader-alt bx-spin"></i> Subiendo...';
    }

    try {
      const response = await fetch("/admin/media/subir", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        this.showToast(data.message, "success");
        this.selectedFiles = [];
        this.loadExistingImages(); // Recargar imágenes
      } else {
        this.showToast(data.error || "Error al subir imágenes", "error");
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      this.showToast("Error al subir las imágenes", "error");
    } finally {
      if (this.uploadButton) {
        this.uploadButton.disabled = false;
        this.uploadButton.innerHTML =
          '<i class="bx bx-upload"></i> Subir Imágenes';
      }
    }
  }

  async loadExistingImages() {
    if (!this.productoId || !this.previewContainer) return;

    try {
      const response = await fetch(`/admin/media/producto/${this.productoId}`);
      const data = await response.json();

      if (data.success) {
        this.uploadedImages = data.imagenes;
        this.renderUploadedImages();
      }
    } catch (error) {
      console.error("Error loading images:", error);
    }
  }

  renderUploadedImages() {
    if (!this.previewContainer) return;

    this.previewContainer.innerHTML = "";

    this.uploadedImages.forEach((image, index) => {
      const previewDiv = this.createPreviewElement(
        image.url_imagen,
        `Imagen ${index + 1}`,
        index,
        true,
        image
      );
      this.previewContainer.appendChild(previewDiv);
    });

    // Si no hay imágenes subidas, mostrar las seleccionadas
    if (this.uploadedImages.length === 0) {
      this.renderPreviews();
    }
  }

  async setPrincipal(imagenId) {
    if (!this.productoId) return;

    try {
      const response = await fetch("/admin/media/principal", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imagen_id: imagenId,
          producto_id: this.productoId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        this.showToast("Imagen principal actualizada", "success");
        this.loadExistingImages();
      } else {
        this.showToast(data.error || "Error al actualizar", "error");
      }
    } catch (error) {
      console.error("Error setting principal:", error);
      this.showToast("Error al establecer imagen principal", "error");
    }
  }

  async deleteImage(imagenId) {
    if (!confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      const response = await fetch(`/admin/media/${imagenId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (data.success) {
        this.showToast("Imagen eliminada", "success");
        this.loadExistingImages();
      } else {
        this.showToast(data.error || "Error al eliminar", "error");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      this.showToast("Error al eliminar la imagen", "error");
    }
  }

  showToast(message, type = "info") {
    // Usar el sistema de toast existente o crear uno simple
    if (typeof showToast === "function") {
      showToast(message, type);
    } else {
      alert(message);
    }
  }
}

// Variable global para acceso fácil
let imageManager = null;

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // Solo inicializar si estamos en la página de productos
  const dropZone = document.getElementById("image-drop-zone");
  if (dropZone) {
    // Obtener producto ID del data attribute o del URL
    const productoId = dropZone.dataset.productoId || null;

    imageManager = new ProductImageManager({
      productoId: productoId,
      dropZoneId: "image-drop-zone",
      fileInputId: "image-input",
      previewId: "image-preview",
      uploadButtonId: "upload-images-btn",
    });
  }
});
