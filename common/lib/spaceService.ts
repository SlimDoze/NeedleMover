// app/lib/teamService.ts
import { supabase } from './supabase';
import { nanoid } from 'nanoid';

export interface Team {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
  invite_code: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface TeamCreateData {
  name: string;
  description?: string;
  color?: string;
}

export interface TeamUpdateData {
  name?: string;
  description?: string;
  color?: string;
}

/**
 * Service for managing teams
 */
export class TeamService {
  /**
   * Create a new team
   */
  static async createTeam(userId: string, teamData: TeamCreateData): Promise<{
    success: boolean;
    message?: string;
    team?: Team;
  }> {
    try {
      // Generate a default color if not provided
      const defaultColors = ['#8A4FFF', '#4F8AFF', '#FF4F8A', '#4AFFB4', '#FFB44A'];
      const randomColor = defaultColors[Math.floor(Math.random() * defaultColors.length)];

      // Generate a unique invite code
      const inviteCode = nanoid(8).toUpperCase();

      // Create the team
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamData.name,
          description: teamData.description || '',
          color: teamData.color || randomColor,
          created_by: userId,
          created_at: new Date(),
          invite_code: inviteCode
        })
        .select()
        .single();

      if (teamError) {
        console.error('Error creating team:', teamError);
        return {
          success: false,
          message: teamError.message || 'Failed to create team'
        };
      }

      // Add the creator as an admin
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: userId,
          role: 'admin',
          joined_at: new Date()
        });

      if (memberError) {
        console.error('Error adding team member:', memberError);
        return {
          success: false,
          message: memberError.message || 'Failed to add you as a team member'
        };
      }

      return {
        success: true,
        message: 'Team created successfully',
        team: team as Team
      };
    } catch (error) {
      console.error('Unexpected error creating team:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Get teams for a user
   */
  static async getUserTeams(userId: string): Promise<Team[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          team_id,
          role,
          teams:team_id (*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user teams:', error);
        return [];
      }

      // Extract the team data from the nested structure
      return data.map((item: any) => ({
        ...item.teams,
        userRole: item.role
      }));
    } catch (error) {
      console.error('Unexpected error fetching user teams:', error);
      return [];
    }
  }

  /**
   * Get a team by ID
   */
  static async getTeamById(teamId: string): Promise<Team | null> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

      if (error) {
        console.error('Error fetching team:', error);
        return null;
      }

      return data as Team;
    } catch (error) {
      console.error('Unexpected error fetching team:', error);
      return null;
    }
  }

  /**
   * Update a team
   */
  static async updateTeam(teamId: string, updates: TeamUpdateData): Promise<{
    success: boolean;
    message?: string;
    team?: Team;
  }> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .update({
          ...updates,
          updated_at: new Date()
        })
        .eq('id', teamId)
        .select()
        .single();

      if (error) {
        console.error('Error updating team:', error);
        return {
          success: false,
          message: error.message || 'Failed to update team'
        };
      }

      return {
        success: true,
        message: 'Team updated successfully',
        team: data as Team
      };
    } catch (error) {
      console.error('Unexpected error updating team:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Join a team using an invite code
   */
  static async joinTeamWithCode(userId: string, inviteCode: string): Promise<{
    success: boolean;
    message?: string;
    team?: Team;
  }> {
    try {
      // Find the team with the invite code
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .ilike('invite_code', inviteCode)
        .single();

      if (teamError || !team) {
        console.error('Error finding team with invite code:', teamError);
        return {
          success: false,
          message: 'Invalid invite code'
        };
      }

      // Check if the user is already a member
      const { data: existingMember, error: checkError } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team.id)
        .eq('user_id', userId)
        .single();

      if (existingMember) {
        return {
          success: false,
          message: 'You are already a member of this team',
          team: team as Team
        };
      }

      // Add the user as a member
      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          user_id: userId,
          role: 'member',
          joined_at: new Date()
        });

      if (memberError) {
        console.error('Error joining team:', memberError);
        return {
          success: false,
          message: memberError.message || 'Failed to join team'
        };
      }

      return {
        success: true,
        message: 'Successfully joined the team',
        team: team as Team
      };
    } catch (error) {
      console.error('Unexpected error joining team:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }

  /**
   * Get team members
   */
  static async getTeamMembers(teamId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select(`
          id,
          role,
          joined_at,
          profiles:user_id (id, name, handle, avatar_url)
        `)
        .eq('team_id', teamId);

      if (error) {
        console.error('Error fetching team members:', error);
        return [];
      }

      // Format the data for easier consumption
      return data.map((member: any) => ({
        id: member.id,
        userId: member.profiles.id,
        name: member.profiles.name,
        handle: member.profiles.handle,
        avatarUrl: member.profiles.avatar_url,
        role: member.role,
        joinedAt: member.joined_at
      }));
    } catch (error) {
      console.error('Unexpected error fetching team members:', error);
      return [];
    }
  }

  /**
   * Generate a new invite code for a team
   */
  static async regenerateInviteCode(teamId: string): Promise<{
    success: boolean;
    message?: string;
    inviteCode?: string;
  }> {
    try {
      const newInviteCode = nanoid(8).toUpperCase();

      const { error } = await supabase
        .from('teams')
        .update({
          invite_code: newInviteCode,
          updated_at: new Date()
        })
        .eq('id', teamId);

      if (error) {
        console.error('Error regenerating invite code:', error);
        return {
          success: false,
          message: error.message || 'Failed to regenerate invite code'
        };
      }

      return {
        success: true,
        message: 'Invite code regenerated successfully',
        inviteCode: newInviteCode
      };
    } catch (error) {
      console.error('Unexpected error regenerating invite code:', error);
      return {
        success: false,
        message: 'An unexpected error occurred'
      };
    }
  }
}