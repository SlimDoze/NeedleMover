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
      console.log("Kein Benutzer gefunden beim Team-Erstellen, prüfe Session...");
      
      // Session-Zustand erneut prüfen
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        
        console.log("Session-Check für Team-Erstellung:", 
          sessionData?.session ? "Session vorhanden" : "Keine Session"
        );
        
        if (!sessionData?.session) {
          console.log("Benutzer nicht angemeldet beim Team-Erstellen");
          CustomAlert("Error", "Du musst angemeldet sein, um ein Team zu erstellen");
          
          // Zur Anmeldeseite navigieren
          setTimeout(() => {
            router.replace('/');
          }, 500);
          return;
        }
        
        // Benutzer neu laden, wenn Session vorhanden aber user nicht
        console.log("Session vorhanden, aber kein User - lade Benutzer neu");
        await refreshUser();
        
        // Nach dem Refresh erneut prüfen
        if (!user) {
          console.log("Auch nach Refresh kein Benutzer gefunden");
          CustomAlert("Error", "Benutzerkontext konnte nicht geladen werden");
          return;
        }
      } catch (error) {
        console.error("Fehler beim Prüfen der Session:", error);
        CustomAlert("Error", "Du musst angemeldet sein, um ein Team zu erstellen");
        return;
      }
    }

    try {
      setIsLoading(true);
      console.log("Erstelle Team mit Benutzer-ID:", user.id);

      const teamData: TeamCreateData = {
        name: teamName,
        description: teamDescription
      };
      
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