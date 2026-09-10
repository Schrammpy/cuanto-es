'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { 
  Menu, X, Calculator, Wrench, ShieldAlert, Truck, 
  ChevronDown, UserPlus 
} from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Si estamos en un muro o chat anónimo, el Navbar desaparece
  if (pathname.startsWith('/muro')) return null;

  const services = [
    { name: 'Pintura de Casas', href: '/costos/pintura' },
    { name: 'Instalación de Aire', href: '/costos/aire' },
    { name: 'Fletes y Mudanzas', href: '/costos/fletes' },
    { name: 'Asado a Domicilio', href: '/costos/asado' },
    { name: 'Plomería y Destranques', href: '/costos/plomeria' },
    { name: 'Electricidad y Tableros', href: '/costos/electricidad' },
  ];

  const tools = [
    { name: 'Dividir Gastos', icon: <Calculator className="w-4 h-4 text-blue-600" />, href: '/divisor' },
    { name: 'Presupuestos Pro', icon: <Wrench className="w-4 h-4 text-orange-600" />, href: '/presupuesto' },
    { name: 'Delivery Business', icon: <Truck className="w-4 h-4 text-emerald-600" />, href: '/delivery/crear' },
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
          {/* Dropdown Servicios */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors py-2">
              Precios de Servicios <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full -left-4 pt-2 hidden group-hover:block w-52 animate-in fade-in slide-in-from-top-2">
              <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 space-y-1">
                {services.map(s => (
                  <Link key={s.href} href={s.href} className="block p-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                    {s.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Dropdown Herramientas */}
          <div className="relative group">
            <button className="flex items-center gap-1 text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors py-2">
              Herramientas <ChevronDown className="w-4 h-4 text-slate-400 group-hover:rotate-180 transition-transform" />
            </button>
            <div className="absolute top-full -left-4 pt-2 hidden group-hover:block w-60 animate-in fade-in slide-in-from-top-2">
              <div className="bg-white border border-slate-100 shadow-2xl rounded-2xl p-2 space-y-1">
                {tools.map(t => (
                  <Link key={t.href} href={t.href} className="flex items-center gap-3 p-3 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                    {t.icon} {t.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/multas" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
            Multas Py
          </Link>

          {/* BOTÓN B2B: CAPTACIÓN DE PROFESIONALES (NUEVO) */}
          <a 
            href="https://api.whatsapp.com/send?phone=595992685363&text=Hola!%20Soy%20profesional%20y%20quiero%20recibir%20pedidos%20en%20CuantoEs.com.py"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-900 hover:bg-blue-600 text-white text-xs font-black px-5 py-2.5 rounded-full uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-2"
          >
            <UserPlus className="w-3.5 h-3.5 text-blue-400" />
            Soy Profesional
          </a>
        </div>

        {/* BOTÓN MÓVIL */}
        <button onClick={() => setIsOpen(true)} className="md:hidden p-2 bg-slate-50 rounded-xl text-slate-600 active:scale-95 transition-all">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* MENÚ LATERAL MOBILE */}
      <div className={`fixed inset-0 z-[200] md:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setIsOpen(false)}></div>
        <div className={`absolute right-0 top-0 h-full w-80 bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6 space-y-6 h-full flex flex-col justify-between overflow-y-auto">
            
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <span className="font-black text-blue-600 text-xs uppercase tracking-widest">Navegación</span>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg"><X className="w-6 h-6 text-slate-400" /></button>
              </div>
              
              <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Precios de Servicios</p>
                {services.map(s => (
                  <Link key={s.href} href={s.href} onClick={() => setIsOpen(false)} className="block p-3 bg-slate-50 hover:bg-blue-50 rounded-2xl font-bold text-sm text-slate-700 transition-colors">
                    {s.name}
                  </Link>
                ))}
                
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2 pt-4">Herramientas Gratuitas</p>
                {tools.map(t => (
                  <Link key={t.href} href={t.href} onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 transition-colors">
                    {t.icon} {t.name}
                  </Link>
                ))}
                
                <Link href="/multas" onClick={() => setIsOpen(false)} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 transition-colors">
                  <ShieldAlert className="w-4 h-4 text-red-600" /> Multas de Tránsito
                </Link>
              </div>
            </div>

            {/* SECCIÓN PROFESIONALES MOBILE */}
            <div className="pt-6 border-t border-slate-100 space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">¿Ofrecés servicios?</p>
              <a 
                href="https://api.whatsapp.com/send?phone=595992685363&text=Hola!%20Soy%20profesional%20y%20quiero%20recibir%20pedidos%20en%20CuantoEs.com.py"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20 active:scale-95 transition-all"
              >
                <UserPlus className="w-4 h-4 text-blue-400" />
                Registrarme como Pro
              </a>
            </div>

          </div>
        </div>
      </div>
    </nav>
  );
}