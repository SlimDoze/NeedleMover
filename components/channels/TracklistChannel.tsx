// File: /components/channels/TracklistChannel.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { Feather } from '@expo/vector-icons';
import DraggableFlatList, { 
  RenderItemParams,
  ScaleDecorator 
} from 'react-native-draggable-flatlist';

// Define Track interface
interface Track {
  id: string;
  title: string;
  duration: string;
  status: 'completed' | 'in_progress' | 'planned';
}

// Mock data for tracklist
const mockTracks: Track[] = [
  { id: '1', title: 'Intro', duration: '1:45', status: 'completed' },
  { id: '2', title: 'Main Song', duration: '3:30', status: 'in_progress' },
  { id: '3', title: 'Interlude', duration: '0:55', status: 'planned' },
  { id: '4', title: 'Finale', duration: '4:15', status: 'planned' },
];

interface TracklistChannelProps {
  spaceId: string;
  channelId: string;
}

const TracklistChannel: React.FC<TracklistChannelProps> = ({ spaceId, channelId }) => {
  const [tracks, setTracks] = useState<Track[]>(mockTracks);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const [newTrackTitle, setNewTrackTitle] = useState('');
  const [newTrackDuration, setNewTrackDuration] = useState('');

  const getStatusColor = (status: Track['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddTrack = () => {
    if (newTrackTitle.trim()) {
      const newTrack: Track = {
        id: Date.now().toString(),
        title: newTrackTitle,
        duration: newTrackDuration || '0:00',
        status: 'planned',
      };
      
      setTracks([...tracks, newTrack]);
      setNewTrackTitle('');
      setNewTrackDuration('');
      setShowAddTrack(false);
    }
  };

  const renderTrackItem = ({ item, drag, isActive }: RenderItemParams<Track>) => (
    <TouchableOpacity
      onLongPress={drag}
      className={`flex-row items-center bg-white rounded-lg shadow-sm p-4 mb-3 ${isActive ? 'bg-blue-50 border border-blue-300' : ''}`}
    >
      <Feather name="menu" size={20} color="#9CA3AF" />
      <View className="flex-1 ml-3">
        <Text className="text-lg font-medium text-gray-800">{item.title}</Text>
        <Text className="text-gray-500">Duration: {item.duration}</Text>
      </View>
      <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
        <Text className="text-sm">
          {item.status === 'completed' ? 'Completed' : 
           item.status === 'in_progress' ? 'In Progress' : 'Planned'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-semibold text-gray-800">Track List</Text>
        <TouchableOpacity 
          className="bg-blue-600 rounded-lg px-4 py-2"
          onPress={() => setShowAddTrack(true)}
        >
          <Text className="text-white">Add Track</Text>
        </TouchableOpacity>
      </View>
      
      {showAddTrack && (
        <View className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Add New Track</Text>
          
          <View className="mb-3">
            <Text className="text-gray-700 mb-1">Track Title</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={newTrackTitle}
              onChangeText={setNewTrackTitle}
              placeholder="Enter track title"
            />
          </View>
          
          <View className="mb-4">
            <Text className="text-gray-700 mb-1">Duration (MM:SS)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-3 py-2"
              value={newTrackDuration}
              onChangeText={setNewTrackDuration}
              placeholder="e.g. 3:45"
              keyboardType="numbers-and-punctuation"
            />
          </View>
          
          <View className="flex-row">
            <TouchableOpacity
              className="bg-gray-200 rounded-lg px-4 py-2 mr-2 flex-1"
              onPress={() => setShowAddTrack(false)}
            >
              <Text className="text-gray-800 text-center">Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              className="bg-blue-600 rounded-lg px-4 py-2 flex-1"
              onPress={handleAddTrack}
            >
              <Text className="text-white text-center">Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      <DraggableFlatList
        data={tracks}
        renderItem={renderTrackItem}
        keyExtractor={(item) => item.id}
        onDragEnd={({ data }) => setTracks(data)}
      />
    </View>
  );
};

export default TracklistChannel;