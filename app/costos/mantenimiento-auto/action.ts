'use server'
import { supabase } from "@/lib/supabase";

export async function enviarLeadAutomotor(formData: any) {
  try {
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([{
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'automotor',
          detalles_calculo: { ...formData.detalles }
      }]);

    if (dbError) throw new Error("Error DB");

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        subject: `🚗 NUEVO LEAD TALLER: ${formData.nombre}`,
        cliente: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        vehiculo: formData.detalles.vehiculo,
        servicios: JSON.stringify(formData.detalles.servicios_activos),
        total_estimado: `Gs. ${formData.detalles.total}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function guardarPrecioAutomotor(data: any) {
  try {
    const { error } = await supabase
      .from('precios_reportados')
      .insert([{
        servicio_slug: 'automotor',
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