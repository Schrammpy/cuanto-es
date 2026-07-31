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
        presupuesto: { type: "integer", description: "Monto total disponible en guaraníes" },
        personas: { type: "integer", description: "Cantidad de personas que viajan" },
        busqueda_keyword: { type: "string", description: "Palabra clave: naturaleza, arroyo o aventura" }
      },
      required: ["presupuesto", "personas", "busqueda_keyword"]
    };

    // Usamos la nueva Interactions API
    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Analiza esta consulta de viaje en Paraguay: "${frase}". Extrae los datos financieros.`,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: recipeJsonSchema
      },
    });

    // En la versión 3.6 accedemos directamente a output_text
    const aiData = JSON.parse(interaction.output_text);

    // 1. Buscamos destinos en Supabase
    const { data: destinos, error: dbError } = await supabase
      .from('escapadas')
      .select('*');

    if (dbError || !destinos) {
      return { error: "Error de conexión con la base de datos de destinos." };
    }

    // 2. Lógica CuantoEs (Cálculos reales locales)
    const PRECIO_NAFTA = 7500;
    const COMIDA_DIARIA_PP = 85000; // Ajustado a inflación 2026

    const recomendaciones = destinos.map(d => {
      const costoNafta = ((d.distancia_km * 2) / 100) * 10 * PRECIO_NAFTA;
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
    return { error: "El motor de IA 3.6 no pudo procesar la solicitud. Reintenta." };
  }
}gi