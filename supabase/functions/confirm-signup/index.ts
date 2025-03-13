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

  serve(async (req: Request) => {
    // CORS-Handling...
  
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
  
      // Supabase initialisieren
      const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;
      const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
      // OTP verifizieren (mit Email-Parameter)
      const { error } = await supabase.auth.verifyOtp({
        email,
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
  
      // Geräteerkennung und adaptive Weiterleitung
      const isMobile = req.headers.get('user-agent')?.includes('Mobile') || 
                       req.headers.get('user-agent')?.includes('Android') || 
                       req.headers.get('user-agent')?.includes('iPhone');
  
      let redirectUrl;
      if (isMobile) {
        // Deep Link für mobile Geräte
        redirectUrl = `needlemover://verify?token=${token}&type=${type}&email=${encodeURIComponent(email)}`;
      } else {
        // Web-Fallback
        const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:3000';
        redirectUrl = `${siteUrl}/auth-callback?token=${token}&type=${type}&email=${encodeURIComponent(email)}`;
      }
      
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
