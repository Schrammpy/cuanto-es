'use server';

import { supabase } from '@/lib/supabase';


/* ============================================================
   1. OBTENER PRECIOS DE AIRE ACONDICIONADO
   ============================================================ */

export async function obtenerPreciosAire() {

  try {

    const { data, error } = await supabase
      .from('precios_servicios')
      .select(`
        categoria,
        servicio,
        unidad,
        precio_min,
        precio_max,
        precio_materiales_est,
        descripcion_breve
      `)
      .eq('categoria', 'clima')
      .order('servicio', {
        ascending: true
      });


    if (error) {

      console.error(
        'Error obteniendo precios de aire acondicionado:',
        error
      );


      return {
        success: false,
        data: []
      };

    }


    const precios =
      (data ?? []).map(item => ({

        ...item,

        precio_min:
          Number(
            item.precio_min ?? 0
          ),

        precio_max:
          Number(
            item.precio_max ?? 0
          ),

        precio_materiales_est:
          item.precio_materiales_est !== null &&
          item.precio_materiales_est !== undefined

            ? Number(
                item.precio_materiales_est
              )

            : 0

      }));


    return {
      success: true,
      data: precios
    };

  } catch (err) {

    console.error(
      'Error inesperado obteniendo precios:',
      err
    );


    return {
      success: false,
      data: []
    };

  }

}


/* ============================================================
   FUNCIONES AUXILIARES
   ============================================================ */

function obtenerNombreServicio(
  detalles: any
) {

  const nombres: Record<string, string> = {

    instalacion_12k:
      'Instalación Split 9.000 - 12.000 BTU',

    instalacion_18k:
      'Instalación Split 18.000 BTU',

    instalacion_24k:
      'Instalación Split 24.000 BTU',

    mantenimiento_preventivo:
      'Mantenimiento / Limpieza',

    visita_tecnica:
      'Visita técnica / Diagnóstico',

    desmontaje:
      'Desmontaje',

    traslado:
      'Traslado de equipo',

    fuga_r22:
      'Corrección de fuga + refrigerante R22',

    fuga_r410a:
      'Corrección de fuga + refrigerante R410A'

  };


  if (
    detalles?.servicio &&
    nombres[detalles.servicio]
  ) {

    return nombres[
      detalles.servicio
    ];

  }


  /*
   * Compatibilidad con los datos
   * generados por la versión anterior.
   */

  if (
    detalles?.tipo === 'instalacion'
  ) {

    return detalles?.btu

      ? `Instalación ${detalles.btu} BTU`

      : 'Instalación de aire acondicionado';

  }


  if (
    detalles?.tipo === 'mantenimiento'
  ) {

    return 'Mantenimiento / Limpieza';

  }


  return 'Servicio de aire acondicionado';

}


function formatoGs(
  valor: any
) {

  const numero =
    Number(valor);


  if (
    Number.isNaN(numero)
  ) {

    return '0';

  }


  return new Intl.NumberFormat(
    'es-PY'
  ).format(numero);

}


function obtenerPresupuestoLead(
  detalles: any
) {

  const totalMin =
    Number(
      detalles?.totalMin ?? 0
    );


  const totalMax =
    Number(
      detalles?.totalMax ??
      detalles?.totalMin ??
      0
    );


  if (
    totalMin > 0 &&
    totalMax > 0
  ) {

    if (
      totalMin === totalMax
    ) {

      return (
        `Gs. ${formatoGs(totalMin)}`
      );

    }


    return (
      `Gs. ${formatoGs(totalMin)} ` +
      `a Gs. ${formatoGs(totalMax)}`
    );

  }


  /*
   * Compatibilidad con la versión
   * anterior de la calculadora.
   */

  if (
    detalles?.total
  ) {

    return (
      `Gs. ${detalles.total}`
    );

  }


  return 'A confirmar';

}


/* ============================================================
   2. LEAD PARA TÉCNICOS
   ============================================================ */

export async function enviarLeadAire(
  formData: any
) {

  try {

    const {
      error: dbError
    } = await supabase
      .from('leads_servicios')
      .insert([
        {

          nombre_completo:
            formData.nombre,

          telefono:
            formData.telefono,

          ciudad:
            formData.ciudad,

          servicio_tag:
            'aire_acondicionado',

          detalles_calculo: {
            ...formData.detalles
          }

        }
      ]);


    if (dbError) {

      console.error(
        'Error guardando lead de aire acondicionado:',
        dbError
      );


      throw dbError;

    }


    const nombreServicio =
      obtenerNombreServicio(
        formData.detalles
      );


    const cantidad =
      Number(
        formData.detalles?.cantidad ?? 1
      );


    const presupuesto =
      obtenerPresupuestoLead(
        formData.detalles
      );


    const response =
      await fetch(
        'https://formspree.io/f/mkjnojzj',
        {

          method: 'POST',

          headers: {

            'Content-Type':
              'application/json',

            'Accept':
              'application/json'

          },

          body: JSON.stringify({

            subject:
              `❄️ NUEVO LEAD AIRE: ${formData.nombre}`,

            cliente:
              formData.nombre,

            telefono:
              formData.telefono,

            ciudad:
              formData.ciudad,

            detalles:
              `${nombreServicio} - ${cantidad} equipo(s)`,

            presupuesto_estimado:
              presupuesto

          })

        }
      );


    /*
     * El lead ya quedó almacenado
     * en Supabase.
     *
     * Si Formspree presenta algún
     * inconveniente simplemente
     * registramos el error.
     */

    if (!response.ok) {

      console.error(
        'El lead fue guardado, pero Formspree respondió:',
        response.status
      );

    }


    return {
      success: true
    };

  } catch (err) {

    console.error(
      'Error enviando lead de aire acondicionado:',
      err
    );


    return {
      success: false
    };

  }

}


/* ============================================================
   3. CROWDSOURCING
   ¿CUÁNTO PAGASTE POR TU AIRE?
   ============================================================ */

export async function guardarPrecioAire(
  data: any
) {

  try {

    /*
     * Admitimos:
     *
     * 250000
     * 250.000
     * Gs. 250.000
     */

    const montoLimpio =
      String(
        data.monto ?? ''
      )
        .replace(/\./g, '')
        .replace(/\s/g, '')
        .replace(/[^\d]/g, '');


    const montoPagado =
      parseInt(
        montoLimpio,
        10
      );


    if (
      !Number.isFinite(montoPagado) ||
      montoPagado <= 0
    ) {

      return {
        success: false
      };

    }


    const { error } =
      await supabase
        .from('precios_reportados')
        .insert([
          {

            servicio_slug:
              'aire_acondicionado',

            monto_pagado:
              montoPagado,

            ciudad:
              data.ciudad,

            incluyo_materiales:
              data.materiales === 'si',

            comentario:
              data.comentario

          }
        ]);


    if (error) {

      console.error(
        'Error guardando precio reportado:',
        error
      );


      throw error;

    }


    return {
      success: true
    };

  } catch (err) {

    console.error(
      'Error guardando aporte de precio:',
      err
    );


    return {
      success: false
    };

  }

}