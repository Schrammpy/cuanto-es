'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Scale, AlertTriangle, EyeOff } from 'lucide-react';

export default function LegalPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tighter">Términos y <span className="text-blue-600">Condiciones</span></h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Última actualización: Abril 2026</p>
        </header>

        <section className="space-y-6 text-slate-600 text-sm leading-relaxed">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-800">
              <Scale className="w-5 h-5 text-blue-600" />
              <h2 className="font-black uppercase tracking-tight text-lg">1. Naturaleza del Servicio</h2>
            </div>
            <p>
              CuantoEs.com.py proporciona una plataforma técnica de mensajería efímera y anónima. El usuario comprende que los mensajes publicados en los "Muros" y "Chats" son generados por terceros. <strong>CuantoEs.com.py no se identifica ni se hace responsable por las opiniones, datos o informaciones vertidas por los usuarios.</strong>
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-800">
              <EyeOff className="w-5 h-5 text-blue-600" />
              <h2 className="font-black uppercase tracking-tight text-lg">2. Privacidad y Datos</h2>
            </div>
            <p>
              Cumpliendo con la legislación paraguaya, informamos que no recolectamos datos personales (nombres reales, correos o teléfonos) en la sección de Muros. La identidad se basa en un alias aleatorio almacenado localmente en su dispositivo. Los mensajes se eliminan automáticamente del servidor en los plazos establecidos (24hs para chat, 7 días para muros).
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-800">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <h2 className="font-black uppercase tracking-tight text-lg">3. Contenido Prohibido</h2>
            </div>
            <p>
              Está estrictamente prohibido el uso de la plataforma para:
              <ul className="list-disc ml-5 mt-2 space-y-1 text-xs">
                <li>Difundir contenido violento, pornográfico o ilegal.</li>
                <li>Realizar amenazas, acoso (bullying) o discursos de odio.</li>
                <li>Publicar datos privados de terceros (doxing).</li>
              </ul>
              CuantoEs.com.py se reserva el derecho de eliminar cualquier contenido que viole estas normas sin previo aviso.
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 mb-4 text-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="font-black uppercase tracking-tight text-lg">4. Sobre los códigos QR</h2>
            </div>
            <p>
              La ubicación física de los códigos QR de CuantoEs.com.py es meramente referencial. Si usted encuentra un código en una ubicación privada sin autorización, o en un lugar que considere inapropiado, favor reportarlo a <strong>mydocs.studio@gmail.com</strong> para su desactivación digital inmediata.
            </p>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}