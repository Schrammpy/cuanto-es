'use server'
import { supabase } from "@/lib/supabase";

// 1. LEAD PARA FLETEROS Y MUDANZAS
export async function enviarLeadFlete(formData: any) {
  try {
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([{
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'mudanza_flete',
          detalles_calculo: { ...formData.detalles }
      }]);

    if (dbError) throw new Error("Error DB");

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        subject: `🚚 NUEVO LEAD FLETE: ${formData.nombre}`,
        cliente: formData.nombre,
        telefono: formData.telefono,
        desde_ciudad: formData.ciudad,
        tamano_carga: formData.detalles.tamano,
        distancia_rango: formData.detalles.distancia,
        ayudantes: formData.detalles.ayudantes,
        total_estimado: `Gs. ${formData.detalles.total}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

// 2. CROWDSOURCING: ¿CUÁNTO PAGASTE POR TU FLETE?
export async function guardarPrecioFlete(data: any) {
  try {
    const { error } = await supabase
      .from('precios_reportados')
      .insert([{
        servicio_slug: 'fletes',
        monto_pagado: parseInt(data.monto.replace(/\./g, "")),
        ciudad: data.ciudad,
        incluyo_materiales: data.ayudantes === 'si',
        comentario: data.comentario
      }]);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}