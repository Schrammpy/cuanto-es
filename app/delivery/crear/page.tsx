'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { 
  MapPin, Save, Globe, Store, Smartphone, Loader2, 
  Sparkles, UserCheck, Receipt, Share2, ShieldCheck 
} from 'lucide-react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import Footer from '@/components/Footer';

const MapContainer = dynamic(() => import('react-leaflet').then(m => m.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(m => m.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(m => m.Marker), { ssr: false });

export default function CrearComercio() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [L, setL] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nombre: '',
    slug: '',
    whatsapp: '',
    precio_base: '',
    km_base: '10',
    precio_extra_km: ''
  });
  const [pos, setPos] = useState<[number, number]>([-25.2867, -57.6470]); 

  useEffect(() => {
    setMounted(true);
    import('leaflet').then((leaflet) => setL(leaflet));
  }, []);

  // --- FUNCIÓN PARA FORMATEAR MILES AUTOMÁTICAMENTE ---
  const formatMiles = (val: string) => {
    const num = val.replace(/\D/g, ""); // Solo números
    return num ? new Intl.NumberFormat('es-PY').format(parseInt(num)) : "";
  };

  const slugify = (text: string) => {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const handleNombreChange = (val: string) => {
    setForm({ ...form, nombre: val, slug: slugify(val) });
  };

  const handleSave = async () => {
  if (!form.nombre || !form.whatsapp || !form.precio_base || !form.precio_extra_km) {
    return alert("⚠️ ¡E'a! Completá todos los datos para crear tu link.");
  }
  
  setLoading(true);
  
  const cleanWA = form.whatsapp.replace(/\D/g, "");
  const finalWA = cleanWA.startsWith('0') ? '595' + cleanWA.substring(1) : cleanWA;

  const { error } = await supabase.from('comercios').insert([{
    nombre: form.nombre,
    slug: form.slug,
    whatsapp: finalWA,
    precio_base: parseInt(form.precio_base.replace(/\./g, "")),
    km_base: parseInt(form.km_base),
    precio_extra_km: parseInt(form.precio_extra_km.replace(/\./g, "")),
    lat_origen: pos[0],
    lng_origen: pos[1],
  }]);

  if (error) {
    // Si el error es por link duplicado (Código 23505 en Postgres)
    if (error.code === '23505') {
      alert("❌ ¡E'a! El nombre '" + form.nombre + "' ya está registrado.\n\nSugerencia: Agregá tu ciudad o barrio al nombre (ej: " + form.nombre + " Luque) para que tu link sea único.");
    } else {
      alert("❌ Ocurrió un error: " + error.message);
    }
  } else {
    // Éxito: Guardamos y redirigimos
    alert("✅ ¡Link creado con éxito!");
    router.push(`/delivery/${form.slug}`);
  }
  setLoading(false);
};

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

  if (!mounted || !L) return <div className="h-screen flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-xs italic animate-pulse">Cargando CuantoEs...</div>;

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex justify-center items-start pb-20">
      <div className="max-w-md w-full space-y-6">
        
        <header className="text-center space-y-1">
            <h1 className="text-2xl font-[900] text-slate-800 tracking-tighter uppercase leading-none italic">
                Link de <span className="text-blue-600">Delivery</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">Personalizá tu propio cotizador</p>
        </header>

        {/* GUÍA RÁPIDA */}
        <div className="bg-blue-50 border border-blue-100 p-5 rounded-[2rem] shadow-sm">
            <h3 className="text-blue-900 text-[10px] font-[800] uppercase tracking-widest mb-5 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" /> ¡Dale nivel a tu negocio!
            </h3>
            <div className="space-y-4 text-slate-700 font-medium leading-tight text-[11px]">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-200 p-2 rounded-xl shrink-0"><UserCheck className="w-4 h-4 text-blue-700" /></div>
                    <p>Ubicá tu local en el mapa y poné tu WhatsApp.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-blue-200 p-2 rounded-xl shrink-0"><Receipt className="w-4 h-4 text-blue-700" /></div>
                    <p>Definí tus precios de envío (Base y Km extra).</p>
                </div>
                <div className="flex items-center gap-4 text-blue-700 font-[800]">
                    <div className="bg-blue-600 p-2 rounded-xl shrink-0 text-white shadow-md shadow-blue-100"><Share2 className="w-4 h-4" /></div>
                    <p>¡Listo! Poné el link en tu Bio de Instagram.</p>
                </div>
            </div>
        </div>

        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tus Datos</p>
                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
                    <Store className="w-4 h-4 text-slate-400 mr-3" />
                    <input placeholder="Nombre de tu Tienda (ej: Don Pipo)" className="bg-transparent w-full outline-none font-bold text-sm" onChange={e => handleNombreChange(e.target.value)} />
                </div>

                <div className="bg-slate-50 p-3 rounded-2xl flex items-center border border-slate-100">
                    <Globe className="w-4 h-4 text-blue-500 mr-3" />
                    <input 
                        value={form.slug ? `cuantoes.com.py/delivery/${form.slug}` : ""} 
                        readOnly 
                        placeholder="Link automático..."
                        className="bg-transparent w-full outline-none font-bold text-[10px] text-blue-400 italic" 
                    />
                </div>

                <div className="bg-[#F1F5F9] p-3 rounded-2xl flex items-center border-2 border-transparent focus-within:border-blue-600 focus-within:bg-white transition-all text-slate-700">
                    <Smartphone className="w-4 h-4 text-slate-400 mr-3" />
                    <input placeholder="WhatsApp (ej: 0981 000 000)" inputMode="numeric" className="bg-transparent w-full outline-none font-bold text-sm" onChange={e => setForm({...form, whatsapp: e.target.value})} />
                </div>
            </div>

            {/* MAPA */}
            <div className="space-y-2">
                <p className="text-[10px] font-black text-slate-400 uppercase px-1 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-red-500" /> ¿Dónde queda tu local?
                </p>
                <div className="h-56 w-full rounded-3xl overflow-hidden border-4 border-white shadow-inner relative z-0">
                    <MapContainer center={pos} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={pos} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] })} />
                        <MapClickHandler />
                    </MapContainer>
                </div>
            </div>

            {/* TARIFAS (Actualizado con nombres y formateador) */}
            <div className="space-y-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Tus Tarifas</p>
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-2xl flex flex-col border-2 border-slate-100 focus-within:border-blue-500 transition-all shadow-sm">
                        <span className="text-[8px] font-black text-blue-500 uppercase mb-1">Monto Base (0-10 km)</span>
                        <input 
                            placeholder="10.000" 
                            inputMode="numeric"
                            className="bg-transparent w-full outline-none font-black text-sm text-slate-800" 
                            value={form.precio_base}
                            onChange={e => setForm({...form, precio_base: formatMiles(e.target.value)})} 
                        />
                    </div>
                    <div className="bg-white p-3 rounded-2xl flex flex-col border-2 border-slate-100 focus-within:border-blue-500 transition-all shadow-sm">
                        <span className="text-[8px] font-black text-blue-500 uppercase mb-1">Adicional por Km</span>
                        <input 
                            placeholder="1.000" 
                            inputMode="numeric"
                            className="bg-transparent w-full outline-none font-black text-sm text-slate-800" 
                            value={form.precio_extra_km}
                            onChange={e => setForm({...form, precio_extra_km: formatMiles(e.target.value)})} 
                        />
                    </div>
                </div>
            </div>

            {/* BOTÓN FINAL */}
            <button 
              onClick={handleSave} 
              disabled={loading}
              className="w-full bg-blue-600 text-white font-[900] py-5 rounded-3xl shadow-xl shadow-blue-200 active:scale-95 transition-all flex justify-center items-center gap-3 tracking-tight"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 fill-white/20" />}
                <span>CREAR MI LINK</span>
            </button>
        </div>
        <Footer />
      </div>
    </main>
  );
}