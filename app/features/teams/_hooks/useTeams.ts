/**
 * [BEREITSTELLUNG] Team-Verwaltungsfunktionalität
 * 
 * Dieser Hook lädt und verwaltet Team-Daten des angemeldeten Benutzers.
 * Er bietet Zugriff auf Teams, Ladestatus und eine Aktualisierungsfunktion.
 * Nutzt den AuthContext für Benutzerinformationen und TeamService für Datenabfragen.
 */
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/authContext";
import { TeamService, Team } from "@/lib/teamService";

export function useTeams() {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // [LÄDT] Teams des angemeldeten Nutzers
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

  // [AKTUALISIERT] Teams bei Komponenteninitialisierung oder Benutzeränderung
  useEffect(() => {
    loadTeams();
  }, [user]);

  return {
    teams,
    isLoading,
    refreshTeams: loadTeams
  };
}
