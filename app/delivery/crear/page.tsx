'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { MapPin, Save, Globe, Store, Smartphone, Loader2, Info } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// 1. Cargamos solo los componentes visuales de forma dinámica
const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });

// 2. Importamos Leaflet para el icono (esto ahora funciona gracias a los @types que instalaste)
import L from 'leaflet';

export default function CrearComercio() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '', slug: '', whatsapp: '', precio_base: '', km_base: '5', precio_extra_km: ''
  });
  const [pos, setPos] = useState<[number, number]>([-25.2867, -57.6470]); 
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Icono corregido para Leaflet
  const customIcon = typeof window !== 'undefined' ? L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
  }) : null;

  // Sub-componente interno para manejar el clic (sin usar dynamic)
  const MapClickHandler = () => {
    // @ts-ignore
    const { useMapEvents } = require('react-leaflet');
    const map = useMapEvents({
      click(e: any) {
        setPos([e.latlng.lat, e.latlng.lng]);
        map.flyTo(e.latlng, map.getZoom());
      },
    });
    return null;
  };

  const handleSave = async () => {
    if (!form.nombre || !form.slug || !form.whatsapp || !form.precio_base) {
      return alert("⚠️ ¡E'a! Completá todos los campos.");
    }
    
    setLoading(true);
    const cleanSlug = form.slug.toLowerCase().trim().replace(/\s+/g, '-');

    const { error } = await supabase.from('comercios').insert([{
      nombre: form.nombre,
      slug: cleanSlug,
      whatsapp: form.whatsapp,
      lat_origen: pos[0],
      lng_origen: pos[1],
      precio_base: parseInt(form.precio_base.replace(/\./g, "")),
      km_base: parseInt(form.km_base),
      precio_extra_km: parseInt(form.precio_extra_km.replace(/\./g, ""))
    }]);

    if (error) {
      alert("❌ Error: Ese 'Link Corto' ya existe o hubo un problema de conexión.");
    } else {
      alert("✅ ¡Éxito! Tu cotizador ya está activo.");
      router.push(`/delivery/${cleanSlug}`);
    }
    setLoading(false);
  };

  if (!mounted) return <div className="h-screen flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs">Cargando CuantoEs...</div>;

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex justify-center items-start pb-20">
      <div className="max-w-md w-full space-y-6">
        
        <header className="text-center space-y-1">
            <h1 className="text-2xl font-black text-slate-800 uppercase italic leading-none">
                Configurá tu <span className="text-blue-600">Delivery</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">SaaS para emprendedores Py</p>
        </header>

        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-5">
            <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Información del Negocio</p>
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
                    <Store className="w-4 h-4 text-slate-400 mr-3" />
                    <input placeholder="Nombre de tu Tienda" className="bg-transparent w-full outline-none font-bold text-sm" onChange={e => setForm({...form, nombre: e.target.value})} />
                </div>
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
                    <Globe className="w-4 h-4 text-slate-400 mr-3" />
                    <input placeholder="Link deseado (ej: lapizza)" className="bg-transparent w-full outline-none font-bold text-sm text-blue-600" onChange={e => setForm({...form, slug: e.target.value})} />
                </div>
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
                    <Smartphone className="w-4 h-4 text-slate-400 mr-3" />
                    <input placeholder="WhatsApp (ej: 595981000000)" className="bg-transparent w-full outline-none font-bold text-sm" onChange={e => setForm({...form, whatsapp: e.target.value})} />
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase px-1 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-red-500" /> Marcá donde está tu local
                </p>
                <div className="h-64 w-full rounded-3xl overflow-hidden border-4 border-[#F1F5F9] relative z-0">
                    <MapContainer center={pos} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={pos} icon={customIcon!} />
                        <MapClickHandler />
                    </MapContainer>
                </div>
                <p className="text-[9px] text-center text-slate-400 italic font-bold">Tocá el mapa para mover el marcador</p>
            </div>

            <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tarifas de Envío</p>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                    <div className="bg-[#F1F5F9] p-3 rounded-2xl flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Precio Base</span>
                        <input placeholder="15.000" className="bg-transparent w-full outline-none font-bold text-sm" onChange={e => setForm({...form, precio_base: e.target.value})} />
                    </div>
                    <div className="bg-[#F1F5F9] p-3 rounded-2xl flex flex-col">
                        <span className="text-[8px] font-black text-slate-400 uppercase">Km Extra</span>
                        <input placeholder="3.000" className="bg-transparent w-full outline-none font-bold text-sm" onChange={e => setForm({...form, precio_extra_km: e.target.value})} />
                    </div>
                </div>
            </div>

            <button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-black py-4 rounded-2xl shadow-xl active:scale-95 transition-all flex justify-center items-center gap-2"
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {loading ? "CREANDO LINK..." : "ACTIVAR MI COTIZADOR"}
            </button>
        </div>
      </div>
    </main>
  );
}