'use client';
import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import { UserPlus, Target, TrendingUp, ShieldCheck, CheckCircle2, ArrowRight, Wrench } from 'lucide-react';

export default function ProfesionalesPage() {
  const formLink = "https://docs.google.com/forms/d/e/1FAIpQLSddkD8aKJxoljsdkTLJDwOM57AqGUzi2ppVQAtXSvi6DM1kAA/viewform";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      
      {/* HERO B2B */}
      <section className="bg-white py-16 md:py-24 px-4 border-b border-slate-200">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-[900] tracking-tighter leading-none uppercase">
            Conseguí clientes <br/> <span className="text-blue-600 italic">sin regateos.</span>
          </h1>
          <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
            Miles de paraguayos usan CuantoEs para calcular costos antes de contratar. Sé el profesional verificado que recibe sus pedidos.
          </p>
          <div className="pt-4">
            <a 
              href={formLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-5 rounded-full uppercase tracking-widest text-xs active:scale-95 transition-all shadow-xl shadow-blue-200 gap-2 items-center"
            >
              <UserPlus className="w-4 h-4" /> Solicitar Ingreso a la Red
            </a>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="max-w-5xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
            <h2 className="text-2xl font-[900] uppercase tracking-tight">¿Cómo funciona el sistema?</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center space-y-4">
                <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-blue-600">
                    <Target className="w-8 h-8" />
                </div>
                <h3 className="font-black uppercase tracking-tighter text-lg">1. Cliente Informado</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">El usuario usa nuestra calculadora y entiende los costos reales de mano de obra y materiales. No te va a pedir imposibles.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center space-y-4">
                <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                    <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="font-black uppercase tracking-tighter text-lg">2. Solicitud Directa</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">El cliente hace clic en "Pedir Presupuesto" y nosotros te enviamos su Nombre, Zona y Detalle del trabajo a tu WhatsApp.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 text-center space-y-4">
                <div className="bg-orange-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-orange-600">
                    <Wrench className="w-8 h-8" />
                </div>
                <h3 className="font-black uppercase tracking-tighter text-lg">3. Cierre de Trato</h3>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">Vos te contactás con el cliente, pasás tu presupuesto final usando nuestras herramientas gratuitas y cerrás el trabajo.</p>
            </div>
        </div>
      </section>

      {/* BENEFICIOS / FAQ */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h2 className="text-3xl font-[900] uppercase tracking-tighter leading-none italic">
                    Uníte a la red <span className="text-blue-500">CuantoEs Pro</span>
                </h2>
                <ul className="space-y-4">
                    {["Exposición ante miles de usuarios mensuales.", "Filtro de curiosos: solo recibís contactos reales.", "Sello de 'Profesional Verificado' en la plataforma.", "Herramienta de presupuestos en PDF gratis."].map((txt, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                            <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0" /> {txt}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] backdrop-blur-sm">
    <ShieldCheck className="w-8 h-8 text-emerald-400 mb-4" />
    <h3 className="text-lg font-black uppercase tracking-tight mb-2">Requisitos de Ingreso</h3>
    <p className="text-xs text-slate-400 font-medium leading-relaxed mb-6">
        Para mantener la calidad de nuestra red y cuidarte a vos y a los clientes, solo pedimos:
        <br/><br/>
        • <b>Zona de trabajo clara:</b> Para pasarte clientes que realmente puedas atender. <br/>
        • <b>Fotos o redes:</b> Algún lugar donde podamos ver cómo trabajás (Instagram, Facebook o fotos de tus obras). <br/>
        • <b>Puntualidad:</b> Compromiso de responder rápido cuando te pasamos un presupuesto.
            </p>
                <a 
                    href={formLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-white text-slate-900 font-black py-4 rounded-xl text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-colors"
                >
                Completar Formulario <ArrowRight className="w-4 h-4" />
                </a>
            </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}