'use server'
import { supabase } from "@/lib/supabase";

export async function enviarLeadElectro(formData: any) {
  try {
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([{
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'electrodomesticos',
          detalles_calculo: { ...formData.detalles }
      }]);

    if (dbError) throw new Error("Error DB");

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        subject: `🔌 NUEVO LEAD ELECTRO: ${formData.nombre}`,
        cliente: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        equipo: formData.detalles.equipo,
        problema: formData.detalles.problema,
        rango_estimado: `Gs. ${formData.detalles.rango}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function guardarPrecioElectro(data: any) {
  try {
    const { error } = await supabase
      .from('precios_reportados')
      .insert([{
        servicio_slug: 'electrodomesticos',
        monto_pagado: parseInt(data.monto.replace(/\./g, "")),
        ciudad: data.ciudad,
        incluyo_materiales: data.incluyoMateriales === 'si',
        comentario: `Equipo: ${data.equipo} - ${data.comentario}`
      }]);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}