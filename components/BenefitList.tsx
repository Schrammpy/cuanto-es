'use client';
import React, { useEffect, useState } from 'react';
import { BENEFITS, Benefit } from '@/data/data';
import { Zap, ChevronRight, CreditCard, ShoppingBag, Fuel, Utensils, Pill, Coffee } from 'lucide-react';

export default function BenefitList() {
  const [groupedBenefits, setGroupedBenefits] = useState<Record<string, Benefit[]>>({});
  const [dayName, setDayName] = useState('');
  const [fullDate, setFullDate] = useState('');

  useEffect(() => {
    const days = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    
    const now = new Date();
    const dayIndex = now.getDay();
    const dayNumber = now.getDate();
    const monthName = months[now.getMonth()];

    setDayName(days[dayIndex]);
    setFullDate(`${dayNumber} ${monthName}`);

    const today = BENEFITS.filter(b => b.day === dayIndex);

    const grouped = today.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, Benefit[]>);

    setGroupedBenefits(grouped);
  }, []);

  const categoryInfo = {
    SUPER: { label: 'Supermercados', icon: <ShoppingBag className="w-3 h-3" /> },
    FUEL: { label: 'Combustibles', icon: <Fuel className="w-3 h-3" /> },
    FOOD: { label: 'Cenas y Restó', icon: <Utensils className="w-3 h-3" /> },
    PHARMA: { label: 'Farmacias', icon: <Pill className="w-3 h-3" /> },
  };

  return (
    <div className="mt-10 space-y-6 px-2 pb-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-[800] text-slate-800 uppercase tracking-tighter flex items-center gap-2">
            ¿CON QUÉ PAGO HOY? <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </h2>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ahorros del día</p>
        </div>

        <div className="bg-red-500 text-white flex flex-col items-center justify-center px-4 py-1.5 rounded-2xl italic shadow-lg shadow-red-100 border-b-2 border-red-700 active:scale-95 transition-all">
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            {dayName}
          </span>
          <span className="text-[8px] font-bold opacity-80 mt-0.5 not-italic tracking-tighter">
            {fullDate}
          </span>
        </div>
      </div>

      {Object.keys(groupedBenefits).length > 0 ? (
        Object.entries(groupedBenefits).map(([category, items]) => (
          <div key={category} className="space-y-3 animate-in fade-in duration-500">
            <div className="flex items-center gap-2 px-2">
                <div className="bg-slate-200 p-1.5 rounded-lg text-slate-600">
                    {categoryInfo[category as keyof typeof categoryInfo]?.icon}
                </div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    {categoryInfo[category as keyof typeof categoryInfo]?.label}
                </span>
            </div>

            <div className="space-y-2">
              {items.map((b) => (
                /* CAMBIO: Ahora es una etiqueta <a> clickeable */
                <a 
                  key={b.id} 
                  href={b.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white border border-slate-100 p-4 rounded-[2rem] shadow-sm flex items-center gap-4 active:scale-95 transition-transform hover:border-blue-200 block"
                >
                  <div className={`${b.color} w-12 h-12 rounded-2xl flex flex-col items-center justify-center shrink-0`}>
                    <span className={`font-black ${b.textColor} text-xs leading-none`}>{b.discount}</span>
                    <span className={`${b.textColor} text-[7px] font-black tracking-tighter uppercase mt-0.5`}>{b.type}</span>
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-[800] text-slate-800 leading-tight">{b.brand}</p>
                    <div className="flex flex-col mt-1">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Exclusivo {b.bank}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                            <CreditCard className="w-2.5 h-2.5 text-blue-500" />
                            <p className="text-[9px] font-extrabold text-blue-600 uppercase tracking-tighter italic">
                                {b.paymentMethod}
                            </p>
                        </div>
                    </div>
                  </div>
                  {/* Flechita azul sutil para indicar que es un link */}
                  <ChevronRight className="w-4 h-4 text-blue-300" />
                </a>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-10 rounded-[3rem] text-center border-2 border-dashed border-slate-100 flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-slate-50 p-4 rounded-full">
                <Coffee className="w-6 h-6 text-slate-300" />
            </div>
            <div className="px-4">
                <p className="text-[11px] font-[800] text-slate-500 uppercase tracking-widest leading-tight">
                    Hoy la billetera está de permiso
                </p>
                <p className="text-[9px] text-slate-400 mt-2 uppercase font-bold tracking-tighter italic leading-relaxed">
                    E'a, no hay promos destacadas hoy. <br/> 
                    ¡Igual las cuentas claras hacen amistades largas!
                </p>
            </div>
        </div>
      )}
    </div>
  );
}