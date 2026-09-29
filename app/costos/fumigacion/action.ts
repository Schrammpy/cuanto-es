'use server'
import { supabase } from "@/lib/supabase";

export async function enviarLeadFumigacion(formData: any) {
  try {
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([{
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'fumigacion',
          detalles_calculo: { ...formData.detalles }
      }]);

    if (dbError) throw new Error("Error DB");

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        subject: `🕷️ NUEVA SOLICITUD FUMIGACIÓN: ${formData.nombre}`,
        cliente: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        superficie: formData.detalles.m2 + " m2",
        tipo: formData.detalles.tipo,
        total_estimado: `Gs. ${formData.detalles.total}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function guardarPrecioFumigacion(data: any) {
  try {
    const { error } = await supabase
      .from('precios_reportados')
      .insert([{
        servicio_slug: 'fumigacion',
        monto_pagado: parseInt(data.monto.replace(/\./g, "")),
        ciudad: data.ciudad,
        incluyoMateriales: true,
        comentario: data.comentario
      }]);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}