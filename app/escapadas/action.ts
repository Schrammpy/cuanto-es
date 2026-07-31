'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY!);

export async function buscarEscapadaAction(frase: string) {
  try {
    // CAMBIO AQUÍ: Usamos gemini-1.5-flash (sin el v1beta en el nombre) o gemini-1.5-flash-latest
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    const prompt = `
      Eres un experto en turismo en Paraguay. 
      Analiza la frase: "${frase}"
      Responde EXCLUSIVAMENTE con un objeto JSON (sin markdown, sin bloques de código):
      {"presupuesto": numero, "personas": numero, "busqueda": "texto"}
    `;

    const aiResult = await model.generateContent(prompt);
    const response = aiResult.response;
    const text = response.text();
    
    // Limpiador de seguridad por si la IA se pone rebelde con el formato
    const cleanJson = text.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(cleanJson);

    // 2. Traer destinos de Supabase
    const { data: destinos, error } = await supabase.from('escapadas').select('*');
    if (error || !destinos) return [];

    // 3. Cálculos CuantoEs
    const recomendaciones = destinos.map(d => {
      const costoNafta = ((d.distancia_km * 2) / 100) * 10 * 7500;
      const costoPeajes = d.peajes * 10000;
      const costoAlojamientoTotal = d.alojamiento_base * aiData.personas;
      const costoEntradasTotal = d.precio_acceso * aiData.personas;
      const comidaEstimada = 80000 * aiData.personas;
      
      const gastoProbable = costoNafta + costoPeajes + costoAlojamientoTotal + costoEntradasTotal + comidaEstimada;
      
      return {
        ...d,
        gastoProbable,
        colchon: aiData.presupuesto - gastoProbable
      }
    });

    return recomendaciones.filter(r => r.colchon >= -50000).sort((a,b) => b.colchon - a.colchon);

  } catch (error: any) {
    console.error("Error real:", error);
    // Si falla el modelo 1.5, intentamos con el 1.0 pro como plan de rescate
    return { error: "El modelo de IA no respondió. Reintenta en 5 segundos." };
  }
}

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