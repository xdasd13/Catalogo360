const express = require("express");
const router = express.Router();
const { Mistral } = require("@mistralai/mistralai");

const client = new Mistral({ apiKey: process.env.MISTRAL_API_KEY || "" });

/**
 * POST /api/ia/generar-descripcion
 * Genera descripciones corta y larga para un producto usando Mistral AI
 */
router.post("/generar-descripcion", async (req, res) => {
  try {
    const { nombre } = req.body;

    // Validar que el nombre esté presente
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        error: "El nombre del producto es requerido",
      });
    }

    console.log("🤖 Generando descripciones con Mistral AI para:", nombre);

    const prompt = `Eres un experto en marketing y redacción de productos. 
Genera una descripción CORTA (máximo 30 palabras) y una LARGA (70-120 palabras) para este producto: "${nombre}".

La descripción corta debe ser clara, atractiva y directa.
La descripción larga debe incluir beneficios, características y un llamado a la acción sutil.
Usa un tono profesional pero cercano.

Responde ÚNICAMENTE en formato JSON válido, SIN texto adicional:
{
  "corta": "descripción corta aquí",
  "larga": "descripción larga aquí"
}`;

    const chatResponse = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      maxTokens: 500,
    });

    const content = chatResponse.choices[0].message.content;
    console.log("✅ Respuesta de IA:", content);

    // Intentar parsear como JSON
    let descripciones;
    try {
      descripciones = JSON.parse(content);
    } catch (parseError) {
      // Si no es JSON válido, intentar extraer manualmente
      console.warn("⚠️  Respuesta no es JSON, extrayendo manualmente...");
      const cortaMatch = content.match(/"corta":\s*"([^"]*)"/);
      const largaMatch = content.match(/"larga":\s*"([^"]*)"/);

      descripciones = {
        corta: cortaMatch ? cortaMatch[1] : content.substring(0, 100),
        larga: largaMatch ? largaMatch[1] : content,
      };
    }

    res.json({
      success: true,
      data: {
        descripcion_corta: descripciones.corta,
        descripcion_completa: descripciones.larga,
      },
    });
  } catch (error) {
    console.error("❌ Error al generar descripciones:", error);
    res.status(500).json({
      error:
        error.message ||
        "Error al generar las descripciones. Intenta nuevamente.",
      details: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

module.exports = router;
