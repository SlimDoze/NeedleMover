// app/features/teams/_hooks/useCreateTeam.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { CustomAlert } from "@/common/lib/alert";
import { TeamService, TeamCreateData } from "@/lib/teamService";
import { useAuth } from "@/lib/authContext";
import { Team_Routes } from "../_constants/routes";
import { supabase } from "@/lib/supabase";

export function useCreateTeam() {
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      CustomAlert("Error", "Please enter a team name");
      return;
    }

    // WICHTIG: Prüfen und warten, bis Benutzer verfügbar ist
    if (!user) {
      // Session-Zustand erneut prüfen
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        if (!sessionData?.session) {
          CustomAlert("Error", "Du musst angemeldet sein, um ein Team zu erstellen");
          router.replace('/'); // Zurück zur Startseite
          return;
        }
        // Benutzer neu laden, wenn Session vorhanden aber user nicht
        await refreshUser();
      } catch (error) {
        CustomAlert("Error", "Du musst angemeldet sein, um ein Team zu erstellen");
        return;
      }
    }

    try {
      setIsLoading(true);

      const teamData: TeamCreateData = {
        name: teamName,
        description: teamDescription
      };

      // Zusätzliches Logging für Debugging
      console.log("Erstelle Team mit Benutzer-ID:", user?.id);
      
      const response = await TeamService.createTeam(user.id, teamData);

      setIsLoading(false);

      if (response.success) {
        CustomAlert("Success", "Team created successfully", [
          {
            text: "OK",
            onPress: () => router.replace(Team_Routes.Selection)
          }
        ]);
      } else {
        CustomAlert("Error", response.message || "Failed to create team");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error creating team:", error);
      CustomAlert("Error", "An unexpected error occurred");
    }
  };

  return {
    teamName,
    setTeamName,
    teamDescription,
    setTeamDescription,
    isLoading,
    handleCreateTeam
  };
}