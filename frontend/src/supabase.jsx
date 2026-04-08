import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xqgiwdfbxypscnyufgth.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxZ2l3ZGZieHlwc2NueXVmZ3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2MDg2NDMsImV4cCI6MjA5MTE4NDY0M30.YCQzQjYoDSjqT2-aJENaMCrf_aYqf2FZvQRV5QvdhPk";

export const supabase = createClient(supabaseUrl, supabaseKey);