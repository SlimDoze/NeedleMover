-- Function to create profile after email confirmation
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
DECLARE
  pending_profile JSONB;
  new_name TEXT;
  new_handle TEXT;
BEGIN
  -- Check if user has confirmed their email
  IF NEW.email_confirmed_at IS NOT NULL THEN
    -- Extract pending profile metadata safely
    pending_profile := NEW.raw_user_meta_data->'pending_profile';

    -- Assign default values if missing
    new_name := COALESCE(pending_profile->>'name', NEW.email);
    new_handle := COALESCE(pending_profile->>'handle', REGEXP_REPLACE(NEW.email, '@.*', ''));

    -- Insert profile, handling conflicts by skipping existing entries
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

    -- Remove pending_profile metadata safely
    UPDATE auth.users 
    SET raw_user_meta_data = jsonb_set(raw_user_meta_data, '{pending_profile}', 'null', true)
    WHERE id = NEW.id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute function after email confirmation
CREATE OR REPLACE TRIGGER create_profile_after_confirmation
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.create_profile_for_user();
