/**
 * ia-producto.js - Funcionalidad de IA para generar descripciones de productos con Mistral AI
 */

document.addEventListener("DOMContentLoaded", () => {
  // Elementos del formulario
  const nombreInput = document.getElementById("nombre");
  const descripcionCortaInput = document.getElementById("descripcion_corta");
  const descripcionLargaInput = document.getElementById("descripcion_larga");

  // Botones de IA
  const btnGenerarCortaIA = document.getElementById("btn-generar-corta-ia");
  const btnGenerarCompletaIA = document.getElementById(
    "btn-generar-completa-ia"
  );
  const btnGenerarAmbasIA = document.getElementById("btn-generar-ambas-ia");

  /**
   * Genera descripciones usando Mistral IA
   * @param {string} tipo - 'corta', 'completa', o 'ambas'
   */
  async function generarConIA(tipo) {
    const nombreProducto = nombreInput?.value.trim();

    // Validar que haya un nombre
    if (!nombreProducto) {
      mostrarNotificacion(
        "Por favor, ingresa el nombre del producto primero",
        "warning"
      );
      nombreInput?.focus();
      return;
    }

    // Determinar qué botón se presionó y deshabilitarlo
    let botonActual;
    if (tipo === "corta" && btnGenerarCortaIA) {
      botonActual = btnGenerarCortaIA;
    } else if (tipo === "completa" && btnGenerarCompletaIA) {
      botonActual = btnGenerarCompletaIA;
    } else if (tipo === "ambas" && btnGenerarAmbasIA) {
      botonActual = btnGenerarAmbasIA;
    }

    // Mostrar estado de carga
    const textoOriginal = botonActual ? botonActual.innerHTML : "";
    if (botonActual) {
      botonActual.disabled = true;
      botonActual.innerHTML =
        '<i class="bx bx-loader-alt bx-spin"></i> Generando con IA...';
    }

    try {
      console.log("🚀 Llamando a la API de IA...");

      // Llamar a la API
      const response = await fetch("/api/ia/generar-descripcion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre: nombreProducto }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al generar descripciones");
      }

      console.log("✅ Respuesta de IA:", data);

      // Rellenar los campos según el tipo solicitado
      if (tipo === "corta" || tipo === "ambas") {
        if (descripcionCortaInput) {
          descripcionCortaInput.value = data.data.descripcion_corta;
          animarCampo(descripcionCortaInput);
        }
      }

      if (tipo === "completa" || tipo === "ambas") {
        if (descripcionLargaInput) {
          descripcionLargaInput.value = data.data.descripcion_completa;
          animarCampo(descripcionLargaInput);
        }
      }

      // Mensaje de éxito
      mostrarNotificacion(
        "✨ Descripciones generadas con IA exitosamente",
        "success"
      );
    } catch (error) {
      console.error("❌ Error al generar con IA:", error);
      mostrarNotificacion(
        error.message || "Error al generar descripciones",
        "error"
      );
    } finally {
      // Restaurar botón
      if (botonActual) {
        botonActual.disabled = false;
        botonActual.innerHTML = textoOriginal;
      }
    }
  }

  /**
   * Anima el campo para indicar que se actualizó
   */
  function animarCampo(campo) {
    campo.classList.add("highlight-success");
    setTimeout(() => {
      campo.classList.remove("highlight-success");
    }, 1500);
  }

  /**
   * Muestra una notificación toast
   */
  function mostrarNotificacion(mensaje, tipo = "info") {
    // Si existe la función global, usarla
    if (typeof window.showNotification === "function") {
      window.showNotification(mensaje, tipo);
      return;
    }

    // Fallback: crear notificación simple
    const notification = document.createElement("div");
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 translate-x-full max-w-sm`;

    const colores = {
      success: "bg-green-500 text-white",
      error: "bg-red-500 text-white",
      info: "bg-blue-500 text-white",
      warning: "bg-yellow-500 text-white",
    };

    notification.classList.add(...colores[tipo].split(" "));
    notification.textContent = mensaje;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove("translate-x-full");
    }, 10);

    setTimeout(() => {
      notification.classList.add("translate-x-full");
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  // Event listeners para los botones de IA
  if (btnGenerarCortaIA) {
    btnGenerarCortaIA.addEventListener("click", (e) => {
      e.preventDefault();
      generarConIA("corta");
    });
  }

  if (btnGenerarCompletaIA) {
    btnGenerarCompletaIA.addEventListener("click", (e) => {
      e.preventDefault();
      generarConIA("completa");
    });
  }

  if (btnGenerarAmbasIA) {
    btnGenerarAmbasIA.addEventListener("click", (e) => {
      e.preventDefault();
      generarConIA("ambas");
    });
  }
});

// Estilos para la animación de highlight
if (!document.getElementById("ia-styles")) {
  const style = document.createElement("style");
  style.id = "ia-styles";
  style.textContent = `
    @keyframes highlightSuccess {
      0% { background-color: rgba(52, 211, 153, 0.3); }
      100% { background-color: transparent; }
    }
    
    .highlight-success {
      animation: highlightSuccess 1.5s ease;
    }
  `;
  document.head.appendChild(style);
}
