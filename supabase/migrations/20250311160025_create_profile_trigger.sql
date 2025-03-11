-- Create function to handle profile creation after email confirmation
CREATE OR REPLACE FUNCTION public.create_profile_for_user()
RETURNS TRIGGER AS $$
DECLARE
  pending_profile JSONB;
  new_name TEXT;
  new_handle TEXT;
BEGIN
  -- Check if the user's email has been confirmed
  IF NEW.email_confirmed_at IS NOT NULL THEN
    -- Extract pending profile details from user metadata
    pending_profile := NEW.raw_user_meta_data->>'pending_profile';
    
    -- Safely extract name and handle
    new_name := COALESCE(
      (pending_profile->>'name')::text, 
      NEW.email
    );
    
    new_handle := COALESCE(
      (pending_profile->>'handle')::text, 
      REGEXP_REPLACE(NEW.email, '@.*', '')
    );

    -- Insert profile, handling potential conflicts
    INSERT INTO public.profiles (
      id, 
      email, 
      name, 
      handle, 
      created_at,
      avatar_url
    )
    VALUES (
      NEW.id,
      NEW.email,
      new_name,
      new_handle,
      NOW(),
      'https://ui-avatars.com/api/?name=' || REPLACE(new_name, ' ', '+')
    )
    ON CONFLICT (id) DO NOTHING;

    -- Optional: Clear the pending profile metadata
    UPDATE auth.users 
    SET raw_user_meta_data = raw_user_meta_data - 'pending_profile'
    WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to fire after email confirmation
CREATE OR REPLACE TRIGGER create_profile_after_confirmation
AFTER UPDATE ON auth.users
FOR EACH ROW
WHEN (OLD.email_confirmed_at IS NULL AND NEW.email_confirmed_at IS NOT NULL)
EXECUTE FUNCTION public.create_profile_for_user();