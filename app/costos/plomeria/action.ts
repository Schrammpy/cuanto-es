'use server'
import { supabase } from "@/lib/supabase";

// 1. LEAD PARA PLOMEROS
export async function enviarLeadPlomeria(formData: any) {
  try {
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([{
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'plomeria',
          detalles_calculo: { ...formData.detalles }
      }]);

    if (dbError) throw new Error("Error DB");

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        subject: `🔧 NUEVO LEAD PLOMERÍA: ${formData.nombre}`,
        cliente: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        tipo_trabajo: formData.detalles.tipo,
        complejidad: formData.detalles.complejidad,
        total_estimado: `Gs. ${formData.detalles.total}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

// 2. CROWDSOURCING: ¿CUÁNTO TE COBRÓ EL PLOMERO?
export async function guardarPrecioPlomeria(data: any) {
  try {
    const { error } = await supabase
      .from('precios_reportados')
      .insert([{
        servicio_slug: 'plomeria',
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