'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import { MapPin, Send, Loader2, Info, Navigation, Truck, ChevronRight, CreditCard } from 'lucide-react';
import Footer from '@/components/Footer';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

// USAMOS React.use para desempaquetar los params en Next.js 15
export default function DeliveryCliente({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params); // <--- CLAVE PARA NEXT.JS 15
  const slug = resolvedParams.slug;

  const [shop, setShop] = useState<any>(null);
  const [clientPos, setClientPos] = useState<[number, number] | null>(null);
  const [distancia, setDistancia] = useState<number | null>(null);
  const [costoTotal, setCostoTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then(leaflet => setL(leaflet));
    fetchShop();
  }, [slug]);

  async function fetchShop() {
    try {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .eq('slug', slug)
        .single();
      
      if (error) {
        setErrorMsg(error.message);
        console.error("Error Supabase:", error);
      }
      if (data) setShop(data);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 1.25; 
  };

  const onMapClick = (e: any) => {
    const { lat, lng } = e.latlng;
    setClientPos([lat, lng]);
    
    // 1. Distancia lineal (pájaro)
    let distLineal = calcularDistancia(shop.lat_origen, shop.lng_origen, lat, lng);
    
    // 2. Ajuste de calles reales (En ciudades Py sumamos un 20% aprox)
    const distCalle = distLineal * 1.2; 
    setDistancia(distCalle);
    
    // 3. Lógica de costo (Tarifa Bolt Moto Style)
    let costoFinal = shop.precio_base;

    // Si la distancia supera el radio base (ej: 10km)
    if (distCalle > shop.km_base) {
      const kmExtras = distCalle - shop.km_base;
      costoFinal += kmExtras * shop.precio_extra_km;
    }

    // 4. Redondeo paraguayo (al 1.000 más cercano para delivery)
    // Si da 14.200 -> 14.000 | Si da 14.600 -> 15.000
    const finalRedondeado = Math.round(costoFinal / 1000) * 1000;
    
    // Aseguramos que nunca sea menor al precio base
    setCostoTotal(Math.max(finalRedondeado, shop.precio_base));
  };

  const MapEvents = () => {
    // @ts-ignore
    const { useMapEvents } = require('react-leaflet');
    useMapEvents({ click: onMapClick });
    return null;
  };

  const enviarPedido = () => {
    const msg = `🛵 *PEDIDO - COTIZACIÓN DE ENVÍO*\n━━━━━━━━━━━━━━━━━━\n📍 *Ubicación:* https://www.google.com/maps?q=${clientPos?.[0]},${clientPos?.[1]}\n📏 *Distancia:* ${distancia?.toFixed(1)} km aprox.\n💰 *Costo de Envío:* Gs. ${new Intl.NumberFormat('es-PY').format(costoTotal!)}\n━━━━━━━━━━━━━━━━━━\n✅ _Calculado en CuantoEs.com.py_`;
    window.open(`https://api.whatsapp.com/send?phone=${shop.whatsapp}&text=${encodeURIComponent(msg)}`);
  };

  if (loading || !L) return <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /><p className="text-xs font-black uppercase text-slate-400 tracking-widest text-center">Cargando Cotizador<br/>de {slug}...</p></div>;

  if (!shop) return (
    <div className="h-screen flex flex-col items-center justify-center p-10 text-center gap-4">
      <p className="font-black text-slate-800 uppercase tracking-tighter">Comercio no encontrado</p>
      <p className="text-xs text-slate-400 font-bold uppercase">Debug: {errorMsg || "No hay respuesta de la base de datos"}</p>
      <a href="/delivery/crear" className="text-blue-600 font-bold underline text-sm mt-4">Crear un comercio nuevo</a>
    </div>
  );

  const shopIcon = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] });
  const clientIcon = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] });

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex justify-center items-start pb-10">
      <div className="max-w-md w-full space-y-6">
        <header className="text-center space-y-1 pt-4">
            <h1 className="text-2xl font-black text-slate-800 uppercase italic leading-none tracking-tighter italic">
                ¿Cuanto es el <span className="text-blue-600">Delivery?</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Para: {shop.nombre}</p>
        </header>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex items-center gap-3 shadow-sm">
            <div className="bg-blue-600 p-2 rounded-xl text-white shrink-0"><Navigation className="w-4 h-4" /></div>
            <p className="text-[11px] font-bold text-blue-900 leading-tight">Tocá en el mapa dónde es tu casa para calcular el envío automáticamente.</p>
        </div>

        <div className="h-[400px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-0">
          <MapContainer center={[shop.lat_origen, shop.lng_origen]} zoom={14} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[shop.lat_origen, shop.lng_origen]} icon={shopIcon} />
            {clientPos && <Marker position={clientPos} icon={clientIcon} />}
            <MapEvents />
          </MapContainer>
        </div>

        {costoTotal && (
          <div className="bg-slate-900 p-6 rounded-[2.5rem] text-center animate-in zoom-in-95 border-b-8 border-blue-600 shadow-2xl">
            <div className="flex justify-around mb-4">
                <div className="text-center">
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Distancia</p>
                    <p className="text-xl font-black text-white">{distancia?.toFixed(1)} km</p>
                </div>
                <div className="w-[1px] bg-slate-700 h-10"></div>
                <div className="text-center">
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Costo Envío</p>
                    <p className="text-xl font-black text-white">Gs. {new Intl.NumberFormat('es-PY').format(costoTotal)}</p>
                </div>
            </div>
            <button onClick={enviarPedido} className="w-full bg-[#25D366] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                <Send className="w-4 h-4" /> CONFIRMAR UBICACIÓN
            </button>
          </div>
        )}
        <Footer />
      </div>
    </main>
  );
}