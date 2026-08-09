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
        ubicacion: { type: "string", description: "Ciudad o Depto mencionado (ej: Paraguari, Cordillera, Altos). Dejar vacío si no hay." }
      },
      required: ["presupuesto", "personas", "tags_busqueda", "ubicacion"]
    };

    const interaction = await ai.interactions.create({
      model: "gemini-3.6-flash",
      input: `Analiza la intención del usuario paraguayo: "${frase}". 
              Presupuesto default: 1500000. Personas default: 2. 
              Si pide "refrescante", "agua" o "mojar", usa tags: arroyo, cascada, piscina, mojar, calor, verano.
              Extrae la ubicación si menciona alguna ciudad o departamento de Paraguay.`,
      response_format: { type: "text", mime_type: "application/json", schema: recipeJsonSchema },
    });

    const responseText = interaction.output_text;
    if (!responseText) throw new Error("IA sin respuesta");
    const aiData = JSON.parse(responseText);

    // --- CONSULTA DINÁMICA ---
    let query = supabase.from('escapadas').select('*');

    if (aiData.ubicacion) {
      // Prioridad a la ubicación: buscamos en depto o ciudad
      query = query.or(`departamento.ilike.%${aiData.ubicacion}%,ciudad.ilike.%${aiData.ubicacion}%`);
    } else if (aiData.tags_busqueda.length > 0) {
      // Si no hay ubicación, filtramos por tags
      query = query.overlaps('tags', aiData.tags_busqueda);
    }

    const { data: destinos, error: dbError } = await query;
    if (dbError || !destinos) return { error: "Error al consultar la base de datos." };

    // --- CÁLCULO DE GASTO ESTIMADO ---
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

      // Calculamos relevancia basada en tags
      const matchTags = d.tags.filter((t: string) => aiData.tags_busqueda.includes(t)).length;

      return {
        ...d,
        gastoProbable,
        colchon,
        relevancia: matchTags,
        esViable: colchon >= 0, // Filtro estricto: solo si alcanza la plata
        detalles: {
          nafta: costoNafta,
          peajes: costoPeajes,
          alojamiento: costoAlojamiento,
          entradas: costoEntradas,
          comida: costoComida
        }
      };
    });

    // --- ORDENAMIENTO ---
    const finales = recomendaciones
      .filter(r => r.esViable)
      .sort((a, b) => {
        if (b.relevancia !== a.relevancia) return b.relevancia - a.relevancia;
        return b.colchon - a.colchon;
      });

    if (finales.length === 0) {
        const montoFormateado = new Intl.NumberFormat('es-PY').format(aiData.presupuesto);
        return { error: `Hína... con Gs. ${montoFormateado} no encontré opciones que alcancen para ${aiData.ubicacion || 'el viaje'}. Probá subiendo un poco el presupuesto.` };
    }

    // Si no hay ubicación, limitamos para no saturar. Si hay, mostramos todo lo que entra.
    return aiData.ubicacion ? finales : finales.slice(0, 6);

  } catch (error: any) {
    console.error("Error en action:", error);
    return { error: "Ocurrió un error al procesar la búsqueda. Reintentá." };
  }
}