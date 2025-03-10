// app/lib/profileService.ts
import { supabase } from './supabase';

export interface Profile {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProfileUpdateData {
  name?: string;
  handle?: string;
  avatar_url?: string;
  bio?: string;
}

/**
 * Service for managing user profiles
 */
export class ProfileService {
  /**
   * Get a user's profile by ID
   */
  static async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      return null;
    }
  }

  /**
   * Update a user's profile
   */
  static async updateProfile(userId: string, updates: ProfileUpdateData): Promise<{
    success: boolean;
    message?: string;
    data?: Profile;
  }> {
    try {
      // Add updated_at timestamp
      const updatedData = {
        ...updates,
        updated_at: new Date()
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(updatedData)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        return {
          success: false,
          message: error.message || 'Failed to update profile'
        };
      }

      return {
        success: true,
        message: 'Profile updated successfully',
        data: data as Profile
      };
    } catch (error) {
      console.error('Unexpected error updating profile:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Upload a profile avatar image
   */
  static async uploadAvatar(userId: string, fileUri: string): Promise<{
    success: boolean;
    message?: string;
    url?: string;
  }> {
    try {
      // Generate a unique file name
      const fileName = `${userId}-${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;

      // For React Native, you'll need to handle file preparation differently
      // This is a simplified example
      const response = await fetch(fileUri);
      const blob = await response.blob();

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob);

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return {
          success: false,
          message: uploadError.message || 'Failed to upload avatar'
        };
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the user's profile with the new avatar URL
      const { success, message } = await this.updateProfile(userId, {
        avatar_url: urlData.publicUrl
      });

      if (!success) {
        return {
          success: false,
          message: message || 'Failed to update profile with new avatar'
        };
      }

      return {
        success: true,
        message: 'Avatar uploaded successfully',
        url: urlData.publicUrl
      };
    } catch (error) {
      console.error('Unexpected error uploading avatar:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Check if a handle is already in use
   */
  static async isHandleAvailable(handle: string, excludeUserId?: string): Promise<boolean> {
    try {
      let query = supabase
        .from('profiles')
        .select('id')
        .eq('handle', handle);
      
      // Exclude the current user if provided
      if (excludeUserId) {
        query = query.neq('id', excludeUserId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error checking handle availability:', error);
        return false;
      }

      // Handle is available if no profiles with this handle are found
      return data.length === 0;
    } catch (error) {
      console.error('Unexpected error checking handle availability:', error);
      return false;
    }
  }
}