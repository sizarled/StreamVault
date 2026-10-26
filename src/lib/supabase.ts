import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vtbqbhuywdhnvitbcsfy.supabase.co';
const supabaseKey = 'sb_publishable_KekOyPC4iVxpiqzvuWkKdA_mEsiWTrX';

export const supabase = createClient(supabaseUrl, supabaseKey);
