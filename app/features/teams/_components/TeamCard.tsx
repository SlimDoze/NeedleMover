import React from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from '../_constants/selectionStyleSheet';

type Team = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastActive: string;
  color: string;
  image: number;
};

interface TeamCardProps {
  team: Team;
  onPress: (id: string) => void;
  scrollY: Animated.Value;
  index: number;
  cardHeight: number;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onPress, scrollY, index, cardHeight }) => {
  const scale = scrollY.interpolate({
    inputRange: [(index - 1) * cardHeight, index * cardHeight, (index + 1) * cardHeight],
    outputRange: [0.8, 1, 0.8],
    extrapolate: "clamp",
  });

  const opacity = scrollY.interpolate({
    inputRange: [(index - 1) * cardHeight, index * cardHeight, (index + 1) * cardHeight],
    outputRange: [0.6, 1, 0.6],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      key={team.id}
      style={[styles.teamCard, { backgroundColor: team.color, transform: [{ scale }], opacity }]}
    >
      <TouchableOpacity style={styles.teamCardContent} onPress={() => onPress(team.id)}>
        <View style={styles.teamHeader}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Ionicons name="information-circle-outline" size={24} color="white" />
        </View>

        <View style={styles.teamDetails}>
          <Image source={team.image} style={styles.teamImage} />
          <View style={styles.teamInfo}>
            <Text style={styles.teamDescription} numberOfLines={2}>
              {team.description}
            </Text>
            <View style={styles.teamStats}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={16} color="white" />
                <Text style={styles.statText}>{team.memberCount} members</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={16} color="white" />
                <Text style={styles.statText}>Active {team.lastActive}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default TeamCard;
