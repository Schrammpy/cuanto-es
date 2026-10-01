'use client';

import React, { useEffect, useState } from 'react';

import {
  ThermometerSnowflake,
  Info,
  TrendingUp,
  Calculator,
  ChevronRight,
  CheckCircle2,
  Loader2,
  X
} from 'lucide-react';

import Footer from '@/components/Footer';

import {
  enviarLeadAire,
  guardarPrecioAire,
  obtenerPreciosAire
} from './action';


type TipoServicio =
  | 'instalacion'
  | 'mantenimiento'
  | 'otros';


interface PrecioServicio {
  categoria: string;
  servicio: string;
  unidad: string;
  precio_min: number | string;
  precio_max: number | string;
  precio_materiales_est?: number | string | null;
  descripcion_breve?: string | null;
}


const INSTALACIONES: Record<string, string> = {
  '12000': 'instalacion_12k',
  '18000': 'instalacion_18k',
  '24000': 'instalacion_24k'
};


const OTROS_SERVICIOS = [
  {
    id: 'visita_tecnica',
    label: 'Visita técnica / diagnóstico'
  },
  {
    id: 'desmontaje',
    label: 'Desmontaje'
  },
  {
    id: 'traslado',
    label: 'Traslado de equipo'
  },
  {
    id: 'fuga_r22',
    label: 'Corrección de fuga + refrigerante R22'
  },
  {
    id: 'fuga_r410a',
    label: 'Corrección de fuga + refrigerante R410A'
  }
];


export default function AireCostosPage() {

  const currentYear = new Date().getFullYear();

  const currentMonth = new Intl.DateTimeFormat(
    'es-PY',
    { month: 'long' }
  ).format(new Date());


  // ============================================================
  // PRECIOS
  // ============================================================

  const [precios, setPrecios] =
    useState<PrecioServicio[]>([]);

  const [preciosLoading, setPreciosLoading] =
    useState(true);

  const [preciosError, setPreciosError] =
    useState('');


  // ============================================================
  // CALCULADORA
  // ============================================================

  const [btu, setBtu] =
    useState('12000');

  const [tipo, setTipo] =
    useState<TipoServicio>('instalacion');

  const [otroServicio, setOtroServicio] =
    useState('visita_tecnica');

  const [cantidad, setCantidad] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [resultado, setResultado] =
    useState<any>(null);


  // ============================================================
  // MODALES
  // ============================================================

  const [showForm, setShowForm] =
    useState(false);

  const [leadSent, setLeadSent] =
    useState(false);

  const [formLoading, setFormLoading] =
    useState(false);

  const [showReportModal, setShowReportModal] =
    useState(false);

  const [reportSent, setReportSent] =
    useState(false);


  // ============================================================
  // FORMATOS
  // ============================================================

  const formatGs = (valor: number) => {

    return new Intl.NumberFormat('es-PY').format(valor);

  };


  /*
   * Formato utilizado únicamente en las tarjetas superiores.
   *
   * 300000 -> 300
   * 450000 -> 450
   *
   * Resultado:
   * Gs. 300 a 450 mil
   */
  const formatRangoCompacto = (
    minimo: number,
    maximo: number
  ) => {

    /*
     * Ambos valores menores a un millón.
     */

    if (maximo < 1000000) {

      const minMiles =
        Math.round(minimo / 1000);

      const maxMiles =
        Math.round(maximo / 1000);


      if (minimo === maximo) {

        return `Gs. ${minMiles} mil`;

      }


      return `Gs. ${minMiles} a ${maxMiles} mil`;

    }


    /*
     * Ambos valores desde un millón.
     */

    if (
      minimo >= 1000000 &&
      maximo >= 1000000
    ) {

      const formatter =
        new Intl.NumberFormat('es-PY', {
          maximumFractionDigits: 2
        });


      const minMillones =
        formatter.format(minimo / 1000000);

      const maxMillones =
        formatter.format(maximo / 1000000);


      if (minimo === maximo) {

        return `Gs. ${minMillones} mill.`;

      }


      return `Gs. ${minMillones} a ${maxMillones} mill.`;

    }


    /*
     * Caso poco habitual:
     * rango que cruza un millón.
     *
     * Ejemplo:
     * 900.000 a 1.200.000
     */

    return (
      `Gs. ${formatGs(minimo)} ` +
      `a ${formatGs(maximo)}`
    );

  };


  // ============================================================
  // CARGAR PRECIOS DESDE SUPABASE
  // ============================================================

  useEffect(() => {

    const cargarPrecios = async () => {

      try {

        setPreciosLoading(true);
        setPreciosError('');


        const res: any =
          await obtenerPreciosAire();


        const data: PrecioServicio[] =
          Array.isArray(res)
            ? res
            : Array.isArray(res?.data)
              ? res.data
              : Array.isArray(res?.precios)
                ? res.precios
                : [];


        setPrecios(data);


        if (data.length === 0) {

          setPreciosError(
            'No pudimos cargar los precios de referencia.'
          );

        }


        /*
         * Si visita_tecnica no existe,
         * dejamos seleccionado el primer
         * servicio adicional disponible.
         */

        const disponibles =
          OTROS_SERVICIOS.filter(
            item =>
              data.some(
                precio =>
                  precio.servicio === item.id
              )
          );


        if (disponibles.length > 0) {

          setOtroServicio(prev => {

            const existeActual =
              disponibles.some(
                item => item.id === prev
              );

            return existeActual
              ? prev
              : disponibles[0].id;

          });

        }

      } catch (error) {

        console.error(
          'Error cargando precios de aire acondicionado:',
          error
        );


        setPreciosError(
          'No pudimos cargar los precios de referencia.'
        );

      } finally {

        setPreciosLoading(false);

      }

    };


    cargarPrecios();

  }, []);


  // ============================================================
  // UTILIDADES
  // ============================================================

  const buscarPrecio = (
    servicio: string
  ) => {

    return precios.find(
      precio =>
        precio.servicio === servicio
    );

  };


  /*
   * Rango compacto utilizado en las
   * tarjetas superiores.
   */
  const rangoServicio = (
    servicio: string
  ) => {

    const precio =
      buscarPrecio(servicio);


    if (!precio) {

      return 'Consultá';

    }


    const minimo =
      Number(precio.precio_min);

    const maximo =
      Number(precio.precio_max);


    return formatRangoCompacto(
      minimo,
      maximo
    );

  };


  /*
   * Busca el valor mínimo y máximo
   * considerando todas las instalaciones.
   */
  const calcularRangoGeneralInstalacion =
    () => {

      const servicios = [

        buscarPrecio(
          'instalacion_12k'
        ),

        buscarPrecio(
          'instalacion_18k'
        ),

        buscarPrecio(
          'instalacion_24k'
        )

      ].filter(Boolean) as PrecioServicio[];


      if (servicios.length === 0) {

        return 'Consultá';

      }


      const minimos =
        servicios.map(
          p => Number(p.precio_min)
        );

      const maximos =
        servicios.map(
          p => Number(p.precio_max)
        );


      const minimo =
        Math.min(...minimos);

      const maximo =
        Math.max(...maximos);


      return formatRangoCompacto(
        minimo,
        maximo
      );

    };


  // ============================================================
  // OTROS SERVICIOS DISPONIBLES
  // ============================================================

  const otrosServiciosDisponibles =
    OTROS_SERVICIOS.filter(
      servicio =>
        precios.some(
          precio =>
            precio.servicio ===
            servicio.id
        )
    );


  // ============================================================
  // CALCULAR
  // ============================================================

  const calcular = () => {

    setLoading(true);
    setPreciosError('');


    setTimeout(() => {

      let codigoServicio = '';


      if (tipo === 'instalacion') {

        codigoServicio =
          INSTALACIONES[btu];

      }


      if (tipo === 'mantenimiento') {

        codigoServicio =
          'mantenimiento_preventivo';

      }


      if (tipo === 'otros') {

        codigoServicio =
          otroServicio;

      }


      const precio =
        buscarPrecio(codigoServicio);


      if (!precio) {

        setResultado(null);

        setPreciosError(
          'No encontramos un precio configurado para este servicio.'
        );

        setLoading(false);

        return;

      }


      const precioMin =
        Number(precio.precio_min);

      const precioMax =
        Number(precio.precio_max);


      const totalMin =
        precioMin * cantidad;

      const totalMax =
        precioMax * cantidad;


      setResultado({

        /*
         * Mantenemos total por compatibilidad
         * con el sistema actual de leads.
         */
        total: totalMin,

        totalMin,

        totalMax,

        precioMin,

        precioMax,

        servicio:
          codigoServicio,

        descripcion:
          precio.descripcion_breve || '',

        btu:
          tipo === 'instalacion'
            ? btu
            : null,

        tipo,

        cantidad

      });


      setLoading(false);

    }, 350);

  };


  // ============================================================
  // LEAD PARA TÉCNICOS
  // ============================================================

  const handleLeadSubmit =
    async (
      e: React.FormEvent<HTMLFormElement>
    ) => {

      e.preventDefault();

      setFormLoading(true);


      const formData =
        new FormData(e.currentTarget);


      const data = {

        nombre:
          formData.get('nombre'),

        telefono:
          formData.get('telefono'),

        ciudad:
          formData.get('ciudad'),

        detalles: {

          ...resultado,

          total:
            new Intl.NumberFormat('es-PY')
              .format(resultado.total)

        }

      };


      const res =
        await enviarLeadAire(data);


      if (res.success) {

        setLeadSent(true);


        setTimeout(() => {

          setShowForm(false);
          setLeadSent(false);

        }, 3000);

      }


      setFormLoading(false);

    };


  // ============================================================
  // APORTE DE PRECIOS
  // ============================================================

  const handleReportSubmit =
    async (
      e: React.FormEvent<HTMLFormElement>
    ) => {

      e.preventDefault();


      const formData =
        new FormData(e.currentTarget);


      const data = {

        monto:
          formData.get('monto'),

        ciudad:
          formData.get('ciudad'),

        materiales:
          formData.get('materiales'),

        comentario:
          formData.get('comentario')

      };


      const res =
        await guardarPrecioAire(data);


      if (res.success) {

        setReportSent(true);


        setTimeout(() => {

          setShowReportModal(false);
          setReportSent(false);

        }, 3000);

      }

    };


  // ============================================================
  // RENDER
  // ============================================================

  return (

    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">


      {/* =====================================================
          1. RESUMEN DE PRECIOS
      ===================================================== */}

      <section className="bg-slate-900 text-white py-16 md:py-24 px-4">

        <div className="max-w-4xl mx-auto space-y-6">


          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">

            <TrendingUp className="w-4 h-4" />

            Precios de Referencia • {currentMonth} {currentYear}

          </div>


          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none">

            ¿Cuánto cuesta instalar un{' '}

            <span className="text-blue-500 italic">

              aire en Paraguay?

            </span>

          </h1>


          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">

            Rangos reales observados para instalación de Split,
            mantenimiento y servicios de aire acondicionado
            en Asunción y Central.

          </p>



          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">


            {/* INSTALACIÓN ESTÁNDAR */}

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">

                Instalación Estándar

                <span className="block mt-1">

                  9.000 - 12.000 BTU

                </span>

              </p>


              <p className="text-2xl lg:text-[28px] font-black whitespace-nowrap tracking-tight">

                {preciosLoading
                  ? 'Cargando...'
                  : rangoServicio(
                      'instalacion_12k'
                    )
                }

              </p>

            </div>



            {/* RANGO GENERAL */}

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">

              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-2">

                Instalaciones Split

              </p>


              <p className="text-2xl lg:text-[28px] font-black whitespace-nowrap tracking-tight">

                {preciosLoading
                  ? 'Cargando...'
                  : calcularRangoGeneralInstalacion()
                }

              </p>

            </div>



            {/* MANTENIMIENTO */}

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">

              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">

                Limpieza / Mantenimiento

              </p>


              <p className="text-2xl lg:text-[28px] font-black text-blue-400 whitespace-nowrap tracking-tight">

                {preciosLoading
                  ? 'Cargando...'
                  : rangoServicio(
                      'mantenimiento_preventivo'
                    )
                }

              </p>

            </div>


          </div>

        </div>

      </section>



      {/* =====================================================
          2. CALCULADORA
      ===================================================== */}

      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">

        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">


          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">

            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600">

              <ThermometerSnowflake className="w-6 h-6" />

            </div>


            <div>

              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">

                Calculá tu presupuesto

              </h2>


              <p className="text-xs text-slate-400 font-medium">

                Elegí el servicio requerido y obtené un rango
                de precio de referencia

              </p>

            </div>

          </div>



          <div className="space-y-6">


            {/* TIPO DE SERVICIO */}

            <div className="grid grid-cols-1 sm:grid-cols-3 bg-slate-100 p-2 rounded-2xl gap-2">


              <button

                type="button"

                onClick={() => {

                  setTipo('instalacion');
                  setResultado(null);

                }}

                className={`py-4 px-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                  tipo === 'instalacion'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-400'
                }`}

              >

                Instalación Nueva

              </button>



              <button

                type="button"

                onClick={() => {

                  setTipo('mantenimiento');
                  setResultado(null);

                }}

                className={`py-4 px-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                  tipo === 'mantenimiento'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-400'
                }`}

              >

                Mantenimiento

              </button>



              <button

                type="button"

                onClick={() => {

                  setTipo('otros');
                  setResultado(null);

                }}

                className={`py-4 px-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${
                  tipo === 'otros'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-400'
                }`}

              >

                Otros Servicios

              </button>


            </div>



            {/* INSTALACIÓN */}

            {tipo === 'instalacion' && (

              <div className="space-y-2">

                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">

                  Capacidad del equipo

                </label>


                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">

                  {[
                    {
                      id: '12000',
                      label: '9.000 - 12.000 BTU'
                    },
                    {
                      id: '18000',
                      label: '18.000 BTU'
                    },
                    {
                      id: '24000',
                      label: '24.000 BTU'
                    }
                  ].map(item => (

                    <button

                      type="button"

                      key={item.id}

                      onClick={() => {

                        setBtu(item.id);
                        setResultado(null);

                      }}

                      className={`p-4 rounded-2xl border-2 text-center transition-all ${
                        btu === item.id
                          ? 'border-blue-600 bg-blue-50/50 text-blue-600 font-black'
                          : 'border-slate-100 text-slate-500 font-bold'
                      }`}

                    >

                      <span className="text-xs block">

                        {item.label}

                      </span>

                    </button>

                  ))}

                </div>

              </div>

            )}



            {/* MANTENIMIENTO */}

            {tipo === 'mantenimiento' && (

              <div className="bg-blue-50/60 border border-blue-100 p-5 rounded-2xl">

                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">

                  Mantenimiento / Limpieza

                </p>


                <p className="text-sm font-bold text-blue-950">

                  Limpieza y mantenimiento preventivo de
                  unidad interior y exterior.

                </p>


                {!preciosLoading && (

                  <p className="text-xs text-blue-700 mt-2 font-medium">

                    Referencia actual:{' '}

                    {rangoServicio(
                      'mantenimiento_preventivo'
                    )}

                  </p>

                )}

              </div>

            )}



            {/* OTROS SERVICIOS */}

            {tipo === 'otros' && (

              <div className="space-y-2">

                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">

                  Servicio requerido

                </label>


                <select

                  value={otroServicio}

                  onChange={e => {

                    setOtroServicio(
                      e.target.value
                    );

                    setResultado(null);

                  }}

                  className="w-full bg-slate-50 border border-slate-200 p-4 rounded-2xl text-sm font-bold text-slate-700 outline-none focus:border-blue-500"

                >

                  {otrosServiciosDisponibles.map(
                    servicio => (

                      <option
                        key={servicio.id}
                        value={servicio.id}
                      >

                        {servicio.label}

                      </option>

                    )
                  )}

                </select>


                {!preciosLoading &&
                 otrosServiciosDisponibles.length === 0 && (

                  <p className="text-xs text-amber-600 font-medium px-2">

                    No hay otros servicios configurados
                    actualmente.

                  </p>

                )}

              </div>

            )}



            {/* CANTIDAD */}

            <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center gap-4">

              <div>

                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">

                  Cantidad de unidades

                </p>


                <p className="text-xs text-slate-500 font-medium">

                  El cálculo se multiplica por la cantidad
                  seleccionada

                </p>

              </div>


              <div className="flex items-center gap-4">


                <button

                  type="button"

                  onClick={() => {

                    setCantidad(
                      Math.max(
                        1,
                        cantidad - 1
                      )
                    );

                    setResultado(null);

                  }}

                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600"

                >

                  -

                </button>


                <span className="font-black text-2xl text-slate-800">

                  {cantidad}

                </span>


                <button

                  type="button"

                  onClick={() => {

                    setCantidad(
                      cantidad + 1
                    );

                    setResultado(null);

                  }}

                  className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600"

                >

                  +

                </button>


              </div>

            </div>


          </div>



          {/* ERROR */}

          {preciosError && (

            <div className="bg-amber-50 border border-amber-200 text-amber-700 p-4 rounded-2xl text-xs font-bold">

              {preciosError}

            </div>

          )}



          {/* CALCULAR */}

          <button

            type="button"

            onClick={calcular}

            disabled={
              loading ||
              preciosLoading ||
              precios.length === 0 ||
              (
                tipo === 'otros' &&
                otrosServiciosDisponibles.length === 0
              )
            }

            className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest"

          >

            {(loading || preciosLoading)
              ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              )
              : (
                <Calculator className="w-5 h-5 text-blue-400" />
              )
            }


            {preciosLoading
              ? 'Cargando precios'
              : 'Calcular precio estimado'
            }

          </button>



          {/* RESULTADO */}

          {resultado && (

            <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">


              <div className="bg-slate-50 p-6 rounded-3xl text-center">


                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">

                  Precio estimado

                </p>


                {resultado.totalMin ===
                 resultado.totalMax ? (

                  <p className="text-4xl md:text-5xl font-[900] text-slate-900 tracking-tighter italic">

                    Gs. {formatGs(
                      resultado.totalMin
                    )}

                  </p>

                ) : (

                  <>

                    <p className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tighter italic">

                      Gs. {formatGs(
                        resultado.totalMin
                      )}

                    </p>


                    <p className="text-xs font-black uppercase tracking-widest text-slate-400 my-1">

                      hasta

                    </p>


                    <p className="text-3xl md:text-5xl font-[900] text-slate-900 tracking-tighter italic">

                      Gs. {formatGs(
                        resultado.totalMax
                      )}

                    </p>

                  </>

                )}


                {resultado.cantidad > 1 && (

                  <p className="text-[11px] text-blue-600 mt-4 font-bold">

                    Estimación para{' '}
                    {resultado.cantidad}{' '}
                    unidades.

                  </p>

                )}


                {resultado.descripcion && (

                  <p className="text-[11px] text-slate-500 mt-4 font-medium max-w-xl mx-auto leading-relaxed">

                    {resultado.descripcion}

                  </p>

                )}


                <p className="text-[10px] text-slate-400 mt-3 font-medium max-w-xl mx-auto leading-relaxed">

                  * Valor de referencia. Materiales
                  adicionales, metros extra de cañería,
                  trabajos especiales, distancia y
                  condiciones del lugar pueden modificar
                  el presupuesto final.

                </p>

              </div>



              <button

                type="button"

                onClick={() =>
                  setShowForm(true)
                }

                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group"

              >

                <span className="uppercase tracking-widest text-xs font-black">

                  Pedir Presupuestos a Técnicos Verificados

                </span>


                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />

              </button>


            </div>

          )}


        </div>

      </section>



      {/* =====================================================
          3. APORTE DE PRECIOS
      ===================================================== */}

      <section className="max-w-4xl mx-auto px-4 py-20">

        <div className="bg-blue-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-blue-100">


          <div className="flex-1 space-y-3 text-center md:text-left">

            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">

              ¿Hiciste service o instalaste hace poco?

            </h3>


            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">

              Tu aporte anónimo ayuda a transparentar el
              mercado paraguayo para que nadie pague de más
              en verano.

            </p>

          </div>


          <button

            type="button"

            onClick={() =>
              setShowReportModal(true)
            }

            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest shrink-0"

          >

            Aportar mi precio

          </button>


        </div>

      </section>



      {/* =====================================================
          4. METODOLOGÍA
      ===================================================== */}

      <section className="max-w-4xl mx-auto px-4 pb-16">

        <div className="border-t border-slate-100 pt-8 space-y-3">


          <div className="flex items-center gap-2 text-slate-400">

            <Info className="w-4 h-4" />


            <h4 className="text-[10px] font-black uppercase tracking-widest">

              Metodología de este cálculo

            </h4>

          </div>


          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">

            Los valores corresponden a rangos de referencia
            relevados entre técnicos particulares e
            instaladores de Central. El precio final puede
            variar según materiales, distancia, estado del
            equipo y condiciones particulares de la
            instalación. No se contemplan perforaciones en
            hormigón armado, trabajos en altura con andamios
            especiales ni circuitos eléctricos nuevos desde
            el medidor de la ANDE, los cuales se presupuestan
            en el sitio.

          </p>


        </div>

      </section>



      {/* =====================================================
          MODAL LEAD
      ===================================================== */}

      {showForm && (

        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">


          <div

            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"

            onClick={() =>
              setShowForm(false)
            }

          />


          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">


            <button

              type="button"

              onClick={() =>
                setShowForm(false)
              }

              className="absolute top-6 right-6 text-slate-300"

            >

              <X />

            </button>


            {leadSent ? (

              <div className="text-center py-8 space-y-3">


                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />


                <p className="font-black text-slate-800 uppercase text-lg">

                  ¡Solicitud Recibida!

                </p>


                <p className="text-xs text-slate-400 font-medium">

                  Un técnico de tu zona se comunicará con vos.

                </p>


              </div>

            ) : (

              <form
                onSubmit={handleLeadSubmit}
                className="space-y-4"
              >


                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">

                  Contactar Técnicos

                </h3>


                <div className="space-y-2">


                  <input

                    name="nombre"

                    required

                    placeholder="Tu Nombre"

                    className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500"

                  />


                  <input

                    name="telefono"

                    required

                    type="tel"

                    placeholder="WhatsApp (ej: 0981...)"

                    className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500"

                  />


                  <input

                    name="ciudad"

                    required

                    placeholder="Ciudad o Barrio"

                    className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500"

                  />


                </div>


                <button

                  disabled={formLoading}

                  className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all"

                >

                  {formLoading
                    ? 'Enviando...'
                    : 'Pedir Presupuestos'
                  }

                </button>


              </form>

            )}


          </div>

        </div>

      )}



      {/* =====================================================
          MODAL APORTE DE PRECIO
      ===================================================== */}

      {showReportModal && (

        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">


          <div

            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"

            onClick={() =>
              setShowReportModal(false)
            }

          />


          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">


            <button

              type="button"

              onClick={() =>
                setShowReportModal(false)
              }

              className="absolute top-6 right-6 text-slate-300"

            >

              <X />

            </button>


            {reportSent ? (

              <div className="text-center py-8 space-y-3">


                <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />


                <p className="font-black text-slate-800 uppercase text-lg">

                  ¡Aporte Guardado!

                </p>


                <p className="text-xs text-slate-400 font-medium">

                  Tu dato ayuda a miles de paraguayos.

                </p>


              </div>

            ) : (

              <form
                onSubmit={handleReportSubmit}
                className="space-y-4"
              >


                <div className="text-center space-y-1">


                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">

                    ¿Cuánto te cobraron?

                  </h3>


                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">

                    Reporte Anónimo

                  </p>


                </div>


                <div className="space-y-2">


                  <input

                    name="monto"

                    required

                    placeholder="Monto total pagado (Gs)"

                    className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500"

                  />


                  <input

                    name="ciudad"

                    required

                    placeholder="Ciudad (ej: Luque, Lambaré)"

                    className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500"

                  />


                  <select

                    name="materiales"

                    className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500"

                  >

                    <option value="si">

                      Incluyó materiales/gas

                    </option>


                    <option value="no">

                      Solo mano de obra

                    </option>

                  </select>


                  <textarea

                    name="comentario"

                    placeholder="Detalles (ej: split 18mil BTU con 3 metros de caño)"

                    className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20"

                  />


                </div>


                <button

                  className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all"

                >

                  Guardar mi reporte

                </button>


              </form>

            )}


          </div>

        </div>

      )}



      <Footer />


    </main>

  );

}