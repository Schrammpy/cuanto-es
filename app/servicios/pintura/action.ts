'use server'
import { supabase } from "@/lib/supabase";

export async function enviarLeadPintura(formData: any) {
  // 1. Formateamos el monto para el correo (ej: 1.500.000)
  const montoFormateado = new Intl.NumberFormat('es-PY').format(formData.total);

  try {
    // 2. GUARDAR EN SUPABASE (Tu respaldo de seguridad)
    const { error: dbError } = await supabase
      .from('leads_servicios')
      .insert([
        {
          nombre_completo: formData.nombre,
          telefono: formData.telefono,
          ciudad: formData.ciudad,
          servicio_tag: 'pintura',
          detalles_calculo: {
            m2: formData.m2,
            tipo: formData.tipo,
            estimado: formData.total
          }
        }
      ]);

    if (dbError) throw new Error("Error al guardar en base de datos");

    // 3. ENVIAR A FORMSPREE (Aviso directo a tu Gmail)
    const response = await fetch("https://formspree.io/f/mkjnojzj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        subject: `🚨 NUEVO LEAD: Pintura para ${formData.nombre}`,
        cliente: formData.nombre,
        telefono: formData.telefono,
        ciudad: formData.ciudad,
        detalles: `${formData.m2}m² - Pintura ${formData.tipo}`,
        presupuesto_sugerido: `Gs. ${montoFormateado}`,
        link_admin: `https://supabase.com/dashboard/project/YOUR_PROJECT_ID/editor` // Opcional
      })
    });

    if (!response.ok) {
        console.error("Error al enviar a Formspree");
    }

    return { 
        success: true, 
        message: "¡Solicitud recibida! Un profesional te contactará pronto." 
    };

  } catch (error: any) {
    console.error("Error crítico:", error);
    return { 
        success: false, 
        message: "Ocurrió un error al procesar tu pedido. Por favor, reintentá." 
    };
  }
}