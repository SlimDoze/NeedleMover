// supabase/functions/confirm-signup/index.ts
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

/* +++++++++++++++++++++++++++++++++++++++++++
    !!! Code wird in der Cloud ausgeführt, kommuniziert wird hier Richtung app!!!

      CORS = Cross-Origin Ressource Sharing
      Erlaubt WebAnwendung auf externe Ressourcen zuzugreigen
        > (Mail => EdgeFunction =>DB Confirm => Deeplink)
  ++++++++++++++++++++++++++++++++++++++++++++*/
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Erlaubt Anfragen von allen Ursprüngen
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type', // Erlaubte Header
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // URL-Parameter extrahieren
    const url = new URL(req.url);
    const token = url.searchParams.get('token');
    const type = url.searchParams.get('type');
    const email = url.searchParams.get('email');

    // Parameter validieren
    if (!token || type !== 'signup' || !email) {
      return new Response(JSON.stringify({ 
        error: 'Invalid parameters. Required: token, type=signup, email' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    // Geräteerkennung für adaptive Weiterleitung
    const userAgent = req.headers.get('user-agent') || '';
    const isMobile = userAgent.includes('Mobile') || 
                     userAgent.includes('Android') || 
                     userAgent.includes('iPhone');

    // Deep Link URL erstellen
    let redirectUrl = '';

    // Mobile Deep Link mit dem NeedleMover Schema
    if (isMobile) {
      redirectUrl = `needlemover://verify?token=${token}&type=${type}&email=${encodeURIComponent(email)}`;
      console.log("Mobile erkannt, Umleitung zu:", redirectUrl);
    } 
    // Fallback für Web - verwendet die SITE_URL aus den Umgebungsvariablen oder localhost
    else {
      const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:8081';
      redirectUrl = `${siteUrl}/features/auth/screens/verify?token=${token}&type=${type}&email=${encodeURIComponent(email)}`;
      console.log("Desktop erkannt, Umleitung zu:", redirectUrl);
    }

    // HTTP-Umleitung zurückgeben
    return Response.redirect(redirectUrl, 303);

  } catch (error) {
    // Fehlerbehandlung
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