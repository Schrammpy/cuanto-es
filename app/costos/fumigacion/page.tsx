'use client';

import React, { useState } from 'react';

import {
  Bug,
  TrendingUp,
  X,
} from 'lucide-react';

import Footer from '@/components/Footer';

import {
  enviarLeadFumigacion,
  guardarPrecioFumigacion
} from './action';


export default function FumigacionPage() {

  const [m2, setM2] = useState('');
  const [tipo, setTipo] = useState('casa');

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);

  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);


  const formatGs = (num: number) =>
    new Intl.NumberFormat('es-PY').format(Math.round(num));


  const calcular = () => {

    setLoading(true);

    setTimeout(() => {

      const metros = parseFloat(m2);

      if (!metros || metros <= 0) {
        alert('Ingresá los m²');
        setLoading(false);
        return;
      }

      // Lógica simplificada de fumigación
      let base = 180000;

      if (metros > 300) {
        base = 600000;
      } else if (metros > 200) {
        base = 420000;
      } else if (metros > 100) {
        base = 320000;
      }

      setResultado({
        total: base,
        m2: metros,
        tipo
      });

      setLoading(false);

    }, 500);

  };


  const handleLeadSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    setFormLoading(true);

    const formData = new FormData(e.currentTarget);

    const data = {

      nombre: formData.get('nombre'),

      telefono: formData.get('telefono'),

      ciudad: formData.get('ciudad'),

      detalles: {
        ...resultado,
        total: new Intl.NumberFormat('es-PY')
          .format(resultado.total)
      }

    };

    const res = await enviarLeadFumigacion(data);

    if (res.success) {

      setLeadSent(true);

      setTimeout(() => {

        setShowForm(false);

        setLeadSent(false);

      }, 3000);

    }

    setFormLoading(false);

  };


  const handleReportSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {

    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {

      monto: formData.get('monto'),

      ciudad: formData.get('ciudad'),

      incluyoMateriales:
        formData.get('incluyoMateriales') || 'no',

      comentario: formData.get('comentario')

    };

    const res = await guardarPrecioFumigacion(data);

    if (res.success) {

      setReportSent(true);

      setTimeout(() => {

        setShowReportModal(false);

        setReportSent(false);

      }, 3000);

    }

  };


  return (

    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">

      {/* HERO */}

      <section className="bg-slate-900 text-white py-16 md:py-24 px-4">

        <div className="max-w-4xl mx-auto space-y-6">

          <div
            className="
              flex items-center gap-2
              text-blue-400
              text-[10px]
              font-black
              uppercase
              tracking-[0.2em]
            "
          >

            <TrendingUp className="w-4 h-4" />

            Precios de Referencia • 2026

          </div>


          <h1
            className="
              text-4xl
              md:text-6xl
              font-[900]
              tracking-tighter
              leading-none
            "
          >

            ¿Cuánto cuesta

            <br />

            <span className="text-blue-500 italic">
              fumigar hoy?
            </span>

          </h1>


          <p
            className="
              text-slate-400
              text-sm
              md:text-base
              font-medium
              max-w-2xl
              leading-relaxed
            "
          >

            Estimaciones para hogares, oficinas y depósitos
            en Asunción y Central.

          </p>


          {/* REFERENCIAS */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-4
              pt-6
            "
          >

            <div
              className="
                bg-white/5
                border
                border-white/10
                p-6
                rounded-3xl
                backdrop-blur-sm
              "
            >

              <p
                className="
                  text-[10px]
                  font-bold
                  text-slate-400
                  uppercase
                  tracking-widest
                  mb-1
                "
              >

                Casa hasta 50m²

              </p>

              <p
                className="
                  text-2xl
                  lg:text-3xl
                  font-black
                  whitespace-nowrap
                "
              >

                Gs. 180.000

                <span
                  className="
                    text-xs
                    font-normal
                    opacity-50
                    ml-1
                  "
                >

                  promedio

                </span>

              </p>

            </div>


            <div
              className="
                bg-white/5
                border
                border-white/10
                p-6
                rounded-3xl
                text-emerald-400
                backdrop-blur-sm
              "
            >

              <p
                className="
                  text-[10px]
                  font-bold
                  text-emerald-500/60
                  uppercase
                  tracking-widest
                  mb-1
                "
              >

                Depósito / Comercio

              </p>

              <p
                className="
                  text-2xl
                  lg:text-3xl
                  font-black
                  whitespace-nowrap
                "
              >

                450 a 600 mil

              </p>

            </div>


            <div
              className="
                bg-white/5
                border
                border-white/10
                p-6
                rounded-3xl
                backdrop-blur-sm
              "
            >

              <p
                className="
                  text-[10px]
                  font-bold
                  text-slate-400
                  uppercase
                  tracking-widest
                  mb-1
                "
              >

                Servicio Premium

              </p>

              <p
                className="
                  text-2xl
                  lg:text-3xl
                  font-black
                  text-blue-400
                  whitespace-nowrap
                "
              >

                800 mil

                <span
                  className="
                    text-xs
                    font-normal
                    text-slate-400
                    ml-1
                  "
                >

                  max

                </span>

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* CALCULADORA */}

      <section
        className="
          max-w-4xl
          mx-auto
          px-4
          -mt-10
          relative
          z-10
        "
      >

        <div
          className="
            bg-white
            rounded-[3rem]
            shadow-2xl
            p-8
            md:p-12
            border
            border-slate-100
            space-y-8
          "
        >

          {/* CABECERA */}

          <div
            className="
              flex
              items-center
              gap-3
              border-b
              border-slate-100
              pb-6
            "
          >

            <div
              className="
                bg-orange-50
                p-3
                rounded-2xl
                text-orange-600
              "
            >

              <Bug className="w-6 h-6" />

            </div>


            <div>

              <h2
                className="
                  text-xl
                  font-black
                  uppercase
                  tracking-tight
                  text-slate-900
                "
              >

                Calculá tu caso exacto

              </h2>

              <p
                className="
                  text-xs
                  text-slate-400
                  font-medium
                "
              >

                Ingresá la superficie y tipo de propiedad

              </p>

            </div>

          </div>


          {/* CONTROLES */}

          <div className="space-y-6">

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              "
            >

              {/* SUPERFICIE */}

              <div
                className="
                  min-h-[116px]
                  border-2
                  border-blue-600
                  rounded-[24px]
                  px-6
                  py-5
                  flex
                  items-center
                  bg-white
                "
              >

                <div className="w-full">

                  <p
                    className="
                      text-[10px]
                      font-black
                      text-slate-400
                      uppercase
                      tracking-[0.15em]
                      mb-2
                    "
                  >

                    Superficie aprox. (m²)

                  </p>


                  <div className="flex items-center">

                    <input
                      type="number"
                      min="1"
                      step="1"
                      inputMode="numeric"
                      value={m2}
                      onChange={(e) => setM2(e.target.value)}
                      placeholder="0"
                      className="
                        w-full
                        bg-transparent
                        outline-none
                        border-none
                        font-black
                        text-3xl
                        text-slate-900
                        appearance-none
                      "
                    />

                    <span
                      className="
                        text-slate-300
                        font-black
                        text-xl
                        ml-3
                        shrink-0
                      "
                    >

                      m²

                    </span>

                  </div>

                </div>

              </div>


              {/* TIPO DE PROPIEDAD */}

              <div
                className="
                  min-h-[116px]
                  bg-slate-100
                  rounded-[24px]
                  p-2
                  grid
                  grid-cols-3
                  gap-2
                  items-stretch
                "
              >

                {[
                  {
                    id: 'casa',
                    label: 'Casa'
                  },
                  {
                    id: 'oficina',
                    label: 'Oficina'
                  },
                  {
                    id: 'deposito',
                    label: 'Depósito'
                  }
                ].map((item) => (

                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTipo(item.id)}
                    className={`
                      rounded-[18px]
                      px-2
                      py-4
                      text-[10px]
                      sm:text-xs
                      font-black
                      uppercase
                      tracking-wider
                      transition-all
                      ${
                        tipo === item.id
                          ? `
                            bg-white
                            text-blue-600
                            shadow-sm
                          `
                          : `
                            text-slate-400
                            hover:text-slate-600
                          `
                      }
                    `}
                  >

                    {item.label}

                  </button>

                ))}

              </div>

            </div>


            {/* BOTÓN */}

            <button
              type="button"
              onClick={calcular}
              disabled={loading}
              className="
                w-full
                bg-slate-900
                hover:bg-slate-800
                disabled:opacity-60
                text-white
                font-black
                py-5
                rounded-2xl
                uppercase
                text-xs
                tracking-widest
                transition-all
                shadow-lg
              "
            >

              {loading
                ? 'Calculando...'
                : 'Calcular presupuesto'
              }

            </button>

          </div>


          {/* RESULTADO */}

          {resultado && (

            <div
              className="
                pt-8
                border-t
                border-slate-100
                space-y-6
              "
            >

              <p
                className="
                  text-center
                  text-[10px]
                  font-black
                  text-slate-400
                  uppercase
                  tracking-[0.2em]
                "
              >

                Costo Estimado

              </p>


              <p
                className="
                  text-5xl
                  font-[900]
                  text-emerald-600
                  tracking-tighter
                  italic
                  text-center
                "
              >

                Gs. {formatGs(resultado.total)}

              </p>


              <div
                className="
                  text-center
                  text-xs
                  text-slate-400
                  font-medium
                "
              >

                {resultado.m2} m² · {resultado.tipo}

              </div>


              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  font-black
                  py-5
                  rounded-2xl
                  transition-all
                "
              >

                SOLICITAR FUMIGACIÓN

              </button>

            </div>

          )}

        </div>

      </section>


      {/* CROWDSOURCING */}

      <section
        className="
          max-w-4xl
          mx-auto
          px-4
          py-20
        "
      >

        <div
          className="
            bg-blue-50
            rounded-[3rem]
            p-8
            md:p-12
            flex
            flex-col
            md:flex-row
            gap-8
            items-center
            border
            border-blue-100
            shadow-sm
          "
        >

          <div
            className="
              flex-1
              space-y-3
              text-center
              md:text-left
            "
          >

            <h3
              className="
                text-2xl
                font-black
                uppercase
                text-blue-950
                tracking-tight
              "
            >

              ¿Ya contrataste un fumigador hace poco?

            </h3>


            <p
              className="
                text-xs
                text-blue-900/70
                font-medium
                leading-relaxed
              "
            >

              Ayudá a que los precios en Paraguay sean justos
              y transparentes. Reportá tu costo de forma 100%
              anónima para actualizar el índice.

            </p>

          </div>


          <button
            type="button"
            onClick={() => setShowReportModal(true)}
            className="
              bg-blue-600
              hover:bg-blue-700
              text-white
              font-black
              px-8
              py-4
              rounded-2xl
              shadow-lg
              active:scale-95
              transition-all
              text-xs
              uppercase
              tracking-widest
              shrink-0
            "
          >

            APORTAR MI PRECIO

          </button>

        </div>

      </section>


      {/* MODAL SOLICITAR SERVICIO */}

      {showForm && (

        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            p-4
            animate-in
            fade-in
            duration-200
          "
        >

          <div
            className="
              absolute
              inset-0
              bg-slate-900/60
              backdrop-blur-sm
            "
            onClick={() => setShowForm(false)}
          />


          <div
            className="
              bg-white
              p-8
              rounded-[2rem]
              w-full
              max-w-sm
              relative
              z-10
              shadow-2xl
            "
          >

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="
                absolute
                top-6
                right-6
                text-slate-300
                hover:text-slate-500
              "
            >

              <X />

            </button>


            {leadSent ? (

              <p
                className="
                  text-center
                  font-bold
                  text-emerald-600
                  py-8
                "
              >

                ¡Solicitud enviada!

              </p>

            ) : (

              <form
                onSubmit={handleLeadSubmit}
                className="space-y-3"
              >

                <input
                  name="nombre"
                  required
                  placeholder="Tu Nombre"
                  className="
                    w-full
                    bg-slate-50
                    p-3.5
                    rounded-2xl
                    text-xs
                    font-bold
                    outline-none
                    border
                  "
                />

                <input
                  name="telefono"
                  required
                  type="tel"
                  placeholder="WhatsApp"
                  className="
                    w-full
                    bg-slate-50
                    p-3.5
                    rounded-2xl
                    text-xs
                    font-bold
                    outline-none
                    border
                  "
                />

                <input
                  name="ciudad"
                  required
                  placeholder="Ciudad"
                  className="
                    w-full
                    bg-slate-50
                    p-3.5
                    rounded-2xl
                    text-xs
                    font-bold
                    outline-none
                    border
                  "
                />

                <button
                  type="submit"
                  disabled={formLoading}
                  className="
                    w-full
                    bg-blue-600
                    hover:bg-blue-700
                    disabled:opacity-60
                    text-white
                    py-4
                    rounded-2xl
                    font-black
                    uppercase
                    text-xs
                    transition-all
                  "
                >

                  {formLoading
                    ? 'Enviando...'
                    : 'Enviar Solicitud'
                  }

                </button>

              </form>

            )}

          </div>

        </div>

      )}


      {/* MODAL APORTAR PRECIO */}

      {showReportModal && (

        <div
          className="
            fixed
            inset-0
            z-[200]
            flex
            items-center
            justify-center
            p-4
            animate-in
            fade-in
            duration-200
          "
        >

          <div
            className="
              absolute
              inset-0
              bg-slate-900/60
              backdrop-blur-sm
            "
            onClick={() => setShowReportModal(false)}
          />


          <div
            className="
              bg-white
              p-8
              rounded-[2rem]
              w-full
              max-w-sm
              relative
              z-10
              shadow-2xl
            "
          >

            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="
                absolute
                top-6
                right-6
                text-slate-300
                hover:text-slate-500
              "
            >

              <X />

            </button>


            {reportSent ? (

              <p
                className="
                  text-center
                  font-bold
                  text-blue-600
                  py-8
                "
              >

                ¡Aporte guardado!

              </p>

            ) : (

              <form
                onSubmit={handleReportSubmit}
                className="space-y-3"
              >

                <input
                  name="monto"
                  required
                  placeholder="Monto pagado"
                  className="
                    w-full
                    bg-slate-50
                    p-3.5
                    rounded-2xl
                    text-xs
                    font-bold
                    outline-none
                    border
                  "
                />

                <input
                  name="ciudad"
                  required
                  placeholder="Ciudad"
                  className="
                    w-full
                    bg-slate-50
                    p-3.5
                    rounded-2xl
                    text-xs
                    font-bold
                    outline-none
                    border
                  "
                />

                <textarea
                  name="comentario"
                  placeholder="Detalles"
                  className="
                    w-full
                    bg-slate-50
                    p-3.5
                    rounded-2xl
                    text-xs
                    font-medium
                    outline-none
                    border
                    resize-none
                    h-20
                  "
                />

                <button
                  type="submit"
                  className="
                    w-full
                    bg-slate-900
                    hover:bg-slate-800
                    text-white
                    py-4
                    rounded-2xl
                    font-black
                    uppercase
                    text-xs
                    transition-all
                  "
                >

                  Guardar

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