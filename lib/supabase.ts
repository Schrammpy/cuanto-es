import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Solo inicializamos si tenemos los datos reales, sino usamos un cliente vacío para el build
export const supabase = createClient(supabaseUrl, supabaseAnonKey);