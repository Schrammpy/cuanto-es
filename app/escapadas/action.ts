'use server'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/lib/supabase";

// Inicializamos la IA con tu llave
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_KEY!);

export async function buscarEscapadaAction(frase: string) {
  try {
    // Usamos el modelo estable
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Actúa como un experto en turismo de Paraguay.
      Analiza la siguiente frase del usuario: "${frase}"
      
      Debes extraer los datos y responder ÚNICAMENTE un objeto JSON con este formato:
      {"presupuesto": number, "personas": number, "busqueda": "string"}
      
      Importante: 
      - Responde solo el JSON puro.
      - Si no mencionan presupuesto, usa 1500000.
      - Si no mencionan personas, usa 2.
    `;

    const aiResult = await model.generateContent(prompt);
    const response = await aiResult.response;
    const text = response.text();
    
    // Limpiamos la respuesta por si la IA pone ```json ... ```
    const jsonClean = text.replace(/```json|```/g, "").trim();
    const aiData = JSON.parse(jsonClean);

    // 1. Traer todos los destinos de Supabase
    const { data: destinos, error: dbError } = await supabase
      .from('escapadas')
      .select('*');

    if (dbError || !destinos) {
      console.error("Error base de datos:", dbError);
      return { error: "No pudimos conectar con la base de datos de destinos." };
    }

    // 2. Lógica de Negocio CuantoEs (Cálculos reales)
    const PRECIO_NAFTA = 7500;
    const GASTO_COMIDA_DIARIO_PP = 80000;

    const recomendaciones = destinos.map(d => {
      // Cálculo de combustible (Asumiendo consumo de 10L cada 100km y viaje ida y vuelta)
      const kmTotales = d.distancia_km * 2;
      const costoNafta = (kmTotales / 100) * 10 * PRECIO_NAFTA;
      
      // Peajes (asumimos 10.000 por cada punto de peaje ida y vuelta)
      const costoPeajes = d.peajes * 2 * 10000;
      
      // Alojamiento y entradas
      const costoAlojamiento = d.alojamiento_base * aiData.personas;
      const costoEntradas = d.precio_acceso * aiData.personas;
      
      // Comida estimada para el grupo
      const costoComida = GASTO_COMIDA_DIARIO_PP * aiData.personas;

      const gastoProbable = costoNafta + costoPeajes + costoAlojamiento + costoEntradas + costoComida;
      const colchon = aiData.presupuesto - gastoProbable;

      return {
        ...d,
        gastoProbable,
        colchon,
        esViable: colchon >= -50000 // Permitimos que falten hasta 50mil del presupuesto
      };
    });

    // 3. Filtrar los que entran en presupuesto y ordenar (el que deja más plata libre primero)
    const finales = recomendaciones
      .filter(r => r.esViable)
      .sort((a, b) => b.colchon - a.colchon);

    return finales;

  } catch (err: any) {
    console.error("Error crítico en la acción:", err);
    return { error: "La IA no pudo procesar tu mensaje. Intentá siendo más específico con el monto." };
  }
}