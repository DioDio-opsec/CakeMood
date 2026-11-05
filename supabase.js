import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Preencha com os dados públicos do seu projeto Supabase.
// A chave anon/publishable pode ficar no navegador quando as políticas RLS estiverem corretas.
// NUNCA coloque a service_role key ou a chave secreta do Resend neste arquivo.
const SUPABASE_URL = "https://nrxjqhsyihgqjktqaccm.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_AoqIiFRW2WIMWAq2Amr8GQ_EIx5kLje";

if (SUPABASE_URL.startsWith("COLE_") || SUPABASE_ANON_KEY.startsWith("COLE_")) {
  console.warn("Configure SUPABASE_URL e SUPABASE_ANON_KEY em supabase.js.");
}
export const supabase = createClient(SUPABASE_URL,SUPABASE_ANON_KEY);
