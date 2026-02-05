import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://omqogmsarelhrlnjmnom.supabase.co';
const supabaseAnonKey = 'sb_publishable_ZyTL8VhSKlxufT7FvTurwg_SWTziGz7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
