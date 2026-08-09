'use server'
import { GoogleGenAI } from "@google/genai";
import { supabase } from "@/lib/supabase";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GOOGLE_GEMINI_KEY 
});

export async function buscarEscapadaAction(frase: string) {
  try {
    const TAGS_EXISTENTES = "naturaleza, arroyo, cascada, piscina, cerro, aventura, historia, cultura, iglesia, religion, paz, espiritual, relax, familiar, premium, mojar, calor, verano";

    const recipeJsonSchema = {
      type: "object",
      properties: {
        presupuesto: { type: "integer" },
        personas: { type: "integer" },
        tags_busqueda: { 
          type: "array", 
          items: { type: "string" },
          description: `Usa SOLO estos tags: ${TAGS_EXISTENTES}` 
        },
        ubicacion: { type: "string", description: "Ciudad o Depto mencionado." }
      },
      required: ["presupuesto", "personas", "tags_busqueda", "ubicacion"]
    };

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Analiza: "${frase}". 
              Presupuesto default: 1500000. Personas default: 2. 
              Si pide "refrescante" o "agua", usa tags: arroyo, cascada, piscina, mojar, calor.`,
      response_format: { type: "text", mime_type: "application/json", schema: recipeJsonSchema },
    });

    const aiData = JSON.parse(interaction.output_text!);

    // --- MEJORA DE CONSULTA ---
    let query = supabase.from('escapadas').select('*');

    // Si hay ubicación, filtramos principalmente por eso
    if (aiData.ubicacion) {
      query = query.or(`departamento.ilike.%${aiData.ubicacion}%,ciudad.ilike.%${aiData.ubicacion}%`);
    } else {
      // Si no hay ubicación, usamos los tags como filtro principal
      query = query.overlaps('tags', aiData.tags_busqueda);
    }

    const { data: destinos, error: dbError } = await query;
    if (dbError || !destinos) return { error: "Error en base de datos." };

    // --- CÁLCULO Y FILTRO DE PRESUPUESTO ---
    const PRECIO_NAFTA = 7500;
    const COMIDA_DIARIA_PP = 85000;

    const recomendaciones = destinos.map(d => {
      const costoNafta = ((d.distancia_km * 2) / 100) * 10 * PRECIO_NAFTA;
      const costoPeajes = d.peajes * 2 * 10000;
      const costoAlojamiento = d.alojamiento_base * aiData.personas;
      const costoEntradas = d.precio_acceso * aiData.personas;
      const costoComida = COMIDA_DIARIA_PP * aiData.personas;

      const gastoProbable = costoNafta + costoPeajes + alojamiento + entradas + costoComida;
      const colchon = aiData.presupuesto - gastoProbable;

      // Calculamos "Puntaje de Relevancia" basado en cuántos tags coinciden
      const matchTags = d.tags.filter((t: string) => aiData.tags_busqueda.includes(t)).length;

      return {
        ...d,
        gastoProbable,
        colchon,
        relevancia: matchTags, // Más relevante si coincide con los tags del usuario
        esViable: colchon >= 0 // FILTRO ESTRICTO: Si no alcanza, no se muestra
      };
    });

    // --- ORDENAMIENTO INTELIGENTE ---
    const finales = recomendaciones
      .filter(r => r.esViable)
      .sort((a, b) => {
        // Primero ordenamos por relevancia de actividad (tags)
        if (b.relevancia !== a.relevancia) return b.relevancia - a.relevancia;
        // Si tienen igual relevancia, el que más "colchón" deja va primero
        return b.colchon - a.colchon;
      });

    if (finales.length === 0) {
        return { error: `No encontré opciones en ${aiData.ubicacion || 'esa zona'} que entren en el presupuesto de Gs. ${new Intl.NumberFormat('es-PY').format(aiData.presupuesto)}.` };
    }

    return finales;

  } catch (error: any) {
    return { error: "Reintentá con una frase más clara." };
  }
}