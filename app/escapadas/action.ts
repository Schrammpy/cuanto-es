'use server'
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_GEMINI_KEY 
});

export async function buscarEscapadaAction(frase: string) {
  try {
    const recipeJsonSchema = {
      type: "object",
      properties: {
        presupuesto: { type: "integer", description: "Monto total en Gs." },
        personas: { type: "integer", description: "Cantidad de personas" },
        // CAMBIO CLAVE: Pedimos una lista de tags que coincidan con la intención
        tags_busqueda: { 
          type: "array", 
          items: { type: "string" },
          description: "Categorías relacionadas: arroyo, piscina, cerro, cultura, historia, relax, aventura" 
        }
      },
      required: ["presupuesto", "personas", "tags_busqueda"]
    };

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Analiza la intención del usuario: "${frase}". 
              Si menciona "mojar los pies", "agua" o "calor", incluye tags como 'arroyo', 'piscina', 'cascada'.
              Si menciona "subir", "caminar" o "altura", usa 'cerro', 'aventura', 'senderismo'.
              Si menciona "conocer", "historia" o "iglesia", usa 'historia', 'cultura', 'museo'.`,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: recipeJsonSchema
      },
    });

    const textResponse = interaction.output_text;
    if (!textResponse) throw new Error("La IA no respondió.");
    const aiData = JSON.parse(textResponse);

    // 1. CONSULTA INTELIGENTE A SUPABASE
    // Usamos .overlaps para que traiga destinos que tengan AL MENOS UNO de los tags de la IA
    let query = supabase.from('escapadas').select('*');
    
    if (aiData.tags_busqueda && aiData.tags_busqueda.length > 0) {
        query = query.overlaps('tags', aiData.tags_busqueda);
    }

    const { data: destinos, error: dbError } = await query;

    if (dbError || !destinos) return { error: "No pudimos filtrar destinos adecuados." };

    // 2. Lógica CuantoEs (Cálculos de Gasto Seguro)
    const PRECIO_NAFTA = 7500;
    const COMIDA_DIARIA_PP = 85000;

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

    // 3. Devolvemos resultados que entran en presupuesto
    const filtrados = recomendaciones
      .filter(r => r.esViable)
      .sort((a, b) => b.colchon - a.colchon);

    // Si por el filtro de tags no quedó nada, devolvemos un mensaje especial
    if (filtrados.length === 0) {
        return { error: "No encontré lugares para '" + frase + "' que entren en ese presupuesto." };
    }

    return filtrados;

  } catch (error: any) {
    console.error("Error:", error);
    return { error: "E'a, ocurrió un error técnico. Probá de nuevo." };
  }
}