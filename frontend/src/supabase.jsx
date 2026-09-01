import { createClient } from '@supabase/supabase-js';

// HARDCODE SEMENTARA BUAT TEST
const supabaseUrl = 'https://pafvrjrclvarsgwwhwbx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBhZnZyanJjbHZhcnNnd3dod2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyMzA3NTksImV4cCI6MjEwMjgwNjc1OX0.MwJyFqn_sWIommyMAqF57_Qbl1dHdD6Le2rPefmuU3M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);