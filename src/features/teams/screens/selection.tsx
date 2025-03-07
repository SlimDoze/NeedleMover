import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Animated,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/common/constants/AppColors';
import { Platform } from 'react-native';

const { width, height } = Dimensions.get('window');
const CARD_HEIGHT = height * 0.25;
const CARD_WIDTH = width * 0.85;

// Team type definition
type Team = {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastActive: string;
  color: string;
  image: number;
};

// Create Team type
type CreateTeamCard = { 
  type: 'create'; 
  id: string; 
  color: string; 
};

// Union type for card items
type TeamCardItem = Team | CreateTeamCard;

// Type guard to check if the item is a Team
function isTeam(item: TeamCardItem): item is Team {
  return 'name' in item && 'description' in item;
}

// Mock data for teams
const mockTeams: Team[] = [
  {
    id: '1',
    name: 'Team #1',
    description: 'Hip hop production team focused on creating radio-ready instrumentals',
    memberCount: 5,
    lastActive: '2 hours ago',
    color: '#8A4FFF',
    image: require('@/assets/images/userAvatar.png')
  },
  {
    id: '2',
    name: 'Studio 42',
    description: 'Rock band and production studio working on our debut EP',
    memberCount: 4,
    lastActive: 'Yesterday',
    color: '#4F8AFF',
    image: require('@/assets/images/userAvatar.png')
  },
  {
    id: '3',
    name: 'Drum Collective',
    description: 'EDM production team specializing in house and techno tracks',
    memberCount: 3,
    lastActive: '3 days ago',
    color: '#FF4F8A',
    image: require('@/assets/images/userAvatar.png')
  },
  {
    id: '4',
    name: 'Acoustic Collective',
    description: 'Acoustic and folk music collaboration platform',
    memberCount: 6,
    lastActive: '1 week ago',
    color: '#4AFFB4',
    image: require('@/assets/images/userAvatar.png')
  }
];

export default function TeamSelectionScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const [cardItems, setCardItems] = useState<TeamCardItem[]>([]);

  useEffect(() => {
    setCardItems(determineTeamCards());
  }, []);

  // Determine whether to show create team card
  const determineTeamCards = (): TeamCardItem[] => {
    if (mockTeams.length === 0) {
      // No teams: first card is create team
      return [
        {
          type: 'create',
          id: 'create-team',
          color: AppColors.primary,
        },
        ...mockTeams
      ];
    } else if (mockTeams.length === 1) {
      // One team: second card is create team
      return [
        ...mockTeams,
        {
          type: 'create',
          id: 'create-team',
          color: AppColors.primary,
        }
      ];
    }
    // Three or more teams: no create team card
    return mockTeams;
  };

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: false,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setScrollOffset(offsetY);
      }
    }
  );

  const navigateToTeam = (teamId: string) => {
    // router.push(`./(teams)/${teamId}`);
    router.push(`./${teamId}`);
  };

  const onLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setScrollViewHeight(height);
  };

  const onContentSizeChange = (width: number, height: number) => {
    setContentHeight(height);
  };

  const renderCreateTeamCard = () => (
    <Animated.View 
      key="create-team"
      style={[
        styles.teamCard, 
        { 
          backgroundColor: AppColors.primary,
          opacity: 1,
        }
      ]}
    >
      <TouchableOpacity 
        style={styles.teamCardContent}
        onPress={() => router.push('./create')}
      >
        <View style={styles.teamHeader}>
          <Text style={styles.teamName}>Create Team</Text>
          <Feather 
            name="plus-circle" 
            size={24} 
            color="white" 
          />
        </View>
        
        <View style={styles.createTeamContent}>
          <Text style={styles.createTeamDescription}>
            {mockTeams.length === 0 
              ? "Start your first music collaboration" 
              : "Expand your network and create a new team"}
          </Text>
          <TouchableOpacity 
            style={styles.createTeamButton}
            onPress={() => router.push('./create')}
          >
            <Text style={styles.createTeamButtonText}>Create Team</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const renderTeamCard = (team: TeamCardItem, index: number) => {
    // If it's a create team card
    if ('type' in team && team.type === 'create') {
      return renderCreateTeamCard();
    }

    // At this point, we know it's a Team due to the type guard
    if (!isTeam(team)) {
      return null;
    }

    const isLastCard = index === cardItems.length - 1;
    const maxScrollPosition = contentHeight - scrollViewHeight;

    // Regular team card rendering logic
    const scale = scrollY.interpolate({
      inputRange: [
        (index - 1) * CARD_HEIGHT,
        index * CARD_HEIGHT,
        (index + 1) * CARD_HEIGHT
      ],
      outputRange: [0.8, 1, 0.8],
      extrapolate: 'clamp'
    });

    const opacity = scrollY.interpolate({
      inputRange: [
        (index - 1) * CARD_HEIGHT,
        index * CARD_HEIGHT,
        (index + 1) * CARD_HEIGHT
      ],
      outputRange: [0.6, 1, 0.6],
      extrapolate: 'clamp'
    });

    // Special handling for the first and last card
    const isInitialState = index === 0 && scrollOffset === 0;
    const isActiveLastCard = isLastCard && scrollOffset >= maxScrollPosition * 0.85;

    // If this is the last card and we're near the bottom of the scroll view,
    // ensure only the last card is fully highlighted
    let cardScale = scale;
    let cardOpacity = opacity;
    
    if (isActiveLastCard) {
      cardScale = new Animated.Value(1);
      cardOpacity = new Animated.Value(1);
    } else if (isLastCard && scrollOffset > (index - 0.5) * CARD_HEIGHT) {
      // Handle case where we're scrolling through the last card but not at the bottom
      cardScale = scale;
      cardOpacity = opacity;
    }

    return (
      <Animated.View 
        key={team.id} 
        style={[
          styles.teamCard, 
          { 
            backgroundColor: team.color,
            transform: [{ 
              scale: isInitialState ? 1 : cardScale 
            }],
            opacity: isInitialState ? 1 : cardOpacity,
          }
        ]}
      >
        <TouchableOpacity 
          style={styles.teamCardContent}
          onPress={() => navigateToTeam(team.id)}
        >
          <View style={styles.teamHeader}>
            <Text style={styles.teamName}>{team.name}</Text>
            <Ionicons 
              name="information-circle-outline" 
              size={24} 
              color="white" 
            />
          </View>
          
          <View style={styles.teamDetails}>
            <Image 
              source={team.image} 
              style={styles.teamImage} 
            />
            <View style={styles.teamInfo}>
              <Text style={styles.teamDescription} numberOfLines={2}>
                {team.description}
              </Text>
              <View style={styles.teamStats}>
                <View style={styles.statItem}>
                  <Ionicons name="people" size={16} color="white" />
                  <Text style={styles.statText}>
                    {team.memberCount} members
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="time-outline" size={16} color="white" />
                  <Text style={styles.statText}>
                    Active {team.lastActive}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.title}>Your Teams</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={require('@/assets/images/userAvatar.png')} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: height * 0.5 } // Increased bottom padding
        ]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={CARD_HEIGHT * 0.9}
        decelerationRate="fast"
        onLayout={onLayout}
        onContentSizeChange={onContentSizeChange}
      >
        {cardItems.map(renderTeamCard)}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.footerButton} 
          onPress={() => router.push('./join')}
        >
          <Feather name="user-plus" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>Join Team</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.createButton} 
          onPress={() => router.push('../(teams)/create')}
        >
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
          <Feather name="edit" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>Edit Team</Text>
        </TouchableOpacity>
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
  headerTitleContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: -1,
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
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: height * 0.1,
    alignItems: 'center',
  },
  teamCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    marginVertical: 10,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0px 4px 5px rgba(0, 0, 0, 0.2)',
      },
    }),
  },
  teamCardContent: {
    flex: 1,
    padding: 15,
    justifyContent: 'space-between',
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  teamDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  teamInfo: {
    flex: 1,
  },
  teamDescription: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
  },
  teamStats: {
    flexDirection: 'row',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  statText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 12,
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
  createTeamContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  createTeamDescription: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  createTeamButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  createTeamButtonText: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
});