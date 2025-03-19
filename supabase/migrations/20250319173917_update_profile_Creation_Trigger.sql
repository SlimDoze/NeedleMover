-- Verbesserte Version des create_profile_trigger.sql
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
DECLARE
  pending_profile JSONB;
  new_name TEXT;
  new_handle TEXT;
BEGIN
  -- Mehr Debugging hinzufügen
  RAISE LOG 'Creating profile for user: %, email_confirmed_at: %', NEW.id, NEW.email_confirmed_at;
  
  -- Prüfen, ob der Benutzer seine E-Mail bestätigt hat
  IF NEW.email_confirmed_at IS NOT NULL THEN
    -- Extrahiere Metadata sicher
    RAISE LOG 'User metadata: %', NEW.raw_user_meta_data;
    pending_profile := NEW.raw_user_meta_data->'pending_profile';
    RAISE LOG 'Pending profile data: %', pending_profile;

    -- Standard-Werte zuweisen, wenn keine vorhanden sind
    new_name := COALESCE(pending_profile->>'name', NEW.email);
    new_handle := COALESCE(pending_profile->>'handle', REGEXP_REPLACE(NEW.email, '@.*', ''));
    
    RAISE LOG 'Creating profile with name: %, handle: %', new_name, new_handle;

    -- Profil einfügen, Konflikte durch Überspringen vorhandener Einträge behandeln
    INSERT INTO public.profiles (id, email, name, handle, created_at, avatar_url)
    VALUES (
      NEW.id,
      NEW.email,
      new_name,
      new_handle,
      NOW(),
      'https://ui-avatars.com/api/?name=' || REPLACE(new_name, ' ', '+')
    )
    ON CONFLICT (id) DO NOTHING;
    
    RAISE LOG 'Profile created successfully for user: %', NEW.id;

    -- Entferne pending_profile Metadaten sicher
    UPDATE auth.users 
    SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{pending_profile}', 'null', true)
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;