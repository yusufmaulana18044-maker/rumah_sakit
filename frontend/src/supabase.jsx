import { createClient } from '@supabase/supabase-js'

// Ambil dari environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Debug: cek apakah terbaca (hapus setelah berhasil)
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Anon Key:', supabaseAnonKey ? '✅ Ada' : '❌ Tidak ada')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)