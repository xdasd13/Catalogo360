/**
 * crear.js - JavaScript compartido para formularios de creación
 * Maneja validación, preview de imágenes, y UX mejorada
 */

document.addEventListener("DOMContentLoaded", () => {
  // ===================================
  // PREVIEW DE IMÁGENES
  // ===================================
  const fileInputs = document.querySelectorAll('input[type="file"]');

  fileInputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      const files = e.target.files;
      const previewContainer = input.closest(
        ".file-input-wrapper"
      )?.nextElementSibling;

      if (
        !previewContainer ||
        !previewContainer.classList.contains("file-preview")
      ) {
        return;
      }

      // Limpiar preview anterior
      previewContainer.innerHTML = "";

      // Mostrar preview de cada archivo
      Array.from(files).forEach((file, index) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const previewItem = document.createElement("div");
            previewItem.className = "file-preview-item";
            previewItem.innerHTML = `
              <img src="${e.target.result}" alt="Preview ${index + 1}">
              <button type="button" class="file-preview-remove" data-index="${index}">&times;</button>
            `;
            previewContainer.appendChild(previewItem);
          };

          reader.readAsDataURL(file);
        }
      });
    });
  });

  // Remover imagen del preview
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("file-preview-remove")) {
      e.target.closest(".file-preview-item").remove();
    }
  });

  // ===================================
  // GENERACIÓN AUTOMÁTICA DE SLUG
  // ===================================
  const nombreInput = document.querySelector('input[name="nombre"]');
  const slugInput = document.querySelector('input[name="slug"]');

  if (nombreInput && slugInput) {
    nombreInput.addEventListener("input", (e) => {
      if (!slugInput.dataset.manuallyEdited) {
        const slug = generateSlug(e.target.value);
        slugInput.value = slug;
      }
    });

    slugInput.addEventListener("input", () => {
      slugInput.dataset.manuallyEdited = "true";
    });
  }

  function generateSlug(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[áàäâ]/g, "a")
      .replace(/[éèëê]/g, "e")
      .replace(/[íìïî]/g, "i")
      .replace(/[óòöô]/g, "o")
      .replace(/[úùüû]/g, "u")
      .replace(/ñ/g, "n")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  // ===================================
  // VALIDACIÓN DE FORMULARIO
  // ===================================
  const forms = document.querySelectorAll('form[data-validate="true"]');

  forms.forEach((form) => {
    form.addEventListener("submit", (e) => {
      let isValid = true;

      // Validar campos requeridos
      const requiredFields = form.querySelectorAll("[required]");
      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          showError(field, "Este campo es requerido");
        } else {
          clearError(field);
        }
      });

      // Validar email
      const emailFields = form.querySelectorAll('input[type="email"]');
      emailFields.forEach((field) => {
        if (field.value && !isValidEmail(field.value)) {
          isValid = false;
          showError(field, "Email inválido");
        }
      });

      // Validar números
      const numberFields = form.querySelectorAll('input[type="number"]');
      numberFields.forEach((field) => {
        const min = parseFloat(field.getAttribute("min"));
        const max = parseFloat(field.getAttribute("max"));
        const value = parseFloat(field.value);

        if (!isNaN(min) && value < min) {
          isValid = false;
          showError(field, `El valor mínimo es ${min}`);
        }

        if (!isNaN(max) && value > max) {
          isValid = false;
          showError(field, `El valor máximo es ${max}`);
        }
      });

      if (!isValid) {
        e.preventDefault();
        showNotification(
          "Por favor, corrija los errores en el formulario",
          "error"
        );
      }
    });
  });

  function showError(field, message) {
    clearError(field);

    field.classList.add("border-red-500");
    const errorDiv = document.createElement("span");
    errorDiv.className = "form-error";
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
  }

  function clearError(field) {
    field.classList.remove("border-red-500");
    const existingError = field.parentNode.querySelector(".form-error");
    if (existingError) {
      existingError.remove();
    }
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ===================================
  // CONTADOR DE CARACTERES
  // ===================================
  const textareasWithLimit = document.querySelectorAll("textarea[maxlength]");

  textareasWithLimit.forEach((textarea) => {
    const maxLength = textarea.getAttribute("maxlength");
    const counter = document.createElement("div");
    counter.className = "text-right text-xs text-muted mt-1";
    counter.textContent = `0 / ${maxLength}`;
    textarea.parentNode.appendChild(counter);

    textarea.addEventListener("input", () => {
      const current = textarea.value.length;
      counter.textContent = `${current} / ${maxLength}`;

      if (current >= maxLength * 0.9) {
        counter.classList.add("text-danger");
      } else {
        counter.classList.remove("text-danger");
      }
    });
  });

  // ===================================
  // MULTI-SELECT CON TAGS
  // ===================================
  const multiSelects = document.querySelectorAll("select[multiple]");

  multiSelects.forEach((select) => {
    const tagsContainer = document.createElement("div");
    tagsContainer.className = "tags-container";
    select.style.display = "none";
    select.parentNode.insertBefore(tagsContainer, select);

    // Botón para abrir selector
    const toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "btn btn-secondary btn-sm";
    toggleBtn.textContent = "+ Agregar";
    tagsContainer.appendChild(toggleBtn);

    toggleBtn.addEventListener("click", () => {
      showOptionsModal(select, tagsContainer);
    });

    // Actualizar tags cuando cambia el select
    updateTags(select, tagsContainer);
  });

  function updateTags(select, container) {
    // Limpiar tags existentes
    container.querySelectorAll(".tag-item").forEach((tag) => tag.remove());

    // Agregar tags seleccionados
    Array.from(select.selectedOptions).forEach((option) => {
      const tag = document.createElement("span");
      tag.className = "tag-item";
      tag.innerHTML = `
        ${option.text}
        <span class="tag-remove" data-value="${option.value}">&times;</span>
      `;

      tag.querySelector(".tag-remove").addEventListener("click", () => {
        option.selected = false;
        tag.remove();
      });

      container.insertBefore(tag, container.querySelector("button"));
    });
  }

  function showOptionsModal(select, container) {
    // Implementación simple - en producción usar un modal real
    const options = Array.from(select.options).filter((opt) => !opt.selected);

    if (options.length === 0) {
      showNotification("Todas las opciones están seleccionadas", "info");
      return;
    }

    const selectedValue = prompt(
      `Opciones disponibles:\n${options
        .map((opt, i) => `${i + 1}. ${opt.text}`)
        .join("\n")}\n\nIngrese el número de la opción:`
    );

    if (selectedValue) {
      const index = parseInt(selectedValue) - 1;
      if (index >= 0 && index < options.length) {
        options[index].selected = true;
        updateTags(select, container);
      }
    }
  }

  // ===================================
  // NOTIFICACIONES
  // ===================================
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full`;

    const colors = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      info: "bg-blue-500 text-white",
      warning: "bg-yellow-500 text-white",
    };

    notification.classList.add(...colors[type].split(" "));
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 10);

    // Auto-remover después de 3 segundos
    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Exponer función globalmente para uso desde EJS
  window.showNotification = showNotification;
});
