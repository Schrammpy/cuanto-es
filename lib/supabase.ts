import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Este es el objeto que usaremos para consultar los datos de los comercios
export const supabase = createClient(supabaseUrl, supabaseAnonKey);