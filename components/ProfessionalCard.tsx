'use client';
import React from 'react';
import { Award, Star, MessageCircle, ShieldCheck } from 'lucide-react';

export default function ProfessionalCard({ pro }: { pro: any }) {
  return (
    <div className="bg-white p-6 rounded-[2.5rem] border border-blue-100 shadow-xl shadow-blue-50 my-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg">
           {pro.nombre.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-1 text-emerald-600">
            <ShieldCheck className="w-4 h-4 fill-emerald-100" />
            <span className="text-[10px] font-black uppercase tracking-widest">Profesional Verificado</span>
          </div>
          <h3 className="text-lg font-black text-slate-800">{pro.nombre}</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase">{pro.experiencia}</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed mb-6 italic italic">
        "{pro.bio}"
      </p>

      <a 
        href={`https://api.whatsapp.com/send?phone=${pro.whatsapp}&text=Hola%20${pro.nombre}%2C%20vi%20tu%20perfil%20en%20CuantoEs.com.py%20y%20necesito%20un%20presupuesto.`}
        target="_blank"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all uppercase text-[10px] tracking-widest"
      >
        <MessageCircle className="w-4 h-4" /> Contactar a {pro.nombre.split(' ')[0]} vía WhatsApp
      </a>
    </div>
  );
}