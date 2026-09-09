'use server'
import { supabase } from "@/lib/supabase";

// 1. LEAD PARA TÉCNICOS
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
        cliente: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        detalles: `${formData.detalles.tipo} - ${formData.detalles.cantidad} equipo(s) de ${formData.detalles.btu} BTU`,
        presupuesto_estimado: `Gs. ${formData.detalles.total}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

// 2. CROWDSOURCING: ¿CUÁNTO PAGASTE POR TU AIRE?
export async function guardarPrecioAire(data: any) {
  try {
    const { error } = await supabase
      .from('precios_reportados')
      .insert([{
        servicio_slug: 'aire_acondicionado',
        monto_pagado: parseInt(data.monto.replace(/\./g, "")),
        ciudad: data.ciudad,
        incluyo_materiales: data.materiales === 'si',
        comentario: data.comentario
      }]);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}