'use client';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { MapPin, Save, Globe, Store, Smartphone } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Cargamos el mapa dinámicamente para evitar errores de servidor
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });
const MapEvents = dynamic(() => import('react-leaflet').then(m => m.useMapEvents), { ssr: false });

export default function CrearComercio() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '', slug: '', whatsapp: '', precio_base: '', km_base: '5', precio_extra_km: ''
  });
  const [pos, setPos] = useState<[number, number]>([-25.2867, -57.6470]); // Asunción por defecto
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!form.nombre || !form.slug || !form.whatsapp || !form.precio_base) {
      return alert("Completá todos los campos socio!");
    }
    
    setLoading(true);
    const { error } = await supabase.from('comercios').insert([{
      nombre: form.nombre,
      slug: form.slug.toLowerCase().replace(/\s+/g, '-'),
      whatsapp: form.whatsapp,
      lat_origen: pos[0],
      lng_origen: pos[1],
      precio_base: parseInt(form.precio_base),
      km_base: parseInt(form.km_base),
      precio_extra_km: parseInt(form.precio_extra_km)
    }]);

    if (error) {
      alert("Error: El link corto ya existe o hubo un problema.");
      console.log(error);
    } else {
      alert("¡Éxito! Tu link ya está activo.");
      router.push(`/delivery/${form.slug}`);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex justify-center items-start pb-20">
      <div className="max-w-md w-full space-y-6">
        <header className="text-center">
            <h1 className="text-2xl font-black text-slate-800 uppercase italic">Configurá tu <span className="text-blue-600">Delivery</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Creá tu link para Instagram</p>
        </header>

        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="space-y-3">
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center">
                    <Store className="w-4 h-4 text-slate-400 mr-3" />
                    <input placeholder="Nombre de tu Tienda" className="bg-transparent w-full outline-none font-bold text-sm text-slate-700" onChange={e => setForm({...form, nombre: e.target.value})} />
                </div>
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center">
                    <Globe className="w-4 h-4 text-slate-400 mr-3" />
                    <input placeholder="Tu-link-deseado (ej: lapizza)" className="bg-transparent w-full outline-none font-bold text-sm text-blue-600" onChange={e => setForm({...form, slug: e.target.value})} />
                </div>
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center">
                    <Smartphone className="w-4 h-4 text-slate-400 mr-3" />
                    <input placeholder="WhatsApp (ej: 595981...)" className="bg-transparent w-full outline-none font-bold text-sm text-slate-700" onChange={e => setForm({...form, whatsapp: e.target.value})} />
                </div>
            </div>

            <p className="text-[10px] font-black text-slate-400 uppercase px-2">Marcá tu ubicación en el mapa</p>
            <div className="h-64 w-full rounded-3xl overflow-hidden border-4 border-[#F1F5F9] z-0">
               {/* Aquí cargamos un mapa simple donde el usuario hace clic para marcar su tienda */}
               <p className="text-[10px] p-4 text-center text-slate-400 italic">Haz clic en el mapa para ubicar tu local</p>
               {/* (Nota: Para brevedad, el mapa aquí requiere un MapEvents interno que te pasaré si te funciona el layout) */}
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Precio Base</span>
                    <input placeholder="15.000" className="bg-transparent w-full outline-none font-bold text-sm text-slate-700" onChange={e => setForm({...form, precio_base: e.target.value})} />
                </div>
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex flex-col">
                    <span className="text-[8px] font-black text-slate-400 uppercase">Precio Km Extra</span>
                    <input placeholder="3.000" className="bg-transparent w-full outline-none font-bold text-sm text-slate-700" onChange={e => setForm({...form, precio_extra_km: e.target.value})} />
                </div>
            </div>

            <button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex justify-center items-center gap-2"
            >
                <Save className="w-4 h-4" /> {loading ? "GUARDANDO..." : "ACTIVAR MI LINK"}
            </button>
        </div>
      </div>
    </main>
  );
}