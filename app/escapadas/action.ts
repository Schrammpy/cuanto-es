'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY!);

export async function buscarEscapadaAction(frase: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // 1. IA extrae parámetros
  const prompt = `Analiza: "${frase}". Responde SOLO un JSON: {"presupuesto": number, "personas": number, "busqueda": string}`;
  const aiResult = await model.generateContent(prompt);
  const aiData = JSON.parse(aiResult.response.text());

  // 2. Traer destinos de Supabase
  const { data: destinos } = await supabase.from('escapadas').select('*');

  // 3. Tu Lógica CuantoEs (Cálculo de Nafta Gs. 7.500 y Peajes Gs. 10.000)
  const recomendaciones = destinos?.map(d => {
    const nafta = (d.distancia_km * 2 / 100) * 10 * 7500;
    const peajes = d.peajes * 10000;
    const alojamiento = d.alojamiento_base * aiData.personas;
    const comida = 100000 * aiData.personas; // 100k por persona comida base
    
    const gastoProbable = nafta + peajes + alojamiento + (d.precio_acceso * aiData.personas) + comida;
    
    return {
      ...d,
      gastoProbable,
      colchon: aiData.presupuesto - gastoProbable
    }
  });

  return recomendaciones?.filter(r => r.colchon >= 0).sort((a,b) => b.colchon - a.colchon) || [];
}