'use server'
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_GEMINI_KEY 
});

export async function buscarEscapadaAction(frase: string) {
  try {
    // Definimos el universo de tags que existen en tu DB
    const TAGS_EXISTENTES = "naturaleza, arroyo, cascada, piscina, cerro, aventura, historia, cultura, iglesia, religion, paz, espiritual, relax, familiar, premium";

    const recipeJsonSchema = {
      type: "object",
      properties: {
        presupuesto: { type: "integer", description: "Presupuesto total en Gs." },
        personas: { type: "integer", description: "Cantidad de personas" },
        tags_busqueda: { 
          type: "array", 
          items: { type: "string" },
          description: `Elige de esta lista los que mejor coincidan con la intención: ${TAGS_EXISTENTES}` 
        }
      },
      required: ["presupuesto", "personas", "tags_busqueda"]
    };

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Analiza la frase del usuario paraguayo: "${frase}".
              Instrucciones especiales:
              - Si dice "presupuesto bajo", usa 350000.
              - Si dice "presupuesto alto", usa 2500000.
              - Interpreta "escape espiritual" como ['espiritual', 'paz', 'religion', 'historia'].
              - Interpreta "mojar los pies" como ['arroyo', 'cascada', 'piscina'].
              - Tu objetivo es mapear el sentimiento del usuario a los tags disponibles.`,
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
        .overlaps('tags', aiData.tags_busqueda); // Filtro por tags inteligentes

    if (dbError || !destinos) return { error: "No encontramos lugares que coincidan con esa vibra." };

    // 2. LÓGICA DE CÁLCULO (Se mantiene igual...)
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
        esViable: colchon >= -70000 // Aumentamos un poquito el margen de tolerancia
      };
    });

    return recomendaciones
      .filter(r => r.esViable)
      .sort((a, b) => b.colchon - a.colchon);

  } catch (error: any) {
    console.error("Error:", error);
    return { error: "Lo siento socio, hubo un error técnico al procesar tu idea." };
  }
}