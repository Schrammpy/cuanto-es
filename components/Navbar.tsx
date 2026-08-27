'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Calculator, Wrench, ShieldAlert, Truck, ChevronDown,Search, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (pathname.startsWith('/muro')) return null;

  const services = [
    { name: 'Pintura de Casas', href: '/servicios/pintura' },
    { name: 'Instalación de Aire', href: '/servicios/aire' },
    { name: 'Fletes y Mudanzas', href: '/servicios/fletes' },
  ];

  const tools = [
    { name: 'Dividir Gastos', icon: <Calculator className="w-4 h-4" />, href: '/divisor' },
    { name: 'Presupuestos Pro', icon: <Wrench className="w-4 h-4" />, href: '/presupuesto' },
    { name: 'Delivery Business', icon: <Truck className="w-4 h-4" />, href: '/delivery/crear' },
  ];

  return (
    <nav className="sticky top-0 z-[150] bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="bg-blue-600 p-2 rounded-xl rotate-3 shadow-lg shadow-blue-100">
            <span className="text-white font-black text-[10px]">Gs.</span>
          </div>
          <div className="flex items-baseline">
            <span className="font-[400] text-slate-800 tracking-tighter text-xl">Cuanto</span>
            <span className="font-[900] text-blue-600 tracking-tighter text-xl">Es</span>
            <span className="hidden md:block text-[10px] font-bold text-slate-300 ml-1 uppercase tracking-widest">Paraguay</span>
          </div>
        </Link>

        {/* MENÚ DESKTOP (PC) */}
        <div className="hidden md:flex items-center gap-8">
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              Servicios <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full -left-4 pt-2 hidden group-hover:block w-48">
              <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-2">
                {services.map(s => (
                  <Link key={s.href} href={s.href} className="block p-3 text-xs font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              Herramientas <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full -left-4 pt-2 hidden group-hover:block w-56">
              <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-2">
                {tools.map(t => (
                  <Link key={t.href} href={t.href} className="flex items-center gap-3 p-3 text-xs font-bold text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                    {t.icon} {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/multas" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">Multas Py</Link>
        </div>

        {/* BOTÓN MÓVIL */}
        <button onClick={() => setIsOpen(true)} className="md:hidden p-2 bg-slate-50 rounded-xl text-slate-600">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* MENÚ LATERAL MOBILE */}
      <div className={`fixed inset-0 z-[200] md:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)}></div>
        <div className={`absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <span className="font-black text-blue-600 text-xs uppercase tracking-widest">Menu</span>
              <button onClick={() => setIsOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2">Costos de Servicios</p>
              {services.map(s => (
                <Link key={s.href} href={s.href} onClick={() => setIsOpen(false)} className="block p-3 bg-slate-50 rounded-2xl font-bold text-sm text-slate-700">{s.name}</Link>
              ))}
              
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest px-2 pt-4">Utilidades</p>
              {tools.map(t => (
                <Link key={t.href} href={t.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-sm font-bold text-slate-700">{t.icon} {t.name}</Link>
              ))}
              <Link href="/multas" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 text-sm font-bold text-slate-700"><ShieldAlert className="w-4 h-4" /> Multas de Tránsito</Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}