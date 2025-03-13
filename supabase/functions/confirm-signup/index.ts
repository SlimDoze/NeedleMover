import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/* +++++++++++++++++++++++++++++++++++++++++++
    !!! Code wird in der Cloud ausgeführt, kommuniziert wird hier Richtung app!!!

      CORS = Cross-Origin Ressource Sharing
      Erlaubt WebAnwendung auf externe Ressourcen zuzugreigen
        > (Mail => EdgeFunction =>DB Confirm => Deeplink)
  ++++++++++++++++++++++++++++++++++++++++++++*/
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Erlaubt Anfragen von allen Ursprüngen (Anfrage soll von verschiedenen Domains aus ausgerufen werden)
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', // Gibt die Erlaubten Header in der Anfrage an
};

serve(async (req) => {
  // [CORS] OPTIONS HTTP Request => Ensures external Servers Sequirity Guidelines 
  // [CORS] OPTIONS HTTP Request => Ensures  CORS REQ / Methods / Header  Formats are accepted
  if (req.method === 'OPTIONS') {

  // [CORS] OPTIONS HTTP Response => Header with information about the valid Headers is returned
    return new Response('ok', { headers: corsHeaders });
  }

  // [CORS] Main Request
  try {
    // Extracting Information out of edgeFunction URL
    // https://your-edge-function-url?token=someToken&type=signup
    
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');

      // [Validates] Request Type and Token Exist
    if (!token || type !== 'signup') {
      return new Response(JSON.stringify({ error: 'Invalid token or type' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // [Supabase] Getting environment Variables
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
