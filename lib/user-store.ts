// Lista de sujetos (Nombres neutros y respetuosos)
const SUJETOS = [
  'Persona',    // Universal y neutro
  'Visitante',  // Ideal para un punto físico
  'Compa',      // Muy nuestro y amigable
  'Colega',     // Respetuoso
  'Socio',      // El pronombre universal paraguayo
  'Alguien',    // Misterioso pero correcto
  'Individuo',  // Formal y correcto
  'Peatón'      // Divertido para paradas de bus
];

// Lista de adjetivos (Positivos, buena onda y neutros en género)
const ADJETIVOS = [
  'Juky',       // Simpático/agradable en guaraní
  'Purete',     // Excelente/bueno
  'Tranqui',    // Relajado
  'Atento',     // Alguien que ayuda (se entiende neutro en este contexto)
  'Genial',     // Positivo
  'Curioso',    // Que explora el muro
  'Cool',       // Moderno
  'Amigable'   // El mejor para la comunidad
];

export const getOrCreateUser = () => {
  if (typeof window === 'undefined') return null;

  let user = localStorage.getItem('cuantoes_chat_user');
  
  if (!user) {
    const id = crypto.randomUUID();
    
    const sujeto = SUJETOS[Math.floor(Math.random() * SUJETOS.length)];
    const adjetivo = ADJETIVOS[Math.floor(Math.random() * ADJETIVOS.length)];
    
    // Formato: SUJETO_ADJETIVO_NRO (Ej: Compa_Juky_22)
    const nick = `${sujeto}_${adjetivo}_${Math.floor(Math.random() * 99)}`;
    
    const newUser = { id, nick };
    localStorage.setItem('cuantoes_chat_user', JSON.stringify(newUser));
    return newUser;
  }
  
  return JSON.parse(user);
};