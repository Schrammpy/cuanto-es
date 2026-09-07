'use server'
import { supabase } from "@/lib/supabase";

export async function enviarLeadAsado(formData: any) {
  try {
    const { error } = await supabase
      .from('leads_servicios')
      .insert([{
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'asado_domicilio',
          detalles_calculo: { ...formData.detalles }
      }]);

    if (error) throw error;

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `🥩 NUEVO ASADO: ${formData.nombre}`,
        message: `Cliente: ${formData.nombre}\nTel: ${formData.telefono}\nLugar: ${formData.ciudad}\nTipo: ${formData.detalles.tipo}\nPersonas: ${formData.detalles.personas}\nTotal Est: Gs. ${formData.detalles.total}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}