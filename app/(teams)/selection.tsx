// app/(teams)/selection.tsx
import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  PanResponder,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/AppColors';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.55;

// Mock data for teams
const mockTeams = [
  {
    id: '1',
    name: 'Beats Collective',
    description: 'Hip hop production team focused on creating radio-ready instrumentals',
    memberCount: 5,
    lastActive: '2 hours ago',
    color: '#8A4FFF', // Purple (primary)
    image: require('@/assets/images/ProfilePictureIcon.png')
  },
  {
    id: '2',
    name: 'Studio 42',
    description: 'Rock band and production studio working on our debut EP',
    memberCount: 4,
    lastActive: 'Yesterday',
    color: '#4F8AFF', // Blue
    image: require('@/assets/images/ProfilePictureIcon.png')
  },
  {
    id: '3',
    name: 'Electronic Vibes',
    description: 'EDM production team specializing in house and techno tracks',
    memberCount: 3,
    lastActive: '3 days ago',
    color: '#FF4F8A', // Pink
    image: require('@/assets/images/ProfilePictureIcon.png')
  },
];

export default function TeamSelectionScreen() {
  const router = useRouter();
  const [teams] = useState(mockTeams);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const position = useRef(new Animated.ValueXY()).current;
  const rotation = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const navigateToTeam = useCallback(() => {
    // Navigate to the selected team
    router.push(`../(teams)/${teams[currentIndex].id}`);
  }, [currentIndex, router, teams]);

  const navigateToCreateTeam = () => {
    router.push('../(teams)/create');
  };

  const navigateToJoinTeam = () => {
    router.push('../(teams)/join');
  };

  const panResponder = useRef(
    PanResponder.create({
      // Erhöhen Sie die Empfindlichkeit
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => 
        Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5,
      
      onPanResponderGrant: () => {
        // In neueren React Native Versionen können wir offset direkt setzen
        position.extractOffset();
      },
      
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      
      onPanResponderRelease: (_, gestureState) => {
        // Offset zurücksetzen
        position.flattenOffset();
        
        // Schwellenwert für Swipes
        const swipeThreshold = width * 0.25; // 25% der Bildschirmbreite
        
        if (gestureState.dx > swipeThreshold) {
          // Nach rechts geswiped - zum Team navigieren
          Animated.timing(position, {
            toValue: { x: width, y: 0 },
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            navigateToTeam();
            // Position nach der Navigation zurücksetzen
            position.setValue({ x: 0, y: 0 });
          });
        } else if (gestureState.dx < -swipeThreshold) {
          // Nach links geswiped - nächste Karte
          Animated.timing(position, {
            toValue: { x: -width, y: 0 },
            duration: 250,
            useNativeDriver: true,
          }).start(() => {
            const nextIndex = (currentIndex + 1) % teams.length;
            setCurrentIndex(nextIndex);
            // Position nach der Indexänderung zurücksetzen
            position.setValue({ x: 0, y: 0 });
          });
        } else {
          // Zurück zur Ausgangsposition
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const renderCards = () => {
    return teams.map((team, index) => {
      // Nur aktuelle und nächste Karte rendern
      if (index < currentIndex || index > currentIndex + 1) return null;

      const isCurrentCard = index === currentIndex;
      
      // Platform-spezifische Style-Optimierungen
      const platformStyles = Platform.OS === 'android' ? { renderToHardwareTextureAndroid: true } : {};
      
      const cardStyle = isCurrentCard
        ? {
            transform: [
              { translateX: position.x },
              { translateY: position.y },
              { rotate: rotation },
            ],
            zIndex: 1,
            ...platformStyles,
          }
        : {
            transform: [
              { scale: 0.95 },
              { translateY: 10 },
            ],
            zIndex: 0,
          };

      return (
        <Animated.View
          key={team.id}
          style={[styles.card, cardStyle]}
          {...(isCurrentCard ? panResponder.panHandlers : {})}
        >
          <View style={[styles.teamImageContainer, { backgroundColor: team.color }]}>
            <Image source={team.image} style={styles.teamImage} />
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.teamName}>{team.name}</Text>
            <Text style={styles.teamDescription}>{team.description}</Text>
            
            <View style={styles.teamStats}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={18} color={AppColors.text.muted} />
                <Text style={styles.statText}>{team.memberCount} members</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={18} color={AppColors.text.muted} />
                <Text style={styles.statText}>Active {team.lastActive}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.openButton, { backgroundColor: team.color }]}
              onPress={navigateToTeam}
            >
              <Text style={styles.openButtonText}>Open Team</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Your Teams</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={require('@/assets/images/ProfilePictureIcon.png')} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.cardsContainer}>
        {renderCards()}
      </View>

      <View style={styles.indicatorContainer}>
        {teams.map((_, index) => (
          <View
            key={index}
            style={[
              styles.indicator,
              index === currentIndex ? styles.activeIndicator : null,
            ]}
          />
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={navigateToJoinTeam}>
          <Feather name="user-plus" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>Join Team</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.createButton} onPress={navigateToCreateTeam}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
          <Feather name="search" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>Find Teams</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.swipeHelp}>
        <Feather name="chevrons-left" size={20} color={AppColors.text.muted} />
        <Text style={styles.swipeHelpText}>Swipe to navigate</Text>
        <Feather name="chevrons-right" size={20} color={AppColors.text.muted} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: AppColors.text.dark,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  cardsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 7,
  },
  teamImageContainer: {
    height: CARD_HEIGHT * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#fff',
  },
  infoButton: {
    position: 'absolute',
    top: 15,
    right: 15,
  },
  cardContent: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flex: 1,
  },
  teamName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: AppColors.text.dark,
    marginBottom: 8,
  },
  teamDescription: {
    fontSize: 16,
    color: AppColors.text.muted,
    marginBottom: 16,
  },
  teamStats: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    marginLeft: 6,
    color: AppColors.text.muted,
  },
  openButton: {
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },
  openButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: AppColors.primary,
    width: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  footerButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontWeight: '500',
  },
  createButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: AppColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  swipeHelp: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 10,
  },
  swipeHelpText: {
    color: AppColors.text.muted,
    marginHorizontal: 8,
  },
});