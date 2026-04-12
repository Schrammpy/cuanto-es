'use client';
import React, { useState } from 'react';
import { Menu, X, HandCoins, ShieldAlert, TrendingUp, Calculator } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: 'Dividir Gastos', icon: <HandCoins className="w-5 h-5" />, href: '/' },
    { name: 'Multas de Tránsito', icon: <ShieldAlert className="w-5 h-5" />, href: '/multas' },
    { name: 'Dólar y Cambios', icon: <TrendingUp className="w-5 h-5 text-slate-300" />, href: '#', disabled: true },
  ];

  return (
    <>
      <nav className="flex items-center justify-between px-4 py-4 max-w-md mx-auto w-full">
        <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-xl rotate-3 shadow-lg shadow-blue-100">
                <span className="text-white font-black text-xs">Gs.</span>
            </div>
            <span className="font-[800] text-slate-800 tracking-tighter">CuantoEs.py</span>
        </Link>
        <button onClick={() => setIsOpen(true)} className="p-2 bg-white rounded-xl shadow-sm border border-slate-100">
          <Menu className="w-6 h-6 text-slate-600" />
        </button>
      </nav>

      {/* Overlay del Menú */}
      <div className={`fixed inset-0 z-[200] transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div 
            className={`absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
            onClick={() => setIsOpen(false)}
        ></div>
        <div className={`absolute right-0 top-0 h-full w-72 bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="font-black text-blue-600 uppercase tracking-widest text-xs">Menú</span>
              <button onClick={() => setIsOpen(false)}><X className="w-6 h-6 text-slate-400" /></button>
            </div>
            <div className="space-y-2">
              {menuItems.map((item, i) => (
                <Link 
                  key={i} 
                  href={item.href}
                  onClick={() => !item.disabled && setIsOpen(false)}
                  className={`flex items-center gap-4 p-4 rounded-2xl font-bold text-sm transition-all ${item.disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-blue-50 text-slate-700 hover:text-blue-600'}`}
                >
                  {item.icon} {item.name}
                  {item.disabled && <span className="text-[8px] bg-slate-100 px-1.5 py-0.5 rounded ml-auto text-slate-400">PRONTO</span>}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}