import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');

    if (!token || type !== 'signup') {
      return new Response(JSON.stringify({ error: 'Invalid token or type' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify email OTP
    const { error } = await supabase.auth.verifyOtp({
      token,
      type: 'signup',
    });

    if (error) {
      console.error('OTP Verification Error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Redirect URL (Deep Link for Mobile, Web Fallback)
    const redirectUrl = `needlemover://verify?token=${token}&type=${type}`;
    return Response.redirect(redirectUrl, 303);

  } catch (error) {
    console.error('Unexpected Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});

export const config = {
  name: 'confirm-signup',
  regions: ['cdg1'],
  runtime: 'edge',
};
