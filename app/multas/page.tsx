'use client';
import React, { useState } from 'react';
import Footer from '@/components/Footer';
import { Search, AlertCircle, Info, Scale } from 'lucide-react';

// ==========================================
// CONFIGURACIÓN CENTRALIZADA
// ==========================================
const JORNAL_MINIMO = 111501; 
const FECHA_ACTUALIZACION = "Año 2026";

const multasData = [
  // --- NUEVO: ESTACIONAMIENTO ASUNCIÓN ---
  { infraction: "Estacionar en lugares prohibidos (Multa básica)", jornales: 4, entity: "Municipalidad de Asunción" },
  { infraction: "Estacionar en lugares prohibidos con remoción de Grúa", jornales: 7, entity: "Municipalidad de Asunción" },
  { infraction: "Obstruir rampas para personas con discapacidad o veredas", jornales: 10, entity: "Municipalidad de Asunción" },

  // --- DOCUMENTACIÓN ---
  { infraction: "Registro de conducir vencido", jornales: 10, entity: "Municipal" },
  { infraction: "Carecer de habilitación vehicular (o vencida)", jornales: 5, entity: "Caminera / Municipal" },
  { infraction: "No portar licencia de conducir física", jornales: 5, entity: "Caminera" },
  
  // --- ALCOTEST ---
  { infraction: "Alcotest Positivo: Grado Leve (0.001 a 0.199 mg/L)", jornales: 3, entity: "Caminera" },
  { infraction: "Alcotest Positivo: Grado Grave (0.200 a 0.250 mg/L)", jornales: 10, entity: "Caminera" },
  { infraction: "Alcotest Positivo: Grado Gravísimo (0.251 en adelante)", jornales: 20, entity: "Fiscalía / Caminera" },

  // --- LUCES Y SEGURIDAD ---
  { infraction: "Pasar luz roja", jornales: 15, entity: "Municipal" },
  { infraction: "Luz quemada (faros delanteros o traseros)", jornales: 5, entity: "Caminera / Municipal" },
  { infraction: "No usar cinturón de seguridad", jornales: 5, entity: "Caminera / Municipal" },
  { infraction: "No usar casco o chaleco reflectivo (Motos)", jornales: 11, entity: "Caminera / Municipal" },
  
  // --- MANIOBRAS ---
  { infraction: "Giro prohibido / Giro en U no permitido", jornales: 5, entity: "Municipal" },
  { infraction: "Circular en contramano", jornales: 20, entity: "Municipal" },
  { infraction: "Uso de celular mientras se conduce", jornales: 7, entity: "Municipal" },
];

export default function MultasPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMultas = multasData.filter(m => 
    m.infraction.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.entity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatGS = (num: number) => new Intl.NumberFormat('es-PY').format(num);

  // --- DATOS PARA GOOGLE (SEO) ---
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [{
      "@type": "Question",
      "name": "¿Cuánto es la multa por alcotest en Paraguay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las multas por alcotest varían según la gravedad: Leve (3 jornales), Grave (10 jornales) y Gravísimo (20 jornales). Con el jornal actual, el costo máximo supera los 2.200.000 Gs."
      }
    }, {
      "@type": "Question",
      "name": "¿Cuánto es la multa por registro vencido en Paraguay?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "La multa por registro de conducir con vencimiento quinquenal es de 10 jornales mínimos."
      }
    }]
  };

  return (
    <>
      {/* Script para que Google nos posicione mejor */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-[#F8FAFC] pb-10">
        <div className="max-w-md mx-auto px-4 mt-6">
          
          <header className="mb-8">
              <div className="flex items-center gap-2 mb-2">
                  <Scale className="w-5 h-5 text-red-600" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Infracciones Py</span>
              </div>
              <h1 className="text-3xl font-[900] text-slate-800 tracking-tighter leading-none">
                  ¿Cuánto es la <span className="text-red-600 italic">multa?</span>
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
                  Periodo: {FECHA_ACTUALIZACION}
              </p>
          </header>

          {/* BUSCADOR */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3 mb-6 focus-within:ring-2 focus-within:ring-red-100 transition-all">
              <div className="bg-slate-100 p-2 rounded-xl text-slate-400">
                  <Search className="w-5 h-5" />
              </div>
              <input 
                  type="text" 
                  placeholder="Buscá: Alcotest, luz, registro..."
                  className="bg-transparent w-full outline-none text-sm font-bold text-slate-700"
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>

          {/* REFERENCIA JORNAL */}
          <div className="bg-white border border-slate-100 p-5 rounded-[2rem] flex flex-col gap-3 mb-8 shadow-sm">
              <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-500" />
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Referencia Legal</span>
              </div>
              <p className="text-xs font-semibold text-slate-600 leading-tight">
                  Calculado sobre el Jornal Mínimo vigente:
              </p>
              <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-800">Gs. {formatGS(JORNAL_MINIMO)}</span>
              </div>
          </div>

          {/* LISTA DINÁMICA */}
          <div className="space-y-4">
              {filteredMultas.length > 0 ? (
                  filteredMultas.map((m, i) => (
                      <div key={i} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-50 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          <div className="flex justify-between items-start mb-4">
                              <span className="text-[9px] font-black bg-slate-100 px-2 py-1 rounded-lg text-slate-500 uppercase tracking-widest">
                                  {m.entity}
                              </span>
                              <div className="text-right">
                                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Monto Gs.</p>
                                  <p className="text-xl font-black text-red-600 leading-none mt-1">
                                      {formatGS(m.jornales * JORNAL_MINIMO)}
                                  </p>
                              </div>
                          </div>
                          <h3 className="text-sm font-bold text-slate-800 leading-snug">
                              {m.infraction}
                          </h3>
                          <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-50 text-[10px] font-bold">
                              <span className="text-slate-400 italic underline decoration-slate-200">
                                  Sanción: {m.jornales} jornales
                              </span>
                              <span className="text-slate-300 uppercase tracking-widest">#CUANTOESPY</span>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="text-center py-10 opacity-30">
                      <Search className="w-10 h-10 mx-auto mb-2" />
                      <p className="text-sm font-bold uppercase tracking-widest">Sin resultados</p>
                  </div>
              )}
          </div>

          {/* TIP FINAL */}
          <div className="mt-10 p-8 bg-slate-900 rounded-[3rem] text-center text-white shadow-2xl relative">
              <div className="bg-red-600 text-white text-[8px] font-black px-3 py-1 rounded-full absolute -top-3 left-1/2 -translate-x-1/2 tracking-[0.2em] uppercase">
                  Dato de oro
              </div>
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-4" />
              <p className="text-xs font-bold leading-relaxed italic opacity-90 px-2">
                  "Si pagás dentro de los primeros 5 días hábiles, muchas municipalidades te hacen un 50% de descuento automático. ¡Aprovechá!"
              </p>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}