'use server'
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

// Inicializamos con la nueva clase de 2026
const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_GEMINI_KEY 
});

export async function buscarEscapadaAction(frase: string) {
  try {
    // Definimos el esquema de respuesta para que sea JSON puro
    const recipeJsonSchema = {
      type: "object",
      properties: {
        presupuesto: { type: "integer", description: "Monto total disponible" },
        personas: { type: "integer", description: "Cantidad de personas" },
        busqueda_keyword: { type: "string", description: "Palabra clave" }
      },
      required: ["presupuesto", "personas", "busqueda_keyword"]
    };

    // Usamos la nueva Interactions API
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Analiza esta consulta de viaje en Paraguay: "${frase}". Extrae los datos.`,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: recipeJsonSchema
      },
    });

    // VALIDACIÓN PARA TYPESCRIPT: 
    // Si no hay texto de salida, lanzamos error para que no explote el JSON.parse
    const textResponse = interaction.output_text;
    if (!textResponse) {
      throw new Error("La IA no devolvió una respuesta válida.");
    }

    const aiData = JSON.parse(textResponse);

    // 1. Buscamos destinos en Supabase
    const { data: destinos, error: dbError } = await supabase
      .from('escapadas')
      .select('*');

    if (dbError || !destinos) {
      return { error: "Error de conexión con la base de datos de destinos." };
    }

    // 2. Lógica CuantoEs (Cálculos 2026)
    const PRECIO_NAFTA = 7500;
    const COMIDA_DIARIA_PP = 85000;

    const recomendaciones = destinos.map(d => {
      const kmTotales = d.distancia_km * 2;
      const costoNafta = (kmTotales / 100) * 10 * PRECIO_NAFTA;
      const costoPeajes = d.peajes * 2 * 10000;
      const costoAlojamiento = d.alojamiento_base * aiData.personas;
      const costoEntradas = d.precio_acceso * aiData.personas;
      const costoComida = COMIDA_DIARIA_PP * aiData.personas;

      const gastoProbable = costoNafta + costoPeajes + costoAlojamiento + costoEntradas + costoComida;
      const colchon = aiData.presupuesto - gastoProbable;

      return {
        ...d,
        gastoProbable,
        colchon,
        esViable: colchon >= -50000
      };
    });

    return recomendaciones
      .filter(r => r.esViable)
      .sort((a, b) => b.colchon - a.colchon);

  } catch (error: any) {
    console.error("Error en Interactions API:", error);
    // Devolvemos el error estructurado para la UI
    return { error: error.message || "Error interno de la IA. Probá de nuevo." };
  }
}