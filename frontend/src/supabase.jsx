import { createClient } from '@supabase/supabase-js';

<<<<<<< HEAD
// HARDCODE SEMENTARA BUAT TEST
const supabaseUrl = 'https://pafvrjrclvarsgwwhwbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZnZyanJjbHZhcnNnd3dod2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMzA3NTksImV4cCI6MjEwMjgwNjc1OX0.MwJyFqn_sWIommyMAqF57_Qbl1dHdD6Le2rPefmuU3M';
=======
// ✅ PAKAI URL YANG BENAR!
const supabaseUrl = "https://pafvrjrclvarsgwwhwbx.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZnZyanJjbHZhcnNnd3dod2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMzA3NTksImV4cCI6MjEwMjgwNjc1OX0.MwJyFqn_sWIommyMAqF57_Qbl1dHdD6Le2rPefmuU3M";
>>>>>>> 263e32c (feat: SICAKEP v2.0 - Integrasi Supabase & fitur lengkap)

export const supabase = createClient(supabaseUrl, supabaseAnonKey);