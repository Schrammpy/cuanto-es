'use server'
import { supabase } from "@/lib/supabase";

export async function enviarLeadFlete(formData: any) {
  try {
    const { error } = await supabase
      .from('leads_servicios')
      .insert([{
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'mudanza_flete',
          detalles_calculo: { ...formData.detalles }
      }]);

    if (error) throw error;

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        subject: `🚚 NUEVO FLETE: ${formData.nombre}`,
        message: `Cliente: ${formData.nombre}\nTel: ${formData.telefono}\nDesde: ${formData.detalles.origen}\nHasta: ${formData.detalles.destino}\nTipo: ${formData.detalles.tamano}\nTotal Est: Gs. ${formData.detalles.total}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}