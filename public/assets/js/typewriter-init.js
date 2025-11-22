// Script para inicializar TypewriterJS en el título principal
document.addEventListener("DOMContentLoaded", function () {
  const typewriterElement = document.getElementById("typewriter");

  if (typewriterElement && typeof Typewriter !== "undefined") {
    const typewriter = new Typewriter(typewriterElement, {
      strings: [
        "Explora un catálogo diseñado para inspirarte",
        "Filtra lo que realmente necesitas",
        "Descubre productos que se ajustan a ti",
        "Encuentra exactamente lo que buscas",
      ],
      autoStart: true,
      loop: true,
      delay: 75,
      deleteSpeed: 50,
      pauseFor: 2500,
    });
  }
});
