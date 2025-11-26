// Test directo de OpenRouter API
require("dotenv").config();
const axios = require("axios");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

console.log(
  "🔑 API Key configurada:",
  OPENROUTER_API_KEY
    ? "SÍ (" + OPENROUTER_API_KEY.substring(0, 15) + "...)"
    : "NO"
);

async function testAPI() {
  try {
    console.log("\n📡 Probando conexión con OpenRouter...\n");

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat:free",
        messages: [
          {
            role: "user",
            content: 'Di solo "Hola" en español',
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Test Catalogo",
        },
      }
    );

    console.log("✅ Respuesta exitosa:");
    console.log("Contenido:", response.data.choices[0].message.content);
    console.log("\n🎉 La API funciona correctamente!\n");
  } catch (error) {
    console.error("\n❌ Error al conectar con OpenRouter:");
    console.error("Status:", error.response?.status);
    console.error("StatusText:", error.response?.statusText);
    console.error("Data:", JSON.stringify(error.response?.data, null, 2));
    console.error("Message:", error.message);
    console.log("\n");
  }
}

testAPI();
