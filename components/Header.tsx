import React from 'react';

export default function Header() {
  return (
    <header className="flex flex-col items-center mb-10 pt-6">
      <div className="flex items-center gap-4">
        
        {/* ICONO DE TICKET PROFESIONAL */}
        <div className="relative bg-blue-600 w-14 h-14 rounded-2xl shadow-xl shadow-blue-100 flex items-center justify-center rotate-3 transition-transform hover:rotate-0 duration-300">
          
          {/* SVG del Ticket (Zigzag arriba y abajo) */}
          <svg 
            className="absolute inset-0 w-full h-full p-2.5"
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M4 3V21L6 20L8 21L10 20L12 21L14 20L16 21L18 20L20 21V3L18 4L16 3L14 4L12 3L10 4L8 3L6 4L4 3Z" 
              fill="white" 
              fillOpacity="0.15"
            />
            <path 
              d="M4 3V21L6 20L8 21L10 20L12 21L14 20L16 21L18 20L20 21V3L18 4L16 3L14 4L12 3L10 4L8 3L6 4L4 3Z" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinejoin="round"
            />
          </svg>

          {/* SÍMBOLO GS CENTRADO */}
          <span className="relative z-10 text-[13px] font-[900] text-white leading-none mt-0.5 tracking-tighter">
            Gs.
          </span>
        </div>
        
        {/* TEXTO DEL LOGO */}
        <div className="flex flex-col">
          <div className="flex items-baseline">
            <h1 className="text-3xl font-[500] text-slate-800 tracking-tighter">Cuanto</h1>
            <h1 className="text-3xl font-[900] text-blue-600 tracking-tight ml-0.5">Es</h1>
            <span className="text-sm font-[700] text-slate-400 ml-1 lowercase">.com.py</span>
          </div>
          
          {/* SLOGAN CON MÁS ESTILO */}
          <div className="flex items-center gap-2 mt-0.5">
            <div className="h-[1px] w-4 bg-slate-200"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none">
                Cuentas Claras
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}