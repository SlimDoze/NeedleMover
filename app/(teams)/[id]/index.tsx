// app/(teams)/[id]/index.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/constants/AppColors';

// Mock data for a team
const getMockTeam = (id: string) => ({
  id,
  name: id === '1' ? 'Beats Collective' : id === '2' ? 'Studio 42' : 'Electronic Vibes',
  description: 'A collaborative music production team focused on creating innovative sounds and pushing the boundaries of music production.',
  members: [
    { id: '1', name: 'Alex Johnson', role: 'Producer', image: require('@/assets/images/ProfilePictureIcon.png') },
    { id: '2', name: 'Jamie Smith', role: 'Vocalist', image: require('@/assets/images/ProfilePictureIcon.png') },
    { id: '3', name: 'Taylor Wong', role: 'Engineer', image: require('@/assets/images/ProfilePictureIcon.png') },
  ],
  color: id === '1' ? '#8A4FFF' : id === '2' ? '#4F8AFF' : '#FF4F8A',
  spaces: [
    { id: '1', name: 'Summer EP', type: 'multi', lastActive: '2 hours ago' },
    { id: '2', name: 'New Single', type: 'single', lastActive: 'Yesterday' },
  ],
});

export default function TeamDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const teamId = Array.isArray(id) ? id[0] : id || '1';
  const team = getMockTeam(teamId);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      <ScrollView>
        {/* Team Header */}
        <View style={[styles.teamHeader, { backgroundColor: team.color }]}>
          <View style={styles.teamInfo}>
            <Text style={styles.teamName}>{team.name}</Text>
            <Text style={styles.teamDescription}>{team.description}</Text>
          </View>
        </View>
        
        {/* Quick Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push(`../(teams)/${teamId}/roadmap`)}
          >
            <Feather name="map" size={24} color={AppColors.primary} />
            <Text style={styles.actionText}>Roadmap</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {}}
          >
            <Feather name="users" size={24} color={AppColors.primary} />
            <Text style={styles.actionText}>Members</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {}}
          >
            <Feather name="settings" size={24} color={AppColors.primary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
        
        {/* Team Spaces */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Workspaces</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => router.push(`../(teams)/${teamId}/create-space`)}
            >
              <Feather name="plus" size={20} color="white" />
              <Text style={styles.addButtonText}>New Space</Text>
            </TouchableOpacity>
          </View>
          
          {team.spaces.map(space => (
            <TouchableOpacity 
              key={space.id}
              style={styles.spaceCard}
              onPress={() => {}}
            >
              <View style={styles.spaceIconContainer}>
                <Ionicons 
                  name={space.type === 'single' ? 'musical-note' : 'albums'} 
                  size={24} 
                  color={team.color} 
                />
              </View>
              <View style={styles.spaceInfo}>
                <Text style={styles.spaceName}>{space.name}</Text>
                <Text style={styles.spaceType}>
                  {space.type === 'single' ? 'Single Release' : 'Multi-Track Release'}
                </Text>
              </View>
              <Text style={styles.spaceActivity}>{space.lastActive}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* Team Members */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Team Members</Text>
          </View>
          
          {team.members.map(member => (
            <View key={member.id} style={styles.memberCard}>
              <Image source={member.image} style={styles.memberImage} />
              <View style={styles.memberInfo}>
                <Text style={styles.memberName}>{member.name}</Text>
                <Text style={styles.memberRole}>{member.role}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      
      {/* Floating Action Button */}
      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: team.color }]}
        onPress={() => router.push(`../(teams)/${teamId}/create-space`)}
      >
        <Feather name="plus" size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  teamHeader: {
    padding: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  teamInfo: {},
  teamName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  teamDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: -20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionText: {
    marginTop: 4,
    color: AppColors.text.muted,
    fontSize: 12,
  },
  sectionContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: AppColors.text.dark,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  addButtonText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  },
  spaceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  spaceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(138, 79, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  spaceInfo: {
    flex: 1,
  },
  spaceName: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text.dark,
    marginBottom: 4,
  },
  spaceType: {
    fontSize: 14,
    color: AppColors.text.muted,
  },
  spaceActivity: {
    fontSize: 12,
    color: AppColors.text.muted,
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F1F1',
  },
  memberImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontWeight: '500',
    color: AppColors.text.dark,
  },
  memberRole: {
    fontSize: 14,
    color: AppColors.text.muted,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});