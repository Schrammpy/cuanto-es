'use server'
import { supabase } from "@/lib/supabase";

// 1. LEAD PARA ELECTRICISTAS VERIFICADOS
export async function enviarLeadElectricidad(formData: any) {
  try {
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([{
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'electricidad',
          detalles_calculo: { ...formData.detalles }
      }]);

    if (dbError) throw new Error("Error DB");

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        subject: `⚡ NUEVO LEAD ELECTRICIDAD: ${formData.nombre}`,
        cliente: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        tipo_trabajo: formData.detalles.servicio,
        bocas_unidades: formData.detalles.bocas,
        total_estimado: `Gs. ${formData.detalles.total}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

// 2. CROWDSOURCING: ¿CUÁNTO TE COBRÓ EL ELECTRICISTA?
export async function guardarPrecioElectricidad(data: any) {
  try {
    const { error } = await supabase
      .from('precios_reportados')
      .insert([{
        servicio_slug: 'electricidad',
        monto_pagado: parseInt(data.monto.replace(/\./g, "")),
        ciudad: data.ciudad,
        incluyo_materiales: data.incluyoMateriales === 'si',
        comentario: data.comentario
      }]);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}