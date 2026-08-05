'use server'
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_GEMINI_KEY 
});

export async function buscarEscapadaAction(frase: string) {
  try {
    const TAGS_EXISTENTES = "naturaleza, arroyo, cascada, piscina, cerro, aventura, historia, cultura, iglesia, religion, paz, espiritual, relax, familiar, premium";

    const recipeJsonSchema = {
      type: "object",
      properties: {
        presupuesto: { type: "integer", description: "Presupuesto total en Gs." },
        personas: { type: "integer", description: "Cantidad de personas" },
        tags_busqueda: { 
          type: "array", 
          items: { type: "string" },
          description: `Elige de esta lista los que mejor coincidan: ${TAGS_EXISTENTES}` 
        }
      },
      required: ["presupuesto", "personas", "tags_busqueda"]
    };

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Analiza la frase: "${frase}". Si no hay presupuesto usa 1500000. Si no hay personas usa 2. Mapea la intención a los tags: ${TAGS_EXISTENTES}`,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: recipeJsonSchema
      },
    });

    const textResponse = interaction.output_text;
    if (!textResponse) throw new Error("IA sin respuesta");
    const aiData = JSON.parse(textResponse);

    // 1. CONSULTA A SUPABASE
    let { data: destinos, error: dbError } = await supabase
        .from('escapadas')
        .select('*')
        .overlaps('tags', aiData.tags_busqueda);

    if (dbError || !destinos) return { error: "No encontramos lugares con esa vibra." };

    // 2. LÓGICA DE CÁLCULO "GASTO SEGURO"
    const PRECIO_NAFTA = 7500;
    const COMIDA_DIARIA_PP = 85000;

    const recomendaciones = destinos.map(d => {
      const nafta = ((d.distancia_km * 2) / 100) * 10 * PRECIO_NAFTA;
      const peajes = d.peajes * 2 * 10000;
      const alojamiento = d.alojamiento_base * aiData.personas;
      const entradas = d.precio_acceso * aiData.personas;
      const comida = COMIDA_DIARIA_PP * aiData.personas;

      const gastoProbable = nafta + peajes + alojamiento + entradas + comida;
      const colchon = aiData.presupuesto - gastoProbable;

      return {
        ...d,
        gastoProbable,
        colchon,
        // ENVIAMOS EL DESGLOSE PARA EL ACORDEÓN
        detalles: {
          nafta,
          peajes,
          alojamiento,
          entradas,
          comida
        },
        esViable: colchon >= -70000
      };
    });

    return recomendaciones
      .filter(r => r.esViable)
      .sort((a, b) => b.colchon - a.colchon);

  } catch (error: any) {
    console.error("Error:", error);
    return { error: "Hubo un error al procesar tu idea. Intentá de nuevo." };
  }
}