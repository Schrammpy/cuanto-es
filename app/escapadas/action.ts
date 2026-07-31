'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

// Verificamos la llave en el servidor
const apiKey = process.env.GOOGLE_GEMINI_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function buscarEscapadaAction(frase: string) {
  if (!apiKey) return { error: "No se encontró la API KEY en el servidor." };

  try {
    // Usamos el nombre de modelo más estándar actualmente
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

    const prompt = `
      Eres un guía turístico de Paraguay. 
      Analiza la frase: "${frase}"
      Responde EXCLUSIVAMENTE un objeto JSON puro (sin markdown, sin bloques de código, sin texto extra) con este formato:
      {"presupuesto": numero, "personas": numero, "busqueda": "texto"}
      
      Si el usuario no dice presupuesto, usa 1500000. Si no dice personas, usa 2.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Limpiador agresivo de JSON por si la IA se pone rebelde
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}') + 1;
    const jsonClean = text.substring(start, end);
    const aiData = JSON.parse(jsonClean);

    // 1. Buscamos en Supabase
    const { data: destinos, error: dbError } = await supabase.from('escapadas').select('*');
    if (dbError || !destinos) return { error: "Error al leer destinos de la base de datos." };

    // 2. Cálculos de CuantoEs
    const recomendaciones = destinos.map(d => {
      const costoNafta = ((d.distancia_km * 2) / 100) * 10 * 7500;
      const costoPeajes = d.peajes * 2 * 10000;
      const costoAlojamientoTotal = d.alojamiento_base * aiData.personas;
      const costoEntradasTotal = d.precio_acceso * aiData.personas;
      const comidaEstimada = 80000 * aiData.personas;
      
      const gastoProbable = costoNafta + costoPeajes + costoAlojamientoTotal + costoEntradasTotal + comidaEstimada;
      const colchon = aiData.presupuesto - gastoProbable;

      return {
        ...d,
        gastoProbable,
        colchon,
        viable: colchon >= -50000
      };
    });

    return recomendaciones.filter(r => r.viable).sort((a,b) => b.colchon - a.colchon);

  } catch (error: any) {
    console.error("Error en Gemini:", error);
    return { error: "Google no pudo procesar el mensaje. Reintentá en un momento." };
  }
}