// supabase/functions/confirm-signup/index.ts
import { serve } from 'https://deno.land/std@0.131.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Read URL parameters
    const url = new URL(req.url)
    const token = url.searchParams.get('token')
    const type = url.searchParams.get('type')
    
    // Deep link configuration for your app
    const redirectUrl = `needlemover://verify?token=${token}&type=${type}`

    if (!token || type !== 'signup') {
      throw new Error('Invalid token or type')
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify email OTP
    const { error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: 'signup',
    })

    if (error) throw error

      // Redirect to app with verified token
      return Response.redirect(redirectUrl, 303)
    } catch (error) {
      return new Response(
        JSON.stringify({ 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }),
        {
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          },
          status: 400,
        }
      )
    }
  })
  
  export const config = {
    name: 'confirm-signup',
    regions: ['cdg1'], // Optional: specify region
    runtime: 'edge', // Specifies edge runtime
  }