// File: /components/channels/SettingsChannel.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, Switch } from 'react-native';
import { Feather } from '@expo/vector-icons';

// Mock data for team members
const mockTeamMembers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Producer', isAdmin: true },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'Vocalist', isAdmin: false },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'Engineer', isAdmin: false },
  { id: '4', name: 'Sarah Williams', email: 'sarah@example.com', role: 'Videographer', isAdmin: false },
];

// Available roles for users
const availableRoles = [
  'Producer',
  'Vocalist',
  'Engineer',
  'Videographer',
  'Songwriter',
  'Manager',
  'Designer',
];

interface SettingsChannelProps {
  spaceId: string;
  channelId: string;
}

const SettingsChannel: React.FC<SettingsChannelProps> = ({ spaceId, channelId }) => {
  const [members, setMembers] = useState(mockTeamMembers);
  const [showAddMember, setShowAddMember] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleInviteMember = () => {
    if (inviteEmail.trim() && inviteRole) {
      // In a real app, send an invitation email here
      setInviteEmail('');
      setInviteRole('');
      setShowAddMember(false);
    }
  };

  const toggleAdminStatus = (memberId) => {
    const updatedMembers = members.map(member => 
      member.id === memberId ? { ...member, isAdmin: !member.isAdmin } : member
    );
    setMembers(updatedMembers);
  };

  const openRoleSelector = (member) => {
    setSelectedMember(member);
    setShowRoleSelector(true);
  };

  const changeUserRole = (newRole) => {
    if (selectedMember) {
      const updatedMembers = members.map(member => 
        member.id === selectedMember.id ? { ...member, role: newRole } : member
      );
      setMembers(updatedMembers);
      setShowRoleSelector(false);
      setSelectedMember(null);
    }
  };

  const renderMemberItem = ({ item }) => (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-medium text-gray-800">{item.name}</Text>
        {item.isAdmin && (
          <View className="bg-blue-100 px-3 py-1 rounded-full">
            <Text className="text-blue-800 text-sm">Admin</Text>
          </View>
        )}
      </View>
      
      <Text className="text-gray-500 mb-1">{item.email}</Text>
      
      <View className="flex-row items-center mb-3">
        <TouchableOpacity 
          className="bg-gray-100 px-3 py-1 rounded-full flex-row items-center"
          onPress={() => openRoleSelector(item)}
        >
          <Text className="text-gray-700">{item.role}</Text>
          <Feather name="chevron-down" size={14} color="#6B7280" style={{ marginLeft: 4 }} />
        </TouchableOpacity>
      </View>
      
      <View className="flex-row justify-between items-center">
        <View className="flex-row">
          <TouchableOpacity className="flex-row items-center mr-4">
            <Feather name="message-square" size={16} color="#3B82F6" />
            <Text className="text-blue-500 ml-1">Message</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row items-center">
            <Feather name="user-minus" size={16} color="#EF4444" />
            <Text className="text-red-500 ml-1">Remove</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row items-center">
          <Text className="text-gray-700 mr-2">Admin</Text>
          <Switch
            value={item.isAdmin}
            onValueChange={() => toggleAdminStatus(item.id)}
            trackColor={{ false: "#D1D5DB", true: "#93C5FD" }}
            thumbColor={item.isAdmin ? "#3B82F6" : "#F9FAFB"}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View className="flex-1 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-semibold text-gray-800">User Roles</Text>
        <TouchableOpacity 
          className="bg-blue-600 rounded-lg px-4 py-2 flex-row items-center"
          onPress={() => setShowAddMember(true)}
        >
          <Feather name="user-plus" size={16} color="white" />
          <Text className="text-white ml-1">Invite</Text>
        </TouchableOpacity>
      </View>
      
      {showAddMember && (
        <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Invite Team Member</Text>
          
          <View className="mb-3">
            <Text className="text-gray-700 mb-1">Email</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={inviteEmail}
              onChangeText={setInviteEmail}
              placeholder="Enter email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Role</Text>
            <TouchableOpacity 
              className="border border-gray-300 rounded-lg px-3 py-2 flex-row justify-between items-center"
              onPress={() => setShowRoleSelector(true)}
            >
              <Text className={inviteRole ? "text-gray-800" : "text-gray-400"}>
                {inviteRole || "Select a role"}
              </Text>
              <Feather name="chevron-down" size={16} color="#6B7280" />
            </TouchableOpacity>
          </View>
          
          <View className="flex-row">
            <TouchableOpacity
              className="bg-gray-200 rounded-lg px-4 py-2 mr-2 flex-1"
              onPress={() => setShowAddMember(false)}
            >
              <Text className="text-gray-800 text-center">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-blue-600 rounded-lg px-4 py-2 flex-1"
              onPress={handleInviteMember}
              disabled={!inviteEmail.trim() || !inviteRole}
            >
              <Text className="text-white text-center">Send Invite</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {showRoleSelector && (
        <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Select Role
          </Text>
          
          <FlatList
            data={availableRoles}
            renderItem={({ item }) => (
              <TouchableOpacity 
                className="py-3 border-b border-gray-100"
                onPress={() => selectedMember ? changeUserRole(item) : setInviteRole(item)}
              >
                <Text className="text-gray-800">{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            className="mb-4"
          />
          
          <TouchableOpacity
            className="bg-gray-200 rounded-lg px-4 py-2"
            onPress={() => {
              setShowRoleSelector(false);
              setSelectedMember(null);
            }}
          >
            <Text className="text-gray-800 text-center">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <FlatList
        data={members}
        renderItem={renderMemberItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default SettingsChannel;