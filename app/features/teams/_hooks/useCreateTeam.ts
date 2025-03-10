// app/features/teams/_hooks/useCreateTeam.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { CustomAlert } from "@/common/lib/alert";
import { TeamService, TeamCreateData } from "@/common/lib/teamService"
import { useAuth } from "@/common/lib/authContext";
import { Team_Routes } from "../_constants/routes";

export function useCreateTeam() {
  const router = useRouter();
  const { user } = useAuth();
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      CustomAlert("Error", "Please enter a team name");
      return;
    }

    if (!user) {
      CustomAlert("Error", "You must be logged in to create a team");
      return;
    }

    try {
      setIsLoading(true);

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
