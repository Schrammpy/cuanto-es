'use server'
import { supabase } from "@/lib/supabase";

export async function enviarLeadFlete(formData: any) {
  try {
    // 1. Guardamos en Supabase para tener el registro
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([
        {
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'mudanza_flete',
          detalles_calculo: {
            tamano: formData.detalles.tamano,
            distancia: formData.detalles.distancia,
            ayudantes: formData.detalles.ayudantes,
            total_estimado: formData.detalles.total
          }
        }
      ]);

    if (dbError) throw new Error("Error al guardar en base de datos");

    // 2. Enviamos el aviso a tu correo vía Formspree
    const response = await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        subject: `🚚 NUEVO FLETE: ${formData.nombre}`,
        cliente: formData.nombre,
        telefono: formData.telefono,
        desde: formData.ciudad,
        tipo_carga: formData.detalles.tamano,
        distancia: formData.detalles.distancia,
        ayudantes: formData.detalles.ayudantes,
        monto_sugerido: `Gs. ${formData.detalles.total}`
      })
    });

    if (!response.ok) {
        console.error("Error al enviar a Formspree");
    }

    return { 
        success: true, 
        message: "¡Solicitud recibida! Un fletero verificado te contactará pronto." 
    };

  } catch (error: any) {
    console.error("Error crítico en fletes:", error);
    return { 
        success: false, 
        message: "Ocurrió un error. Por favor, reintentá el envío." 
    };
  }
}