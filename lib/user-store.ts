// Lista de sujetos (Nombres neutros o de uso común en Py)
const SUJETOS = [
  'Alguien', 
  'Compa', 
  'Colega', 
  'Projimo', 
  'Fulano'
];

// Lista de adjetivos (Neutros, sin terminación o/a en lo posible)
const ADJETIVOS = [
  'Infiel', 
  'Fiel', 
  'Tranqui', 
  'Purete', 
  'Mbarete', 
  'Juky',
  'Ñembotavy',
  'Kaigue',
  'AnaDie', 
  'Vyro'      // El que anda en las nubes
];

export const getOrCreateUser = () => {
  if (typeof window === 'undefined') return null;

  // Buscamos si ya tiene un perfil guardado
  let user = localStorage.getItem('cuantoes_chat_user');
  
  if (!user) {
    const id = crypto.randomUUID();
    
    // Elegimos uno de cada lista de forma aleatoria
    const sujeto = SUJETOS[Math.floor(Math.random() * SUJETOS.length)];
    const adjetivo = ADJETIVOS[Math.floor(Math.random() * ADJETIVOS.length)];
    
    // Armamos el Nick: SUJETO + ADJETIVO + NRO (Ej: Compa_Tranqui_42)
    const nick = `${sujeto}_${adjetivo}_${Math.floor(Math.random() * 99)}`;
    
    const newUser = { id, nick };
    
    // Guardamos en el navegador del usuario para que siempre sea el mismo
    localStorage.setItem('cuantoes_chat_user', JSON.stringify(newUser));
    return newUser;
  }
  
  return JSON.parse(user);
};