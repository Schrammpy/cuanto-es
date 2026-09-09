'use server'
import { supabase } from "@/lib/supabase";

// 1. ENVÍO DE LEADS A TU GMAIL (Ya funcionaba)
export async function enviarLeadPintura(formData: any) {
  const montoFormateado = new Intl.NumberFormat('es-PY').format(formData.total);

  try {
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([{
        nombre_completo: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        servicio_tag: 'pintura',
        detalles_calculo: { m2: formData.m2, tipo: formData.tipo, estimado: formData.total }
      }]);

    if (dbError) throw new Error("Error DB");

    await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        subject: `🚨 NUEVO LEAD PINTURA: ${formData.nombre}`,
        cliente: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        detalles: `${formData.m2}m² - Pintura ${formData.tipo}`,
        presupuesto_sugerido: `Gs. ${montoFormateado}`
      })
    });

    return { success: true, message: "¡Solicitud recibida! Un pintor te contactará pronto." };
  } catch (error) {
    return { success: false, message: "Error al procesar pedido." };
  }
}

// 2. CROWDSOURCING: GUARDAR PRECIO REPORTADO POR EL USUARIO (NUEVO DEL PDF)
export async function guardarPrecioReportado(data: any) {
  try {
    const { error } = await supabase
      .from('precios_reportados')
      .insert([{
        servicio_slug: 'pintura',
        monto_pagado: parseInt(data.monto.replace(/\./g, "")),
        ciudad: data.ciudad,
        incluyo_materiales: data.materiales,
        comentario: data.comentario
      }]);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    return { success: false };
  }
}