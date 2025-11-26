const axios = require("axios");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

if (!OPENROUTER_API_KEY) {
  console.error("⚠️  OPENROUTER_API_KEY no está configurada en .env");
}

const client = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
    "Content-Type": "application/json",
    "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
    "X-Title": "Catalogo de Productos",
  },
});

/**
 * Genera descripción corta y completa usando IA
 * @param {string} nombreProducto - Nombre del producto
 * @returns {Promise<{corta: string, completa: string}>}
 */
async function generarDescripciones(nombreProducto) {
  try {
    const response = await client.post("/chat/completions", {
      model: "meta-llama/llama-3.2-3b-instruct:free",
      messages: [
        {
          role: "user",
          content: `Genera dos descripciones en español profesionales para este producto: "${nombreProducto}"

1. DESCRIPCIÓN CORTA (máximo 25-30 palabras): Breve, directa y comercial
2. DESCRIPCIÓN COMPLETA (70-120 palabras): Detallada, con características, beneficios y usos

Formato de respuesta:
CORTA: [tu descripción corta aquí]
COMPLETA: [tu descripción completa aquí]`,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const textoCompleto = response.data.choices[0].message.content;

    // Extraer las descripciones del texto
    const cortaMatch = textoCompleto.match(/CORTA:\s*(.+?)(?=\n|COMPLETA:|$)/i);
    const completaMatch = textoCompleto.match(/COMPLETA:\s*(.+)/is);

    const corta = cortaMatch
      ? cortaMatch[1].trim()
      : textoCompleto.split("\n")[0].substring(0, 200);

    const completa = completaMatch ? completaMatch[1].trim() : textoCompleto;

    return {
      corta,
      completa,
    };
  } catch (error) {
    console.error("❌ Error al generar descripciones con IA:");
    console.error("Status:", error.response?.status);
    console.error("Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("Message:", error.message);

    // Mensaje más específico según el error
    if (error.response?.status === 401) {
      throw new Error("API Key inválida o no configurada");
    } else if (error.response?.status === 429) {
      throw new Error(
        "Límite de peticiones excedido. Espera unos minutos e intenta de nuevo."
      );
    } else if (error.response?.status === 404) {
      throw new Error("Modelo de IA no encontrado o no disponible");
    } else {
      throw new Error(
        error.response?.data?.error?.message ||
          "No se pudo generar las descripciones con IA"
      );
    }
  }
}

module.exports = { generarDescripciones };
