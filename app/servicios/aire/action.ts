'use server'
import { supabase } from "@/lib/supabase";

export async function enviarLeadAire(formData: any) {
  try {
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([{
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'aire_acondicionado',
          detalles_calculo: { ...formData.detalles }
      }]);

    if (dbError) throw new Error("Error DB");

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        subject: `❄️ NUEVO LEAD AIRE: ${formData.nombre}`,
        message: `Cliente: ${formData.nombre}\nTel: ${formData.telefono}\nServicio: ${formData.detalles.tipo}\nCantidad: ${formData.detalles.cantidad} de ${formData.detalles.btu} BTU\nTotal Est: Gs. ${formData.detalles.total}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}