'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY!);

export async function buscarEscapadaAction(frase: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Actúa como un extractor de datos para una app de viajes en Paraguay.
      Analiza la siguiente frase y devuelve ÚNICAMENTE un objeto JSON puro, sin bloques de código ni markdown.
      Si no se especifica el presupuesto, usa 0. Si no se especifica personas, usa 1.
      
      Frase: "${frase}"

      Formato esperado:
      {"presupuesto": number, "personas": number, "busqueda": string}
    `;

    const aiResult = await model.generateContent(prompt);
    const responseText = aiResult.response.text();
    
    // Limpiamos la respuesta de posibles bloques de código markdown
    const jsonClean = responseText.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(jsonClean);

    // 2. Traer destinos de Supabase
    const { data: destinos, error } = await supabase.from('escapadas').select('*');
    
    if (error || !destinos) return [];

    // 3. Lógica Matemática CuantoEs
    const recomendaciones = destinos.map(d => {
      // Ida y vuelta (distancia * 2). Consumo promedio 10L cada 100km. Nafta 7500.
      const costoNafta = ((d.distancia_km * 2) / 100) * 10 * 7500;
      const costoPeajes = d.peajes * 10000;
      const costoAlojamientoTotal = d.alojamiento_base * aiData.personas;
      const costoEntradasTotal = d.precio_acceso * aiData.personas;
      const comidaEstimada = 80000 * aiData.personas; // Bajamos a 80k por persona para ser más reales
      
      const gastoProbable = costoNafta + costoPeajes + costoAlojamientoTotal + costoEntradasTotal + comidaEstimada;
      
      return {
        ...d,
        gastoProbable,
        colchon: aiData.presupuesto - gastoProbable
      }
    });

    // Devolvemos solo los que el presupuesto alcanza y ordenamos por el que sobra más plata
    return recomendaciones
      .filter(r => r.colchon >= -50000) // Permitimos un margen de error de 50mil
      .sort((a,b) => b.colchon - a.colchon);

  } catch (error) {
    console.error("Error en la acción:", error);
    return { error: "Hubo un problema al calcular. Intentá de nuevo." };
  }
}