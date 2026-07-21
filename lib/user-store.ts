const ADJETIVOS = ['Guapo', 'Kachiãi', 'Purete', 'Chuchi', 'Valle', 'Lomitero', 'Mbarete'];
const ANIMALES = ['Yacare', 'Taguá', 'Mainumby', 'Carapincho', 'Teju', 'Kure', 'Aguará'];

export const getOrCreateUser = () => {
  if (typeof window === 'undefined') return null;

  let user = localStorage.getItem('cuantoes_chat_user');
  if (!user) {
    const id = crypto.randomUUID();
    const adj = ADJETIVOS[Math.floor(Math.random() * ADJETIVOS.length)];
    const anim = ANIMALES[Math.floor(Math.random() * ANIMALES.length)];
    const nick = `${adj}_${anim}_${Math.floor(Math.random() * 99)}`;
    
    const newUser = { id, nick };
    localStorage.setItem('cuantoes_chat_user', JSON.stringify(newUser));
    return newUser;
  }
  return JSON.parse(user);
};