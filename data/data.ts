export interface Benefit {
  id: string;            // Un identificador único (ej: '1', '2', '3')
  day: number;           // El día de la semana (del 0 al 6)
  bank: string;          // El nombre del banco (Itaú, ueno, etc.)
  brand: string;         // El lugar (Stock, Biggie, Petrobras)
  category: 'SUPER' | 'FUEL' | 'FOOD' | 'PHARMA'; // Categorías fijas (esto activa los iconos)
  discount: string;      // El texto grande (30%, 2x1, Gs. 1.000)
  type: string;          // El texto chiquito (AHORRO, REINTEGRO)
  paymentMethod: string; // El método (Tarjeta de Crédito, QR, etc.)
  link: string; // <-- NUEVO: Link a las bases y condiciones
  color: string;         // Clase de Tailwind para el fondo del círculo
  textColor: string;     // Clase de Tailwind para el color del texto
}

export const BENEFITS: Benefit[] = [
  {
    id: '1',
    day: 3,
    bank: "ueno",
    brand: "Biggie y Superseis",
    category: 'SUPER',
    discount: "40%",
    type: "REINTEGRO",
    paymentMethod: "QR ueno (Duo)",
    link: "https://www.ueno.com.py/beneficios",
    color: "bg-green-100",
    textColor: "text-green-700"
  },
  {
    id: '2',
    day: 6, //Sabado
    bank: "Itaú",
    brand: "Stock | Superseis | Super Real",
    category: 'SUPER',
    discount: "15%",
    type: "AHORRO",
    paymentMethod: "Tarjeta de Crédito",
    link: "https://www.itau.com.py/beneficios2/categoria/13", 
    color: "bg-blue-100",
    textColor: "text-blue-700"
  },
   {
    id: '3',
    day: 2, //Martes
    bank: "Itaú",
    brand: "Punto Farma",
    category: 'PHARMA',
    discount: "35%*",
    type: "AHORRO",
    paymentMethod: "QR y Tarjeta de Crédito",
    link: "https://www.itau.com.py/beneficios2/categoria/3", 
    color: "bg-blue-100",
    textColor: "text-blue-700"
  }
];