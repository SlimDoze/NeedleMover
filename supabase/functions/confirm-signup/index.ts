// supabase/functions/confirm-signup/index.ts
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // CORS-Präflight-Anfragen behandeln
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // URL-Parameter auslesen
    const url = new URL(req.url)
    const token = url.searchParams.get('token')
    const type = url.searchParams.get('type')
    const redirectUrl = url.searchParams.get('redirect_url') || 'https://deine-app-url.de/login'

    if (!token || type !== 'signup') {
      throw new Error('Ungültiger Token oder Typ')
    }

    // Supabase-Client initialisieren
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // E-Mail mit dem Token verifizieren
    const { error, data } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'signup',
    })

    if (error) throw error

    // Nun haben wir die Nutzer-ID und können ein Profil erstellen
    if (data?.user?.id) {
      const userId = data.user.id
      
      // Profil erstellen
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          updated_at: new Date().toISOString(),
        })

      if (profileError) throw profileError
    }

    // Erfolgreiche Weiterleitung zur App
    return Response.redirect(redirectUrl, 303)
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})