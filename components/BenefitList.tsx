'use client';
import React, { useEffect, useState } from 'react';
import { BENEFITS, Benefit } from '@/data/data';
// Agregamos "Pill" al import de Lucide:
import { Zap, ChevronRight, CreditCard, ShoppingBag, Fuel, Utensils, Pill } from 'lucide-react';

export default function BenefitList() {
  const [groupedBenefits, setGroupedBenefits] = useState<Record<string, Benefit[]>>({});
  const [dayName, setDayName] = useState('');

  useEffect(() => {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    const now = new Date();
    const dayIndex = now.getDay();
    setDayName(days[dayIndex]);

    const today = BENEFITS.filter(b => b.day === dayIndex);

    const grouped = today.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, Benefit[]>);

    setGroupedBenefits(grouped);
  }, []);

  // Configuramos la nueva categoría aquí:
  const categoryInfo = {
    SUPER: { label: 'Supermercados', icon: <ShoppingBag className="w-3 h-3" /> },
    FUEL: { label: 'Combustibles', icon: <Fuel className="w-3 h-3" /> },
    FOOD: { label: 'Cenas y Restó', icon: <Utensils className="w-3 h-3" /> },
    PHARMA: { label: 'Farmacias', icon: <Pill className="w-3 h-3" /> }, // <-- Agregado
  };

  return (
    <div className="mt-10 space-y-6 px-2 pb-6">
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-[800] text-slate-800 uppercase tracking-tighter flex items-center gap-2">
            ¿CON QUÉ PAGO HOY? <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </h2>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Ahorros del {dayName}</p>
        </div>
        <div className="bg-red-500 text-white text-[10px] font-black px-4 py-1.5 rounded-full italic shadow-lg shadow-red-100 uppercase tracking-widest">
          {dayName}
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
                <div key={b.id} className="bg-white border border-slate-100 p-4 rounded-[2rem] shadow-sm flex items-center gap-4 active:scale-95 transition-transform">
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
                  <ChevronRight className="w-4 h-4 text-slate-200" />
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="bg-white p-10 rounded-[3rem] text-center border-2 border-dashed border-slate-100 flex flex-col items-center gap-3">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-loose">Hoy la billetera descansa. <br/> Mañana vuelven los ahorros.</p>
        </div>
      )}
    </div>
  );
}