'use client';
import React, { useState } from 'react';
import { 
  Bug, Info, TrendingUp, Calculator, ChevronRight, 
  CheckCircle2, Loader2, User, Phone, MapPin, X, Send 
} from 'lucide-react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { enviarLeadFumigacion, guardarPrecioFumigacion } from './action';

export default function FumigacionPage() {
  const [tipo, setTipo] = useState('casa');
  const [m2, setM2] = useState(''); // Estado para los metros
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  
  // Modales
  const [showForm, setShowForm] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportSent, setReportSent] = useState(false);

  const formatGs = (num: number) => new Intl.NumberFormat('es-PY').format(Math.round(num));

  const calcular = () => {
    setLoading(true);
    const metros = parseFloat(m2);
    setTimeout(() => {
        if (!metros) { alert("Ingresá los m2"); setLoading(false); return; }
        
        // Lógica de fumigación
        let base = 180000;
        if (metros > 300) base = 600000;
        else if (metros > 200) base = 420000;
        else if (metros > 100) base = 320000;
        else if (metros > 50) base = 250000;

        setResultado({ total: base, m2: metros, tipo });
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
    const res = await enviarLeadFumigacion(data);
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
      incluyoProductos: formData.get('incluyoProductos'),
      comentario: formData.get('comentario')
    };
    const res = await guardarPrecioFumigacion(data);
    if (res.success) {
      setReportSent(true);
      setTimeout(() => { setShowReportModal(false); setReportSent(false); }, 3000);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] text-slate-800">
      <section className="bg-slate-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <h1 className="text-3xl md:text-5xl font-[900] tracking-tighter uppercase italic">
            ¿Cuánto cuesta la <span className="text-blue-500">fumigación?</span>
          </h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 border border-slate-100 space-y-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-6">
                <div className="bg-orange-50 p-3 rounded-2xl text-orange-600"><Bug className="w-6 h-6" /></div>
                <div>
                    <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">Calculá tu presupuesto</h2>
                </div>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {['casa', 'oficina', 'deposito'].map(item => (
                  <button key={item} onClick={() => setTipo(item)} className={`p-4 rounded-2xl border-2 text-center transition-all ${tipo === item ? 'border-blue-600 bg-blue-50/50 text-blue-900 font-bold' : 'border-slate-100 text-slate-600'}`}>
                    <span className="text-xs font-black uppercase">{item}</span>
                  </button>
                ))}
              </div>
              
              <div className="bg-slate-50 p-6 rounded-3xl border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Superficie (m²)</label>
                <input 
                  type="number" 
                  value={m2} 
                  onChange={(e) => setM2(e.target.value)} 
                  placeholder="Ej: 100" 
                  className="bg-transparent w-full outline-none font-[900] text-3xl text-slate-800" 
                />
              </div>
            </div>

            <button onClick={calcular} className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest active:scale-95 transition-all">Calcular</button>

            {resultado && (
              <div className="pt-8 border-t border-slate-100 space-y-6 animate-in fade-in">
                <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Estimado Total</p>
                <p className="text-4xl font-[900] text-emerald-600 tracking-tighter italic text-center">Gs. {formatGs(resultado.total)}</p>
                <button onClick={() => setShowForm(true)} className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl uppercase text-xs tracking-widest">Solicitar Fumigador</button>
              </div>
            )}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <button onClick={() => setShowReportModal(true)} className="bg-slate-900 text-white font-black px-8 py-4 rounded-full uppercase text-[10px] tracking-widest">Aportar mi precio</button>
      </section>

        {/* 3. CROWDSOURCING: ¿CUÁNTO PAGASTE? */}
      <section className="max-w-4xl mx-auto px-4 py-20">
          <div className="bg-blue-50 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row gap-8 items-center border border-blue-100 shadow-sm">
              <div className="flex-1 space-y-3 text-center md:text-left">
                  <h3 className="text-2xl font-black uppercase text-blue-950 tracking-tight">¿Ya contrataste un Fumigador hace poco?</h3>
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