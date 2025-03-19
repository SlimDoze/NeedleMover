// Überarbeitung der confirm-signup/index.ts
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // CORS-Preflight-Anfragen bearbeiten
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

    // Supabase-Client erstellen für diese Anfrage
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        }
      }
    );

    // Verifiziere die OTP direkt hier
    console.log(`Verifying OTP for ${email} with token ${token}`);
    const { error } = await supabaseAdmin.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });

    if (error) {
      console.error('Verification error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      });
    }

    console.log(`Email successfully verified for ${email}`);

    // Geräteerkennung für adaptive Weiterleitung
    const userAgent = req.headers.get('user-agent') || '';
    const isMobile = userAgent.includes('Mobile') || 
                     userAgent.includes('Android') || 
                     userAgent.includes('iPhone');

    // Deep Link URL erstellen
    let redirectUrl = '';

    // Mobile Deep Link mit dem NeedleMover Schema
    if (isMobile) {
      redirectUrl = `needlemover://verify-success?verified=true&email=${encodeURIComponent(email)}`;
      console.log("Mobile erkannt, Umleitung zu:", redirectUrl);
    } 
    // Fallback für Web
    else {
      const siteUrl = Deno.env.get('SITE_URL') || 'http://localhost:8081';
      redirectUrl = `${siteUrl}/features/auth/screens/verify?verified=true&email=${encodeURIComponent(email)}`;
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