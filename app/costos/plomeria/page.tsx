'use client';
import React, { useState } from 'react';
import { 
  Wrench, Check, Info, TrendingUp, 
  Calculator, ChevronRight, CheckCircle2, Loader2, 
  User, Phone, MapPin, X, Droplets 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadPlomeria, guardarPrecioPlomeria } from './action';

export default function PlomeriaCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  // Estados Calculadora
  const [servicio, setServicio] = useState('destranque');
  const [urgencia, setUrgencia] = useState('normal');
  const [puntos, setPuntos] = useState(1);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  // Modales
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        let precioBase = 0;

        if (servicio === 'destranque') precioBase = 160000;
        else if (servicio === 'termocalefon') precioBase = 250000;
        else if (servicio === 'griferia') precioBase = 120000;
        else if (servicio === 'fuga') precioBase = 450000;

        let total = precioBase * puntos;

        // Recargo de urgencia o fin de semana
        if (urgencia === 'urgente') total = Math.round(total * 1.3);

        setResultado({ 
            total, 
            precioBase,
            puntos,
            servicio,
            urgencia
        });
        setLoading(false);
    }, 500);
  };

  const handleLeadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
        nombre: formData.get('nombre'),
        telefono: formData.get('telefono'),
        ciudad: formData.get('ciudad'),
        detalles: { ...resultado, total: new Intl.NumberFormat('es-PY').format(resultado.total) }
    };
    const res = await enviarLeadPlomeria(data);
    if (res.success) {
        setLeadSent(true);
        setTimeout(() => { setShowForm(false); setLeadSent(false); }, 3000);
    }
    setFormLoading(false);
  };

  const handleReportSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      monto: formData.get('monto'),
      ciudad: formData.get('ciudad'),
      incluyoMateriales: formData.get('incluyoMateriales'),
      comentario: formData.get('comentario')
    };
    const res = await guardarPrecioPlomeria(data);
    if (res.success) {
      setReportSent(true);
      setTimeout(() => { setShowReportModal(false); setReportSent(false); }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      
      {/* 1. RESUMEN DE PRECIOS INICIAL (SEO / UX) */}
      <section className="bg-slate-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <TrendingUp className="w-4 h-4" /> Precios de Referencia • {currentMonth} {currentYear}
          </div>
          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none">
            ¿Cuánto cobra un <span className="text-blue-500 italic">plomero en Paraguay?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Rangos reales observados para destranques, instalación de grifería, termocalefones y fugas de agua en Asunción y Central.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Destranque Simple / Visita</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">Gs. 160.000 <span className="text-xs font-normal opacity-50">promedio</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Trabajos Habituales</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">120 a 450 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Instalación Termocalefón</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">250 mil <span className="text-xs font-normal text-slate-400">mano de obra</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CALCULADORA DE PLOMERÍA */}
      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
            <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Droplets className="w-6 h-6" /></div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu trabajo de plomería</h2>
              <p className="text-xs text-slate-400 font-medium">Elegí el problema o instalación a realizar</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* TIPO DE TRABAJO */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Tipo de servicio</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'destranque', label: 'Destranque de cañería / baño', desc: 'Inodoros, piletas de cocina o desagües pluviales' },
                  { id: 'griferia', label: 'Cambio de grifería o sifón', desc: 'Instalación de canillas, llaves de paso o flexibles' },
                  { id: 'termocalefon', label: 'Instalación de termocalefón', desc: 'Montaje en pared y conexión de agua fría/caliente' },
                  { id: 'fuga', label: 'Reparación de fuga oculta', desc: 'Picado de pared/piso, cambio de caño roto y cierre' }
                ].map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setServicio(item.id)} 
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${servicio === item.id ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-100 text-slate-600'}`}
                  >
                    <span className="text-xs font-black uppercase block mb-1">{item.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight block">{item.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* URGENCIA */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Horario / Urgencia</label>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setUrgencia('normal')} 
                  className={`p-4 rounded-2xl border-2 text-center text-xs font-black uppercase transition-all ${urgencia === 'normal' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
                >
                  Horario normal (Lunes a Sáb)
                </button>
                <button 
                  onClick={() => setUrgencia('urgente')} 
                  className={`p-4 rounded-2xl border-2 text-center text-xs font-black uppercase transition-all ${urgencia === 'urgente' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-slate-100 text-slate-400'}`}
                >
                  Urgencia / Domingo (+30%)
                </button>
              </div>
            </div>

            {/* PUNTOS / ARTEFACTOS */}
            <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad de puntos / artefactos</p>
                <p className="text-xs text-slate-500 font-medium">Ej: 2 baños, 2 canillas o 1 pérdida</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => setPuntos(Math.max(1, puntos - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">-</button>
                <span className="font-black text-2xl text-slate-800">{puntos}</span>
                <button onClick={() => setPuntos(puntos + 1)} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center font-bold text-slate-600 active:scale-95 transition-all">+</button>
              </div>
            </div>
          </div>

          <button 
            onClick={calcular} 
            disabled={loading} 
            className="w-full bg-slate-900 hover:bg-black text-white font-black py-5 rounded-[2rem] active:scale-95 transition-all shadow-xl flex items-center justify-center gap-3 uppercase text-xs tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Calculator className="w-5 h-5 text-blue-400" />}
            Calcular Mano de Obra
          </button>

          {/* RESULTADO Y LEAD */}
          {resultado && (
            <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
              <div className="bg-slate-50 p-6 rounded-3xl text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Monto Estimado de Mano de Obra</p>
                <p className="text-5xl font-[900] text-slate-900 tracking-tighter italic">
                  Gs. {new Intl.NumberFormat('es-PY').format(resultado.total)}
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase mt-2">
                  * No incluye materiales de ferretería (caños, teflón, pegamentos o repuestos).
                </p>
              </div>

              <button 
                onClick={() => setShowForm(true)} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-[2rem] shadow-xl shadow-blue-200 flex items-center justify-center gap-3 active:scale-95 transition-all group"
              >
                <span className="uppercase tracking-widest text-xs font-black">Pedir Presupuestos a Plomeros Verificados</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>

      
{/* GUIA SEO DE PRECIOS DE PLOMERIA */}
<section className="max-w-4xl mx-auto px-4 py-16 space-y-10">

  <div className="space-y-4">
    <h2 className="text-3xl font-black text-slate-900">
      Precios de mano de obra de plomería en Paraguay
    </h2>

    <p className="text-slate-600 leading-relaxed">
      El costo de contratar un plomero en Paraguay depende
      del tipo de reparación, la cantidad de artefactos,
      la dificultad del trabajo y la urgencia del servicio.
      Los presupuestos de plomería domiciliaria pueden
      variar entre instalaciones sencillas y reparaciones
      complejas de cañerías o fugas ocultas.
    </p>

    <p className="text-slate-600 leading-relaxed">
      En CuantoEs podés consultar precios orientativos
      de mano de obra para servicios de plomería en
      Asunción y Gran Asunción y utilizar una calculadora
      para estimar el costo de tu trabajo en guaraníes.
    </p>
  </div>

  <div className="space-y-4">
    <h2 className="text-2xl font-black text-slate-900">
      ¿Cuánto cobra un plomero en Paraguay?
    </h2>

    <div className="overflow-x-auto rounded-2xl border border-slate-200">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-900 text-white">
          <tr>
            <th className="p-4">Servicio de plomería</th>
            <th className="p-4">Mano de obra base</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="p-4">
              Destranque de cañería o baño
            </td>
            <td className="p-4 font-semibold">
              Gs. 160.000
            </td>
          </tr>

          <tr className="bg-slate-50">
            <td className="p-4">
              Cambio de grifería o sifón
            </td>
            <td className="p-4 font-semibold">
              Gs. 120.000
            </td>
          </tr>

          <tr>
            <td className="p-4">
              Instalación de termocalefón
            </td>
            <td className="p-4 font-semibold">
              Gs. 250.000
            </td>
          </tr>

          <tr className="bg-slate-50">
            <td className="p-4">
              Reparación de fuga oculta
            </td>
            <td className="p-4 font-semibold">
              Gs. 450.000
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p className="text-xs text-slate-500">
      Valores base orientativos para un punto o artefacto,
      utilizados por la calculadora de CuantoEs.
      No incluyen materiales ni repuestos. Los trabajos
      urgentes o realizados en domingo tienen un recargo
      estimado del 30%.
    </p>
  </div>

  <div className="space-y-4">
    <h2 className="text-2xl font-black text-slate-900">
      ¿Cuánto cuesta destapar una cañería o baño?
    </h2>

    <p className="text-slate-600 leading-relaxed">
      Para un destranque sencillo de cañería, pileta
      o baño, la calculadora utiliza una referencia
      de Gs. 160.000 de mano de obra.
    </p>

    <p className="text-slate-600 leading-relaxed">
      El costo puede aumentar cuando la obstrucción
      requiere equipos especiales, desmontar artefactos
      o acceder a cañerías de difícil ubicación.
      Conviene solicitar un diagnóstico antes de
      confirmar el presupuesto.
    </p>
  </div>

  <div className="space-y-4">
    <h2 className="text-2xl font-black text-slate-900">
      ¿Cuánto cobra un plomero por cambiar una canilla?
    </h2>

    <p className="text-slate-600 leading-relaxed">
      La referencia para cambiar una grifería, sifón
      o accesorio sanitario es de Gs. 120.000 de
      mano de obra por punto.
    </p>

    <p className="text-slate-600 leading-relaxed">
      Este valor no incluye la compra de la canilla,
      flexibles, llaves de paso ni otros repuestos.
      Si es necesario reparar conexiones existentes,
      el presupuesto puede variar.
    </p>
  </div>

  <div className="space-y-4">
    <h2 className="text-2xl font-black text-slate-900">
      Precio de instalación de termocalefón en Paraguay
    </h2>

    <p className="text-slate-600 leading-relaxed">
      La calculadora considera Gs. 250.000 como
      referencia de mano de obra para instalar un
      termocalefón con conexiones de agua fría y caliente.
    </p>

    <p className="text-slate-600 leading-relaxed">
      El precio definitivo depende de las conexiones
      disponibles, el soporte, las condiciones de
      instalación y los trabajos adicionales requeridos.
      La instalación eléctrica debe cumplir las
      condiciones de seguridad correspondientes.
    </p>
  </div>

  <div className="space-y-4">
    <h2 className="text-2xl font-black text-slate-900">
      ¿Cuánto cuesta reparar una pérdida de agua?
    </h2>

    <p className="text-slate-600 leading-relaxed">
      Para reparar una fuga de agua oculta en pared
      o piso, la calculadora utiliza una referencia
      de Gs. 450.000 de mano de obra.
    </p>

    <p className="text-slate-600 leading-relaxed">
      Las fugas ocultas pueden requerir localizar
      la pérdida, abrir una superficie y reemplazar
      parte de la cañería. El importe estimado no
      incluye materiales ni necesariamente todas
      las terminaciones posteriores de albañilería.
    </p>
  </div>

  <div className="space-y-4">
    <h2 className="text-2xl font-black text-slate-900">
      ¿Cuánto cuesta un plomero de urgencia?
    </h2>

    <p className="text-slate-600 leading-relaxed">
      Los servicios urgentes o realizados en domingo
      pueden tener un costo adicional. La calculadora
      de CuantoEs utiliza un recargo orientativo del 30%
      sobre la mano de obra base.
    </p>

    <p className="text-slate-600 leading-relaxed">
      Por ejemplo, un destranque con mano de obra base
      de Gs. 160.000 tendría una estimación de
      Gs. 208.000 con el recargo por urgencia.
      Este resultado no incluye materiales.
    </p>
  </div>

  <div className="space-y-4">
    <h2 className="text-2xl font-black text-slate-900">
      ¿Qué factores influyen en el precio de un plomero?
    </h2>

    <ul className="list-disc pl-6 space-y-2 text-slate-600">
      <li>Tipo de instalación o reparación necesaria.</li>
      <li>Cantidad de puntos o artefactos sanitarios.</li>
      <li>Accesibilidad de las cañerías.</li>
      <li>Materiales y repuestos requeridos.</li>
      <li>Estado de las instalaciones existentes.</li>
      <li>Horario y urgencia del servicio.</li>
      <li>Ubicación de la propiedad.</li>
      <li>Necesidad de trabajos de albañilería.</li>
    </ul>
  </div>

  <div className="space-y-4">
    <h2 className="text-2xl font-black text-slate-900">
      Preguntas frecuentes sobre plomería
    </h2>

    <div className="space-y-6">
      <div>
        <h3 className="font-bold text-slate-900">
          ¿El presupuesto incluye los materiales?
        </h3>

        <p className="mt-2 text-slate-600 leading-relaxed">
          No. La calculadora estima únicamente la
          mano de obra. Los materiales, repuestos
          y trabajos adicionales se presupuestan
          por separado.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-slate-900">
          ¿El precio incluye la visita del plomero?
        </h3>

        <p className="mt-2 text-slate-600 leading-relaxed">
          Depende del profesional. Algunos incluyen
          el desplazamiento en su presupuesto y otros
          cobran una visita de diagnóstico. Conviene
          confirmar este punto antes de contratar.
        </p>
      </div>

      <div>
        <h3 className="font-bold text-slate-900">
          ¿Puedo calcular varios trabajos?
        </h3>

        <p className="mt-2 text-slate-600 leading-relaxed">
          Sí. La calculadora permite indicar la
          cantidad de puntos o artefactos para el
          tipo de servicio seleccionado. Para
          trabajos diferentes, es conveniente
          calcular cada tipo por separado.
        </p>
      </div>
    </div>
  </div>

  
<div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-4">
  <h3 className="text-lg font-bold text-blue-950">
    Otros trabajos relacionados
  </h3>

  <p className="text-sm text-slate-600 leading-relaxed">
    Algunas reparaciones de plomería requieren trabajos
    adicionales que conviene presupuestar por separado.
  </p>

  <div className="space-y-3">
    <Link
      href="/costos/albanileria"
      className="block text-sm font-bold text-blue-700 hover:underline"
    >
      Consultar precios de albañilería y revoques →
    </Link>

    <Link
      href="/costos/electricidad"
      className="block text-sm font-bold text-blue-700 hover:underline"
    >
      Consultar precios de instalaciones eléctricas →
    </Link>
  </div>
</div>


</section>


      {/* 3. CROWDSOURCING: ¿CUÁNTO TE COBRÓ EL PLOMERO? */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <div className="bg-blue-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-blue-100">
          <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Tuviste un arreglo de plomería hace poco?</h3>
            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">
              Ayudá a transparentar los precios en Paraguay. Reportá cuánto pagaste de forma 100% anónima.
            </p>
          </div>
          <button 
            onClick={() => setShowReportModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest shrink-0"
          >
            Aportar mi precio
          </button>
        </div>
      </section>

      {/* 4. METODOLOGÍA */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="border-t border-slate-100 pt-8 space-y-3">
          <div className="flex items-center gap-2 text-slate-400">
            <Info className="w-4 h-4" />
            <h4 className="text-[10px] font-black uppercase tracking-widest">Metodología de este cálculo</h4>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed font-medium">
            Los valores mostrados corresponden a tarifas promedio observadas entre plomeros independientes y sanitarios de Asunción, Luque, San Lorenzo, Fernando de la Mora y Lambaré. Los precios reflejan mano de obra estándar de plomería domiciliaria y no incluyen repuestos de grifería, caños de termofusión o PVC, ni trabajos de albañilería pesada para tapar zanjas grandes.
          </p>
        </div>
      </section>

      {/* MODAL 1: LEAD (PLOMERO VERIFICADO) */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {leadSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Solicitud Recibida!</p>
                <p className="text-xs text-slate-400 font-medium">Conectaremos tu problema con plomeros disponibles en tu zona.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight text-center">Pedir Plomero</h3>
                <div className="space-y-2">
                  <input name="nombre" required placeholder="Tu Nombre" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="telefono" required type="tel" placeholder="WhatsApp (ej: 0981...)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad o Barrio (ej: San Lorenzo)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                </div>
                <button disabled={formLoading} className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">
                  {formLoading ? "Enviando..." : "Pedir Presupuestos"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: CROWDSOURCING */}
      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
          <div className="bg-white rounded-[3rem] p-8 w-full max-w-sm relative z-10 shadow-2xl">
            <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
            {reportSent ? (
              <div className="text-center py-8 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-blue-600 mx-auto" />
                <p className="font-black text-slate-800 uppercase text-lg">¡Aporte Guardado!</p>
                <p className="text-xs text-slate-400 font-medium">Gracias por sumar transparencia al mercado de servicios.</p>
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-4">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">¿Cuánto te cobró el plomero?</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Reporte Anónimo</p>
                </div>
                <div className="space-y-2">
                  <input name="monto" required placeholder="Monto total pagado (Gs)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <input name="ciudad" required placeholder="Ciudad (ej: Luque, Asunción)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border focus:border-blue-500" />
                  <select name="incluyoMateriales" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border text-slate-500">
                    <option value="no">Solo mano de obra</option>
                    <option value="si">Incluyó repuestos/materiales</option>
                  </select>
                  <textarea name="comentario" placeholder="Detalles (ej: cambió el sifón de la cocina y destrabó el baño)" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
                </div>
                <button className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest active:scale-95 transition-all">
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