// This is an improved version of the card swiping mechanics for app/(teams)/selection.tsx
import React, { useState, useRef, useEffect } from 'react';
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
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/AppColors';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.55;
const SWIPE_THRESHOLD = width * 0.25;

// Mock data remains the same as your original file
const mockTeams = [
  {
    id: '1',
    name: 'Team #1',
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
    name: 'Drum Collective',
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Separate animation values for each card for better control
  const position = useRef(new Animated.ValueXY()).current;
  const secondCardScale = useRef(new Animated.Value(0.95)).current;
  const secondCardTranslateY = useRef(new Animated.Value(10)).current;
  
  // Reset animations when currentIndex changes
  useEffect(() => {
    position.setValue({ x: 0, y: 0 });
    secondCardScale.setValue(0.95);
    secondCardTranslateY.setValue(10);
  }, [currentIndex]);

  const rotation = position.x.interpolate({
    inputRange: [-width / 2, 0, width / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  // Function to handle navigating to a team detail page
  const navigateToTeam = (teamId: string) => {
    router.push(`../(teams)/${teamId}`);
  };

  // Handle clicking the open button directly (not a swipe)
  const handleOpenTeam = () => {
    navigateToTeam(teams[currentIndex].id);
  };

  // Function to handle going to the next team
  const goToNextTeam = () => {
    setIsTransitioning(true);
    
    // Animate current card off to the left
    Animated.timing(position, {
      toValue: { x: -width, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Update index after animation
      const nextIndex = (currentIndex + 1) % teams.length;
      setCurrentIndex(nextIndex);
      
      // Reset position for the new card
      position.setValue({ x: 0, y: 0 });
      
      // Allow swiping again
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    });
  };
  
  // Function to handle going to the previous team
  const goToPreviousTeam = () => {
    setIsTransitioning(true);
    
    // Animate current card off to the right
    Animated.timing(position, {
      toValue: { x: width, y: 0 },
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      // Update index after animation
      const prevIndex = (currentIndex - 1 + teams.length) % teams.length;
      setCurrentIndex(prevIndex);
      
      // Reset position for the new card
      position.setValue({ x: 0, y: 0 });
      
      // Allow swiping again
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    });
  };
  
  // Improved PanResponder with clearer conditions
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isTransitioning,
      onMoveShouldSetPanResponder: (_, gestureState) => 
        !isTransitioning && (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5),
      
      onPanResponderGrant: () => {
        // Use extractOffset instead of accessing _value directly to avoid TypeScript errors
        position.extractOffset();
      },
      
      onPanResponderMove: (_, gestureState) => {
        // Only move card horizontally
        position.setValue({
          x: gestureState.dx,
          y: 0
        });
        
        // Animate the second card slightly based on the first card's position
        if (gestureState.dx < 0) {
          // When swiping left (showing next), make the next card bigger
          const scaleValue = 0.95 + Math.min(Math.abs(gestureState.dx) / width * 0.05, 0.05);
          secondCardScale.setValue(scaleValue);
          secondCardTranslateY.setValue(10 - (Math.abs(gestureState.dx) / width * 10));
        } else if (gestureState.dx > 0) {
          // When swiping right (showing previous), also animate
          const scaleValue = 0.95 + Math.min(Math.abs(gestureState.dx) / width * 0.05, 0.05);
          secondCardScale.setValue(scaleValue);
          secondCardTranslateY.setValue(10 - (Math.abs(gestureState.dx) / width * 10));
        }
      },
      
      onPanResponderRelease: (_, gestureState) => {
        position.flattenOffset();
        
        // Determine if swipe is significant enough to trigger action
        if (gestureState.dx > SWIPE_THRESHOLD) {
          // Swiped right - go to previous team
          goToPreviousTeam();
          
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          // Swiped left - go to next team
          goToNextTeam();
        } else {
          // Not swiped far enough - spring back to center
          Animated.parallel([
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.spring(secondCardScale, {
              toValue: 0.95,
              friction: 5,
              useNativeDriver: true,
            }),
            Animated.spring(secondCardTranslateY, {
              toValue: 10,
              friction: 5,
              useNativeDriver: true,
            })
          ]).start();
        }
      },
    })
  ).current;

  // Function to render the cards
  const renderCards = () => {
    if (teams.length === 0) return null;
    
    const cards = [];
    
    // Current card (top card)
    if (currentIndex < teams.length) {
      const currentTeam = teams[currentIndex];
      cards.push(
        <Animated.View
          key={`current-${currentIndex}`}
          style={[
            styles.card,
            {
              transform: [
                { translateX: position.x },
                { translateY: position.y },
                { rotate: rotation },
              ],
              zIndex: 2,
            },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Card content same as your original code */}
          <View style={[styles.teamImageContainer, { backgroundColor: currentTeam.color }]}>
            <Image source={currentTeam.image} style={styles.teamImage} />
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.teamName}>{currentTeam.name}</Text>
            <Text style={styles.teamDescription}>{currentTeam.description}</Text>
            
            <View style={styles.teamStats}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={18} color={AppColors.text.muted} />
                <Text style={styles.statText}>{currentTeam.memberCount} members</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={18} color={AppColors.text.muted} />
                <Text style={styles.statText}>Active {currentTeam.lastActive}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.openButton, { backgroundColor: currentTeam.color }]}
              onPress={handleOpenTeam}
            >
              <Text style={styles.openButtonText}>Open Team</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    // Next/Previous card (card below current)
    // Determine which card to show below based on swipe direction
    // This is a simplification - in a full implementation you might want to keep
    // track of swipe direction and show appropriate next/prev card
    const nextIndex = (currentIndex + 1) % teams.length;
    const prevIndex = (currentIndex - 1 + teams.length) % teams.length;
    
    // For now we'll always show the next card as the second card
    // In a more complex implementation, you might change this based on swipe direction
    const secondCardIndex = nextIndex;
    
    if (secondCardIndex !== currentIndex) {
      const secondTeam = teams[secondCardIndex];
      cards.push(
        <Animated.View
          key={`second-${secondCardIndex}`}
          style={[
            styles.card, 
            {
              transform: [
                { scale: secondCardScale },
                { translateY: secondCardTranslateY },
              ],
              zIndex: 1,
            }
          ]}
        >
          {/* Next card content same as your original code */}
          <View style={[styles.teamImageContainer, { backgroundColor: secondTeam.color }]}>
            <Image source={secondTeam.image} style={styles.teamImage} />
            <TouchableOpacity style={styles.infoButton}>
              <Ionicons name="information-circle-outline" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.teamName}>{secondTeam.name}</Text>
            <Text style={styles.teamDescription}>{secondTeam.description}</Text>
            
            <View style={styles.teamStats}>
              <View style={styles.statItem}>
                <Ionicons name="people" size={18} color={AppColors.text.muted} />
                <Text style={styles.statText}>{secondTeam.memberCount} members</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="time-outline" size={18} color={AppColors.text.muted} />
                <Text style={styles.statText}>Active {secondTeam.lastActive}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={[styles.openButton, { backgroundColor: secondTeam.color }]}
              disabled={true}
            >
              <Text style={styles.openButtonText}>Open Team</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    return cards;
  };

  // Main render for the component
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
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push('../(teams)/join')}>
          <Feather name="user-plus" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>Join Team</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.createButton} onPress={() => router.push('../(teams)/create')}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
          <Feather name="search" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>Find Teams</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.swipeHelp}>
        <Feather name="chevrons-left" size={20} color={AppColors.text.muted} />
        <Text style={styles.swipeHelpText}>Wischen zum Navigieren zwischen Teams</Text>
        <Feather name="chevrons-right" size={20} color={AppColors.text.muted} />
      </View>
    </SafeAreaView>
  );
}

// Styles remain mostly the same as your original code
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