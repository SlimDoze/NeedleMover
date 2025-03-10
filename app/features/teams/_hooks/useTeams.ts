// app/features/teams/_hooks/useTeams.ts
import { useState, useEffect } from "react";
import { useAuth } from "@/common/lib/authContext";
import { TeamService, Team } from "@/common/lib/teamService";

export function useTeams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTeams = async () => {
    if (!user) {
      setTeams([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const userTeams = await TeamService.getUserTeams(user.id);
      setTeams(userTeams);
    } catch (error) {
      console.error("Error loading teams:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load teams on mount and when user changes
  useEffect(() => {
    loadTeams();
  }, [user]);

  return {
    teams,
    isLoading,
    refreshTeams: loadTeams
  };
}
