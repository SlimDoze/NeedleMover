// app/features/teams/screens/selection.tsx
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, Animated, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { styles } from '../_constants/selectionStyleSheet';
import { ComponentCaptions } from '../_constants/componentCaptions';
import TeamCard from '../_components/TeamCard';
import { useAuth } from '@/lib/authContext';
import { AppColors } from '@/common/constants/AppColors';
import LogoutButton from '@/common/components/logoutButton';
import { useTeams } from '../_hooks/useTeams';

const { height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.5;

export default function TeamSelectionScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // Lade Teams vom Server mit dem useTeams Hook
  const { teams, isLoading, refreshTeams } = useTeams();
  
  const { profile } = useAuth();

  const navigateToTeam = (teamId: string) => {
    router.push(`./${teamId}`);
  };

  // Create a placeholder card if no teams exist
  const renderNoTeamsCard = () => (
    <Animated.View style={[styles.teamCard, { backgroundColor: AppColors.primary }]}>
      <TouchableOpacity 
        style={styles.teamCardContent} 
        onPress={() => router.push("./createTeam")}
      >
        <View style={styles.createTeamContent}>
          <Text style={styles.createTeamDescription}>
            {teams.length === 0 
              ? ComponentCaptions.teamSelection.createCard.startFirstCollab 
              : ComponentCaptions.teamSelection.createCard.createTeamDescription}
          </Text>
          <TouchableOpacity 
            style={styles.createTeamButton}
            onPress={() => router.push("./createTeam")}
          >
            <Text style={styles.createTeamButtonText}>{ComponentCaptions.teamSelection.footer.createTeam}</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>{ComponentCaptions.teamSelection.header.title}</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={
              profile?.avatar_url 
                ? { uri: profile.avatar_url } 
                : require("@/assets/images/userAvatar.png")
            } 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
        <LogoutButton variant="icon" style={styles.logoutButton} />
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent, 
          { paddingBottom: height * 0.5 }
        ]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={CARD_HEIGHT * 0.9}
        decelerationRate="fast"
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refreshTeams}
            colors={[AppColors.primary]}
            tintColor={AppColors.primary}
          />
        }
      >
        {teams.length === 0 && !isLoading ? renderNoTeamsCard() : null}
        
        {teams.map((team, index) => (
          <TeamCard 
            key={team.id} 
            team={{
              id: team.id,
              name: team.name,
              description: team.description || '',
              memberCount: team.memberCount || 0,
              lastActive: team.lastActive || 'Recently',
              color: team.color,
              image: team.image || require("@/assets/images/userAvatar.png")
            }} 
            onPress={navigateToTeam} 
            scrollY={scrollY} 
            index={index} 
            cardHeight={CARD_HEIGHT} 
          />
        ))}
        {teams.map((team, index) => (
  <TeamCard 
    key={team.id} 
    team={{
      id: team.id,
      name: team.name,
      description: team.description || '',
      memberCount: 0, // Standardwert oder berechne aus einer anderen Eigenschaft
      lastActive: team.updated_at ? new Date(team.updated_at).toLocaleDateString() : 'Recently', 
      color: team.color,
      image: require("@/assets/images/userAvatar.png") // Standardwert
    }} 
    onPress={navigateToTeam} 
    scrollY={scrollY} 
    index={index} 
    cardHeight={CARD_HEIGHT} 
  />
))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => router.push("./joinTeam")}
        >
          <Feather name="user-plus" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>{ComponentCaptions.teamSelection.footer.joinTeam}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => router.push("./createTeam")}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => {}}
        >
          <Feather name="edit" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>{ComponentCaptions.teamSelection.footer.editTeam}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}