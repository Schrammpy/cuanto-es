'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation'; // <--- AGREGAMOS ESTO
import { Menu, X, Sparkles, Calculator, Wrench, ShieldAlert, Truck } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname(); // Obtenemos la página actual

  // LÓGICA: Si la página empieza con /muro, no mostramos nada
  if (pathname.startsWith('/muro')) {
    return null;
  }

  const menuItems = [
    { name: 'Inicio', icon: <Sparkles className="w-5 h-5" />, href: '/' },
    { name: 'Dividir Gastos', icon: <Calculator className="w-5 h-5" />, href: '/divisor' },
    { name: 'Presupuestos', icon: <Wrench className="w-5 h-5" />, href: '/presupuesto' },
    { name: 'Cotizador Delivery', icon: <Truck className="w-5 h-5" />, href: '/delivery/crear' },
    { name: 'Multas de Tránsito', icon: <ShieldAlert className="w-5 h-5" />, href: '/multas' },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-4 max-w-md mx-auto w-full sticky top-0 bg-[#F8FAFC]/80 backdrop-blur-md z-[150]">
        <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl rotate-3 shadow-lg shadow-blue-100">
                <span className="text-white font-black text-[10px]">Gs.</span>
            </div>
            <div className="flex items-baseline">
                <span className="font-[400] text-slate-800 tracking-tighter text-lg">Cuanto</span>
                <span className="font-[900] text-blue-600 tracking-tighter text-lg">Es</span>
            </div>
        </Link>
        <button onClick={() => setIsOpen(true)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100 active:scale-90 transition-all">
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
      </nav>

      {/* Menú Lateral */}
      <div className={`fixed inset-0 z-[200] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div 
            className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsOpen(false)}
        ></div>
        <div className={`absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-black text-blue-600 uppercase tracking-widest text-[10px]">Menú Principal</span>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
            <div className="space-y-2">
              {menuItems.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 rounded-2xl font-bold text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-95"
                >
                  <div className="text-blue-600 opacity-70">{item.icon}</div>
                  {item.name}
                </Link>
              ))}
            </div>
            <div className="mt-10 pt-6 border-t border-slate-100 text-center text-slate-300">
                <p className="text-[9px] font-bold uppercase tracking-[0.2em]">Cuentas Claras 🇵🇾</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}