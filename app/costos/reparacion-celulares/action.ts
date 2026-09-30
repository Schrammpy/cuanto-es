'use server'
import { supabase } from "@/lib/supabase";

export async function enviarLeadCelular(formData: any) {
  try {
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([{
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'reparacion_celular',
          detalles_calculo: { ...formData.detalles }
      }]);

    if (dbError) throw new Error("Error DB");

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        subject: `📱 NUEVO LEAD CELULARES: ${formData.nombre}`,
        cliente: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        equipo: `${formData.detalles.marca} (Gama ${formData.detalles.gama})`,
        problema: formData.detalles.reparacion,
        rango_estimado: `Gs. ${formData.detalles.rango}`
      })
    });

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}

export async function guardarPrecioCelular(data: any) {
  try {
    const { error } = await supabase
      .from('precios_reportados')
      .insert([{
        servicio_slug: 'reparacion_celular',
        monto_pagado: parseInt(data.monto.replace(/\./g, "")),
        ciudad: data.ciudad,
        incluyo_materiales: data.incluyoMateriales === 'si',
        comentario: `Modelo: ${data.modelo} - ${data.comentario}`
      }]);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}