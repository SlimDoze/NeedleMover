// app/features/teams/_hooks/useJoinTeam.ts
import { useState } from "react";
import { useRouter } from "expo-router";
import { CustomAlert } from "@/common/lib/alert";
import { TeamService } from "@/common/lib/teamService";
import { useAuth } from "@/common/lib/authContext";
import { JoinTeamMsg } from "../_constants/TeamAlertMsg";
import { Team_Routes } from "../_constants/routes";

export function useJoinTeam() {
  const router = useRouter();
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinTeam = async () => {
    if (!inviteCode.trim()) {
      CustomAlert(JoinTeamMsg.ErrorHeader, JoinTeamMsg.ErrorNoInviteCode);
      return;
    }

    if (!user) {
      CustomAlert("Error", "You must be logged in to join a team");
      return;
    }

    try {
      setIsLoading(true);

      const response = await TeamService.joinTeamWithCode(user.id, inviteCode);

      setIsLoading(false);

      if (response.success) {
        CustomAlert(JoinTeamMsg.SucessHeader, JoinTeamMsg.SuccessBody, [
          {
            text: "OK",
            onPress: () => router.replace(Team_Routes.Selection)
          }
        ]);
      } else {
        CustomAlert("Error", response.message || "Failed to join team");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error joining team:", error);
      CustomAlert("Error", "An unexpected error occurred");
    }
  };

  return {
    inviteCode,
    setInviteCode,
    isLoading,
    handleJoinTeam
  };
}