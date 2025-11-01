import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

type VerifyInviteResponse = {
  valid: boolean;
  message: string;
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        ...corsHeaders,
      },
    });
  }

  if (req.method !== 'POST') {
    return response({ message: 'Méthode non autorisée', valid: false }, 405);
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return response({ valid: false, message: 'Corps JSON invalide' }, 400);
  }

  const code =
    typeof payload === 'object' && payload !== null && 'code' in payload
      ? (payload as Record<string, unknown>).code
      : undefined;

  if (typeof code !== 'string' || !code.trim()) {
    return response({ valid: false, message: 'Code requis' }, 400);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseServiceKey) {
    return response({ valid: false, message: 'Configuration serveur incomplète' }, 500);
  }

  const supabaseClient = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });

  const { data, error } = await supabaseClient
    .from('invite_codes')
    .select('id, expires_at, max_uses, used_count')
    .eq('code', code.trim())
    .maybeSingle();

  if (error) {
    console.error('Erreur Supabase', error);
    return response({ valid: false, message: 'Erreur serveur' }, 500);
  }

  if (!data) {
    return response({ valid: false, message: 'Code invalide' }, 404);
  }

  if (data.expires_at && new Date(data.expires_at).getTime() <= Date.now()) {
    return response({ valid: false, message: 'Code expiré' }, 400);
  }

  if (
    typeof data.max_uses === 'number' &&
    data.max_uses > 0 &&
    data.used_count >= data.max_uses
  ) {
    return response({ valid: false, message: 'Code déjà utilisé au maximum' }, 400);
  }

  return response({ valid: true, message: 'Code valide' });
});

function response(body: VerifyInviteResponse, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}
