'use client';
import React, { useState } from 'react';
import { 
  Zap, Info, TrendingUp, Calculator, ChevronRight, 
  CheckCircle2, Loader2, User, Phone, MapPin, X, Send, 
  ShieldCheck, MessageCircle, Star, Award
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadElectricidad, guardarPrecioElectricidad } from './action';

// --- COMPONENTE PROFESIONAL ---
const ProfessionalCard = ({ pro }: { pro: any }) => (
  <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl border border-blue-50 my-10 animate-in fade-in slide-in-from-bottom-4">
    <div className="flex items-center gap-5 mb-6">
      <div className="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-blue-200">
         {pro.nombre.charAt(0)}
      </div>
      <div>
        <div className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full w-fit mb-2">
          <Award className="w-4 h-4" />
          <span className="text-[9px] font-black uppercase tracking-widest">Profesional Destacado</span>
        </div>
        <h3 className="text-lg font-black text-slate-800">{pro.nombre}</h3>
        <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-400" />)}
        </div>
      </div>
    </div>
    <p className="text-sm text-slate-600 leading-relaxed italic mb-6">"{pro.bio}"</p>
    <div className="space-y-2 mb-6">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validado por:</p>
        <p className="text-xs font-bold text-slate-700">✓ +35 instalaciones realizadas <br/> ✓ Certificación FAEP vigente</p>
    </div>
    <a 
      href={`https://api.whatsapp.com/send?phone=${pro.whatsapp}&text=Hola%20${pro.nombre}%2C%20vi%20tu%20perfil%20destacado%20en%20CuantoEs.com.py%20y%20necesito%20un%20presupuesto.`} 
      target="_blank" 
      rel="noopener noreferrer"
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all uppercase text-xs tracking-widest"
    >
      <MessageCircle className="w-4 h-4" /> CONTACTAR A {pro.nombre.split(' ')[0].toUpperCase()}
    </a>
  </div>
);

export default function ElectricidadCostosPage() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Intl.DateTimeFormat('es-PY', { month: 'long' }).format(new Date());

  const [servicio, setServicio] = useState('por_boca');
  const [bocas, setBocas] = useState(4);
  const [urgencia, setUrgencia] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const formatGs = (num: number) => new Intl.NumberFormat('es-PY').format(Math.round(num));

  const calcular = () => {
    setLoading(true);
    setTimeout(() => {
        let precioBase = 0;
        if (servicio === 'por_boca') precioBase = 87000 * bocas;
        else if (servicio === 'tablero') precioBase = 450000 + (bocas > 1 ? (bocas - 1) * 120000 : 0);
        else if (servicio === 'corto') precioBase = 350000;
        else if (servicio === 'ventilador') precioBase = 150000 * bocas;
        
        let total = urgencia === 'urgente' ? Math.round(precioBase * 1.3) : precioBase;
        setResultado({ total });
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
    const res = await enviarLeadElectricidad(data);
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
    const res = await guardarPrecioElectricidad(data);
    if (res.success) {
      setReportSent(true);
      setTimeout(() => { setShowReportModal(false); setReportSent(false); }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <section className="bg-slate-900 text-white py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <TrendingUp className="w-4 h-4" /> Precios de Referencia FAEP • {currentMonth} {currentYear}
          </div>
          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none">
            ¿Cuánto cobra un <span className="text-blue-500 italic">electricista en Paraguay?</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base font-medium max-w-2xl leading-relaxed">
            Tarifas referenciales basadas en normas técnicas y mano de obra profesional en Paraguay.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Costo x Boca (FAEP)</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">Gs. 87.000 <span className="text-xs font-normal opacity-50">ref.</span></p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl text-emerald-400 backdrop-blur-sm">
              <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest mb-1">Cambio de Tablero</p>
              <p className="text-2xl lg:text-3xl font-black whitespace-nowrap">450 a 600 mil</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Detección de Fuga</p>
              <p className="text-2xl lg:text-3xl font-black text-blue-400 whitespace-nowrap">350 mil <span className="text-xs font-normal text-slate-400">base</span></p>
            </div>
          </div>
          {/* VISITA TÉCNICA - REFERENCIA INFORMATIVA */}
<div className="mt-4 bg-amber-400/10 border border-amber-400/20 rounded-2xl p-4 md:p-5 flex items-start gap-4">

  <div className="bg-amber-400/10 p-2.5 rounded-xl shrink-0">
    <Info className="w-5 h-5 text-amber-300" />
  </div>

  <div className="space-y-1">
    <p className="text-[10px] font-black text-amber-300 uppercase tracking-widest">
      Visita Técnica
    </p>

    <p className="text-xl md:text-2xl font-black text-white">
      Gs. 100.000 a 150.000
      <span className="text-[10px] md:text-xs font-normal text-slate-400 ml-2">
        referencia
      </span>
    </p>

    <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
      Costo referencial por visita e inspección técnica del electricista.
    </p>
  </div>

</div>

          
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 border border-slate-100 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                <div className="bg-amber-50 p-3 rounded-2xl text-amber-600"><Zap className="w-6 h-6" /></div>
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu trabajo</h2>
                    <p className="text-xs text-slate-400 font-medium">Elegí la tarea y la cantidad de puntos</p>
                </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'por_boca', label: 'Instalación bocas', desc: 'Tomas, llaves o focos' },
                  { id: 'tablero', label: 'Tablero Eléctrico', desc: 'Disyuntor y llaves' },
                  { id: 'corto', label: 'Cortocircuito', desc: 'Diagnóstico y reparación' },
                  { id: 'ventilador', label: 'Ventiladores', desc: 'Montaje y cableado' }
                ].map(item => (
                  <button key={item.id} onClick={() => setServicio(item.id)} className={`p-4 rounded-2xl border-2 text-left transition-all ${servicio === item.id ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-100 text-slate-600'}`}>
                    <span className="text-xs font-black uppercase block mb-1">{item.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight block">{item.desc}</span>
                  </button>
                ))}
              </div>
              <div className="bg-slate-50 p-6 rounded-3xl flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cantidad</p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setBocas(Math.max(1, bocas - 1))} className="w-10 h-10 rounded-full bg-white shadow-sm font-bold text-slate-600">-</button>
                  <span className="font-black text-2xl text-slate-800">{bocas}</span>
                  <button onClick={() => setBocas(bocas + 1)} className="w-10 h-10 rounded-full bg-white shadow-sm font-bold text-slate-600">+</button>
                </div>
              </div>
            </div>

            <button onClick={calcular} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest">Calcular</button>

            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in duration-500">
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimado Mano de Obra</p>
                <p className="text-5xl font-[900] text-emerald-600 tracking-tighter italic text-center">Gs. {formatGs(resultado.total)}</p>
                
                <ProfessionalCard pro={{
                    nombre: "Tomas Ojeda",
                    experiencia: "3 años de exp. • +35 instalaciones realizadas",
                    bio: "Especialista en tableros y reparaciones. Garantizo trabajos limpios, seguros y bajo norma INTN. Cubro Gran Asunción.",
                    whatsapp: "595972258888"
                }} />

                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest text-xs">Solicitar Electricista</button>
              </div>
            )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-16">
  <div className="space-y-8">
    <div className="space-y-3">
      <h2 className="text-3xl font-black text-slate-900">
        Precio de mano de obra eléctrica en Paraguay
      </h2>

      <p className="text-slate-600 leading-relaxed">
        El costo de un trabajo eléctrico depende del tipo de
        instalación, la cantidad de puntos, el estado del cableado,
        la ubicación y la complejidad de la tarea. Los valores
        publicados son orientativos y deben confirmarse mediante
        un presupuesto profesional.
      </p>
    </div>

    <div className="space-y-3">
      <h2 className="text-2xl font-black text-slate-900">
        ¿Cuánto cuesta una boca de electricidad?
      </h2>

      <p className="text-slate-600 leading-relaxed">
        Una boca eléctrica puede corresponder a un tomacorriente,
        interruptor o punto de iluminación. La calculadora utiliza
        como referencia Gs. 87.000 por boca para estimar la
        mano de obra. Este importe no constituye una tarifa
        oficial y puede variar según el trabajo.
      </p>
    </div>

    <div className="space-y-3">
      <h2 className="text-2xl font-black text-slate-900">
        ¿Qué factores modifican el presupuesto?
      </h2>

      <ul className="list-disc pl-6 space-y-2 text-slate-600">
        <li>Cantidad de bocas o puntos eléctricos.</li>
        <li>Instalación nueva o reparación existente.</li>
        <li>Necesidad de canalizaciones o cableado adicional.</li>
        <li>Materiales incluidos o suministrados por el cliente.</li>
        <li>Ubicación, desplazamiento y urgencia del servicio.</li>
      </ul>
    </div>
  </div>
</section>
      
      {/* 3. CROWDSOURCING: ¿CUÁNTO PAGASTE? */}
<section className="max-w-4xl mx-auto px-4 py-20">
    <div className="bg-blue-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-blue-100 shadow-sm">
        <div className="flex-1 space-y-3 text-center md:text-left">
            <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Ya contrataste un electricista hace poco?</h3>
            <p className="text-xs text-blue-900/70 font-medium leading-relaxed">
                Ayudá a que los precios en Paraguay sean justos y transparentes. Reportá tu costo de forma 100% anónima para actualizar el índice.
            </p>
        </div>
        <button 
            onClick={() => setShowReportModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-4 rounded-2xl shadow-lg active:scale-95 transition-all text-xs uppercase tracking-widest shrink-0"
        >
            APORTAR MI PRECIO
        </button>
    </div>
</section>

      {/* MODAL 1 */}
      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowForm(false)}></div>
            <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm relative z-10 shadow-2xl">
                <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
                {leadSent ? <p className="text-center font-bold text-emerald-600">¡Solicitud enviada!</p> : (
                    <form onSubmit={handleLeadSubmit} className="space-y-3">
                        <input name="nombre" required placeholder="Tu Nombre" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border" />
                        <input name="telefono" required type="tel" placeholder="WhatsApp" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border" />
                        <input name="ciudad" required placeholder="Ciudad" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border" />
                        <button className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs">Enviar Solicitud</button>
                    </form>
                )}
            </div>
        </div>
      )}

      {/* MODAL 2 */}
      {showReportModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowReportModal(false)}></div>
            <div className="bg-white p-8 rounded-[2rem] w-full max-w-sm relative z-10 shadow-2xl">
                <button onClick={() => setShowReportModal(false)} className="absolute top-6 right-6 text-slate-300"><X /></button>
                {reportSent ? <p className="text-center font-bold text-blue-600">¡Aporte guardado!</p> : (
                    <form onSubmit={handleReportSubmit} className="space-y-3">
                        <input name="monto" required placeholder="Monto pagado" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border" />
                        <input name="ciudad" required placeholder="Ciudad" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold outline-none border" />
                        <select name="incluyoMateriales" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-bold border text-slate-500"><option value="no">Solo mano de obra</option><option value="si">Incluyó materiales</option></select>
                        <textarea name="comentario" placeholder="Detalles" className="w-full bg-slate-50 p-3.5 rounded-2xl text-xs font-medium outline-none border resize-none h-20" />
                        <button className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-xs">Guardar</button>
                    </form>
                )}
            </div>
        </div>
      )}
      <Footer />
    </main>
  );
}