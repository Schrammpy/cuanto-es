'use server'
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_GEMINI_KEY 
});

export async function buscarEscapadaAction(frase: string) {
  try {
    const TAGS_EXISTENTES = "naturaleza, arroyo, cascada, piscina, cerro, aventura, historia, cultura, iglesia, religion, paz, espiritual, relax, familiar, premium";

    // 1. IA EXTRACTORA MEJORADA
    const recipeJsonSchema = {
      type: "object",
      properties: {
        presupuesto: { type: "integer", description: "Monto total disponible" },
        personas: { type: "integer", description: "Cantidad de personas" },
        tags_busqueda: { 
          type: "array", 
          items: { type: "string" },
          description: `Tags relacionados: ${TAGS_EXISTENTES}` 
        },
        ubicacion_especifica: { 
          type: "string", 
          description: "Departamento o Ciudad mencionada (ej: Paraguari, Cordillera, Altos). Dejar vacío si no menciona." 
        }
      },
      required: ["presupuesto", "personas", "tags_busqueda", "ubicacion_especifica"]
    };

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Analiza la intención del usuario paraguayo: "${frase}". 
              Extrae el presupuesto, personas y si menciona una zona específica (Departamento o Ciudad).`,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: recipeJsonSchema
      },
    });

    const textResponse = interaction.output_text;
    if (!textResponse) throw new Error("IA sin respuesta");
    const aiData = JSON.parse(textResponse);

    // 2. CONSTRUCCIÓN DE LA CONSULTA A SUPABASE
    let query = supabase.from('escapadas').select('*');

    // Filtro 1: Por Ubicación (Si el usuario pidió una zona específica)
    if (aiData.ubicacion_especifica) {
        query = query.or(`departamento.ilike.%${aiData.ubicacion_especifica}%,ciudad.ilike.%${aiData.ubicacion_especifica}%`);
    } else {
        // Filtro 2: Por Tags (Solo si no hay ubicación específica, para no limitar de más)
        if (aiData.tags_busqueda.length > 0) {
            query = query.overlaps('tags', aiData.tags_busqueda);
        }
    }

    const { data: destinos, error: dbError } = await query;
    if (dbError || !destinos) return { error: "Error al consultar la base de datos." };

    // 3. LÓGICA MATEMÁTICA Y FILTRO DE PRESUPUESTO ESTRICTO
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
        detalles: { nafta, peajes, alojamiento, entradas, comida }
      };
    });

    // 4. LIMPIEZA FINAL: Solo lo que realmente entra en el presupuesto
    const filtrados = recomendaciones
      .filter(r => r.colchon >= 0) // ELIMINAMOS cualquier opción que supere el presupuesto
      .sort((a, b) => b.colchon - a.colchon); // El que más sobra, primero

    if (filtrados.length === 0) {
        return { error: `Hína... con Gs. ${new Intl.NumberFormat('es-PY').format(aiData.presupuesto)} no llegamos a opciones disponibles en ${aiData.ubicacion_especifica || 'esa zona'}. Probá subiendo el monto.` };
    }

    // Si no pidió ubicación, limitamos a 6 resultados variados para no abrumar
    return aiData.ubicacion_especifica ? filtrados : filtrados.slice(0, 6);

  } catch (error: any) {
    console.error("Error:", error);
    return { error: "Ocurrió un error al procesar la búsqueda inteligente." };
  }
}