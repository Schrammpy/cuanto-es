'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import dynamic from 'next/dynamic';
import { MapPin, Send, Loader2, Navigation, PlusCircle, Trash2, ChevronRight } from 'lucide-react';
import Footer from '@/components/Footer';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false });

export default function DeliveryCliente({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  const [shop, setShop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [L, setL] = useState<any>(null);

  // ESTADOS DEL MAPA
  const [pickupPos, setPickupPos] = useState<[number, number] | null>(null); // Punto B
  const [deliveryPos, setDeliveryPos] = useState<[number, number] | null>(null); // Punto C
  const [selecting, setSelecting] = useState<'PICKUP' | 'DELIVERY'>('DELIVERY');
  
  const [distanciaTotal, setDistanciaTotal] = useState<number>(0);
  const [costoTotal, setCostoTotal] = useState<number | null>(null);

  useEffect(() => {
    import('leaflet').then(leaflet => setL(leaflet));
    fetchShop();
  }, [slug]);

  async function fetchShop() {
    const { data } = await supabase.from('comercios').select('*').eq('slug', slug).single();
    if (data) setShop(data);
    setLoading(false);
  }

  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2)**2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 1.25;
  };

  // CÁLCULO CADA VEZ QUE CAMBIAN LAS POSICIONES
  useEffect(() => {
    if (!shop) return;

    let dist = 0;
    if (pickupPos) {
      // Ruta: Tienda -> Retiro -> Cliente
      dist = calcularDistancia(shop.lat_origen, shop.lng_origen, pickupPos[0], pickupPos[1]) +
             calcularDistancia(pickupPos[0], pickupPos[1], deliveryPos?.[0] || pickupPos[0], deliveryPos?.[1] || pickupPos[1]);
    } else if (deliveryPos) {
      // Ruta: Tienda -> Cliente (Normal)
      dist = calcularDistancia(shop.lat_origen, shop.lng_origen, deliveryPos[0], deliveryPos[1]);
    }

    if (dist > 0) {
      setDistanciaTotal(dist);
      const extra = dist > shop.km_base ? (dist - shop.km_base) * shop.precio_extra_km : 0;
      setCostoTotal(Math.round((shop.precio_base + extra) / 1000) * 1000);
    }
  }, [pickupPos, deliveryPos, shop]);

  const onMapClick = (e: any) => {
    const p: [number, number] = [e.latlng.lat, e.latlng.lng];
    if (selecting === 'PICKUP') {
      setPickupPos(p);
      setSelecting('DELIVERY'); // Salta automáticamente a pedir la entrega
    } else {
      setDeliveryPos(p);
    }
  };

  const MapEvents = () => {
    // @ts-ignore
    const { useMapEvents } = require('react-leaflet');
    useMapEvents({ click: onMapClick });
    return null;
  };

  const enviarPedido = () => {
    const msg = `🛵 *PEDIDO MULTI-PARADA*\n━━━━━━━━━━━━━━━━━━\n` +
                (pickupPos ? `📦 *Punto Retiro:* https://www.google.com/maps?q=${pickupPos[0]},${pickupPos[1]}\n` : '') +
                `🏠 *Entrega Final:* https://www.google.com/maps?q=${deliveryPos?.[0]},${deliveryPos?.[1]}\n` +
                `📏 *Distancia Total:* ${distanciaTotal.toFixed(1)} km\n` +
                `💰 *COSTO ENVÍO:* Gs. ${new Intl.NumberFormat('es-PY').format(costoTotal!)}\n━━━━━━━━━━━━━━━━━━\n✅ _Calculado en CuantoEs.com.py_`;
    window.open(`https://api.whatsapp.com/send?phone=${shop.whatsapp}&text=${encodeURIComponent(msg)}`);
  };

  if (loading || !L) return <div className="h-screen flex items-center justify-center font-bold text-slate-400 animate-pulse">CARGANDO...</div>;
  if (!shop) return <div className="h-screen flex items-center justify-center">Tienda no encontrada</div>;

  const shopIco = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', iconSize: [25, 41], iconAnchor: [12, 41] });
  const pickupIco = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png', iconSize: [25, 41], iconAnchor: [12, 41] });
  const deliveryIco = L.icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', iconSize: [25, 41], iconAnchor: [12, 41] });

  return (
    <main className="min-h-screen bg-[#F8FAFC] p-4 flex justify-center items-start pb-10">
      <div className="max-w-md w-full space-y-4">
        
        <header className="text-center pt-4">
            <h1 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">¿Cuanto es el <span className="text-blue-600">Delivery?</span></h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{shop.nombre}</p>
        </header>

        {/* SELECTOR DE MODO */}
        <div className="grid grid-cols-2 gap-2 bg-white p-2 rounded-3xl shadow-sm border border-slate-100">
            <button 
                onClick={() => setSelecting('DELIVERY')}
                className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${selecting === 'DELIVERY' ? 'bg-red-500 text-white shadow-lg shadow-red-100' : 'text-slate-400'}`}
            >
                <MapPin className="w-3 h-3" /> Destino
            </button>
            <button 
                onClick={() => setSelecting('PICKUP')}
                className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all flex items-center justify-center gap-2 ${selecting === 'PICKUP' ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'text-slate-400'}`}
            >
                <PlusCircle className="w-3 h-3" /> Parada Extra
            </button>
        </div>

        <div className="bg-blue-50 border border-blue-100 p-4 rounded-3xl flex items-center gap-3">
            <Navigation className="w-4 h-4 text-blue-600 shrink-0" />
            <p className="text-[11px] font-bold text-blue-900 leading-tight">
                {selecting === 'DELIVERY' ? 'Tocá el mapa para marcar tu CASA.' : 'Tocá el mapa para marcar dónde RETIRAR el paquete.'}
            </p>
        </div>

        <div className="h-[350px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white relative z-0">
          <MapContainer center={[shop.lat_origen, shop.lng_origen]} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[shop.lat_origen, shop.lng_origen]} icon={shopIco} />
            {pickupPos && <Marker position={pickupPos} icon={pickupIco} />}
            {deliveryPos && <Marker position={deliveryPos} icon={deliveryIco} />}
            <MapEvents />
          </MapContainer>
        </div>

        {costoTotal && (
          <div className="bg-slate-900 p-6 rounded-[2.5rem] text-center animate-in zoom-in-95 border-b-8 border-blue-600 shadow-2xl">
            <div className="flex justify-around mb-4">
                <div className="text-center">
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Total KM</p>
                    <p className="text-xl font-black text-white">{distanciaTotal.toFixed(1)} km</p>
                </div>
                <div className="w-[1px] bg-slate-700 h-10"></div>
                <div className="text-center">
                    <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Costo Final</p>
                    <p className="text-xl font-black text-white">Gs. {new Intl.NumberFormat('es-PY').format(costoTotal)}</p>
                </div>
            </div>
            <button onClick={enviarPedido} className="w-full bg-[#25D366] text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all">
                <Send className="w-4 h-4" /> CONFIRMAR Y PEDIR
            </button>
            {pickupPos && (
                <button onClick={() => setPickupPos(null)} className="mt-3 text-[9px] text-orange-400 font-bold uppercase tracking-widest flex items-center justify-center gap-1 mx-auto">
                   <Trash2 className="w-3 h-3" /> Quitar parada extra
                </button>
            )}
          </div>
        )}
        <Footer />
      </div>
    </main>
  );
}