export interface Benefit {
  id: string;            // Un identificador único (ej: '1', '2', '3')
  day: number;           // El día de la semana (del 0 al 6)
  bank: string;          // El nombre del banco (Itaú, ueno, etc.)
  brand: string;         // El lugar (Stock, Biggie, Petrobras)
  category: 'SUPER' | 'FUEL' | 'FOOD' | 'PHARMA'; // Categorías fijas (esto activa los iconos)
  discount: string;      // El texto grande (30%, 2x1, Gs. 1.000)
  type: string;          // El texto chiquito (AHORRO, REINTEGRO)
  paymentMethod: string; // El método (Tarjeta de Crédito, QR, etc.)
  color: string;         // Clase de Tailwind para el fondo del círculo
  textColor: string;     // Clase de Tailwind para el color del texto
}

export const BENEFITS: Benefit[] = [
  {
    id: '1',
    day: 1,
    bank: "ueno",
    brand: "Biggie y Superseis",
    category: 'SUPER',
    discount: "40%",
    type: "REINTEGRO",
    paymentMethod: "QR ueno (Duo)",
    color: "bg-green-100",
    textColor: "text-green-700"
  },
  {
    id: '2',
    day: 2,
    bank: "Itaú",
    brand: "Supermercados Stock",
    category: 'PHARMA',
    discount: "30%",
    type: "AHORRO",
    paymentMethod: "Tarjeta de Crédito",
    color: "bg-blue-100",
    textColor: "text-blue-700"
  },
  {
    id: '3',
    day: 2, // Supongamos que hoy es martes
    bank: "ueno",
    brand: "Petrobras",
    category: 'FUEL',
    discount: "Gs. 1.000",
    type: "DESC x LITRO",
    paymentMethod: "QR ueno",
    color: "bg-yellow-100",
    textColor: "text-yellow-700"
  },
  {
    id: '4',
    day: 2,
    bank: "Continental",
    brand: "Pizzerías Varias",
    category: 'FOOD',
    discount: "2x1",
    type: "BENEFICIO",
    paymentMethod: "Tarjeta de Crédito",
    color: "bg-red-100",
    textColor: "text-red-700"
  }
];