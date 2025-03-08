// app/(teams)/[id]/index.tsx
import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/common/constants/AppColors';
import { styles } from '../../_constants/teamStyleSheet';

// Mock data for a team
const getMockTeam = (id: string) => ({
  id,
  name: id === '1' ? 'Beats Collective' : id === '2' ? 'Studio 42' : 'Electronic Vibes',
  description: 'A collaborative music production team focused on creating innovative sounds and pushing the boundaries of music production.',
  members: [
    { id: '1', name: 'Alex Johnson', role: 'Producer', image: require('@/assets/images/userAvatar.png') },
    { id: '2', name: 'Jamie Smith', role: 'Vocalist', image: require('@/assets/images/userAvatar.png') },
    { id: '3', name: 'Taylor Wong', role: 'Engineer', image: require('@/assets/images/userAvatar.png') },
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
          {/* Custom Back Button */}
          <TouchableOpacity 
            style={styles.customBackButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          
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

