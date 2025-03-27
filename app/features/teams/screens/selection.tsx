/**
 * [BEREITSTELLUNG] Team-Auswahlbildschirm
 * 
 * Diese Datei implementiert den Hauptbildschirm für die Team-Auswahl nach der Anmeldung.
 * Zeigt eine animierte Liste der Teams des Benutzers und Optionen zur Team-Verwaltung.
 * Enthält vorübergehende Beispieldaten für die Entwicklungsphase.
 * Bietet Debug-Funktionen zur Anzeige der Profilinformationen.
 */
import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, Animated, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { styles } from '../_constants/selectionStyleSheet';
import { ComponentCaptions } from '../_constants/componentCaptions';
import TeamCard from '../_components/TeamCard';
import { useAuth } from '@/lib/authContext';
import { AppColors } from '@/common/constants/AppColors';
import LogoutButton from '@/common/components/logoutButton';

const { height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.5;

// [TEMPORÄR] Beispiel-Teammitglieder für die Entwicklung
// [HINWEIS] Für Serverantwort:
// 1. Entferne diese mockTeams-Konstante
// 2. Kommentiere den useTeams()-Hook am Anfang der Komponente ein
// 3. Ersetze 'mockTeams' durch 'teams' in der gesamten Komponente
// 4. Stelle die refreshTeams-Funktion im RefreshControl wieder her
const mockTeams = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Beats Collective',
    description: 'Hip hop production team focused on creating radio-ready instrumentals',
    memberCount: 5,
    lastActive: '2 hours ago',
    color: '#8A4FFF',
    image: require('@/assets/images/userAvatar.png')
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Studio 42',
    description: 'Rock band and production studio working on our debut EP',
    memberCount: 4,
    lastActive: 'Yesterday',
    color: '#4F8AFF',
    image: require('@/assets/images/userAvatar.png')
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Drum Collective',
    description: 'EDM production team specializing in house and techno tracks',
    memberCount: 3,
    lastActive: '3 days ago',
    color: '#FF4F8A',
    image: require('@/assets/images/userAvatar.png')
  },
  {
    id: '44444444-4444-4444-4444-444444444444',
    name: 'Acoustic Collective',
    description: 'Acoustic and folk music collaboration platform',
    memberCount: 6,
    lastActive: '1 week ago',
    color: '#4AFFB4',
    image: require('@/assets/images/userAvatar.png')
  },
  // [HINWEIS] Weitere Teams können hier hinzugefügt werden
];

export default function TeamSelectionScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  
  // [TEMPORÄR] Kommentierte Server-Datenabfrage
  // [HINWEIS] Einkommentieren für tatsächliche Datenabfrage
  // const { teams, isLoading, refreshTeams } = useTeams();
  
  // [TEMPORÄR] Ersatz für Server-Status
  const [isLoading, setIsLoading] = useState(false);
  const { profile, user } = useAuth();

  // [NAVIGIERT] Zur Detailansicht des ausgewählten Teams
  const navigateToTeam = (teamId: string) => {
    router.push(`./${teamId}`);
  };

  // [TEMPORÄR] Simulates Aktualisierung ohne Server
  const mockRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  // [ZEIGT] Debug-Informationen zum Benutzerprofil
  const showProfileDebugInfo = () => {
    console.log("=== AKTUELLES PROFIL ===");
    console.log(JSON.stringify(profile, null, 2));
    console.log("=== AKTUELLER USER ===");
    console.log(JSON.stringify(user, null, 2));
    
    // [ZEIGT] Alert für bessere Sichtbarkeit
    Alert.alert(
      "Profil-Debug-Info", 
      `Angemeldet als: ${profile?.email || 'Unbekannt'}\n` +
      `Name: ${profile?.name || 'Nicht gesetzt'}\n` +
      `Handle: ${profile?.handle || 'Nicht gesetzt'}\n` +
      `User-ID: ${user?.id || 'Keine ID'}\n\n` +
      "Vollständige Informationen in der Konsole.",
      [{ text: "OK" }]
    );
  };

  // [RENDERT] Ersatzkarte bei leerer Teamliste
  const renderNoTeamsCard = () => (
    <Animated.View style={[styles.teamCard, { backgroundColor: AppColors.primary }]}>
      <TouchableOpacity 
        style={styles.teamCardContent} 
        onPress={() => router.push("./createTeam")}
      >
        <View style={styles.createTeamContent}>
          <Text style={styles.createTeamDescription}>
            {mockTeams.length === 0 // [HINWEIS] Zu 'teams' ändern bei Server-Umstellung
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
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={showProfileDebugInfo} // [VERWENDET] Debug-Handler
        >
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
            onRefresh={mockRefresh} // [HINWEIS] Bei Server-Umstellung durch 'refreshTeams' ersetzen
            colors={[AppColors.primary]}
            tintColor={AppColors.primary}
          />
        }
      >
        {mockTeams.length === 0 && !isLoading ? renderNoTeamsCard() : null} {/* [HINWEIS] Zu 'teams' ändern bei Server-Umstellung */}
        
        {mockTeams.map((team, index) => ( // [HINWEIS] Zu 'teams' ändern bei Server-Umstellung
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