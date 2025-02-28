
// File: /components/channels/TracksChannel.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

// Mock data for tracks
const mockMixes = [
  { id: '1', title: 'Main Song (Mix v1)', filename: 'main_song_mix_v1.wav', size: '8.7 MB', engineer: 'Mix Master', date: '2023-06-02' },
  { id: '2', title: 'Main Song (Mix v2)', filename: 'main_song_mix_v2.wav', size: '9.1 MB', engineer: 'Mix Master', date: '2023-06-05' },
];

const mockMasters = [
  { id: '1', title: 'Main Song (Master)', filename: 'main_song_master.wav', size: '9.3 MB', engineer: 'Master King', date: '2023-06-10' },
];

const mockSessions = [
  { id: '1', title: 'Vocal Session', filename: 'vocals.zip', size: '45.2 MB', engineer: 'Vocal Tech', date: '2023-05-25' },
];

const mockCovers = [
  { id: '1', title: 'Album Cover Draft', filename: 'cover_draft.png', size: '3.5 MB', designer: 'Art Designer', date: '2023-05-20' },
  { id: '2', title: 'Album Cover Final', filename: 'cover_final.png', size: '5.2 MB', designer: 'Art Designer', date: '2023-06-01' },
];

interface TracksChannelProps {
  spaceId: string;
  channelId: string;
}

const TracksChannel: React.FC<TracksChannelProps> = ({ spaceId, channelId }) => {
  const [activeTab, setActiveTab] = useState('mix'); // 'mix', 'master', 'session', 'cover'
  const [mixes, setMixes] = useState(mockMixes);
  const [masters, setMasters] = useState(mockMasters);
  const [sessions, setSessions] = useState(mockSessions);
  const [covers, setCovers] = useState(mockCovers);

  const getActiveData = () => {
    switch (activeTab) {
      case 'mix':
        return mixes;
      case 'master':
        return masters;
      case 'session':
        return sessions;
      case 'cover':
        return covers;
      default:
        return [];
    }
  };

  const getFileIcon = (tab) => {
    switch (tab) {
      case 'mix':
      case 'master':
        return 'music';
      case 'session':
        return 'mic';
      case 'cover':
        return 'image';
      default:
        return 'file';
    }
  };

  const pickDocument = async () => {
    try {
      let type = '*/*';
      if (activeTab === 'cover') {
        type = 'image/*';
      } else if (activeTab === 'mix' || activeTab === 'master') {
        type = 'audio/*';
      }
      
      const result = await DocumentPicker.getDocumentAsync({
        type,
        copyToCacheDirectory: true,
      });
      
      if (result.type === 'success') {
        // Process the file based on active tab
        const newFile = {
          id: Date.now().toString(),
          title: result.name.split('.')[0],
          filename: result.name,
          size: `${(result.size / (1024 * 1024)).toFixed(1)} MB`,
          date: new Date().toISOString().split('T')[0],
        };
        
        switch (activeTab) {
          case 'mix':
            setMixes([...mixes, { ...newFile, engineer: 'You' }]);
            break;
          case 'master':
            setMasters([...masters, { ...newFile, engineer: 'You' }]);
            break;
          case 'session':
            setSessions([...sessions, { ...newFile, engineer: 'You' }]);
            break;
          case 'cover':
            setCovers([...covers, { ...newFile, designer: 'You' }]);
            break;
        }
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  };

  const renderFileItem = ({ item }) => (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
          <Feather name={getFileIcon(activeTab)} size={20} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-medium text-gray-800">{item.title}</Text>
          <Text className="text-gray-500">{item.filename}</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-500">{item.size}</Text>
        {item.engineer && <Text className="text-gray-500">By: {item.engineer}</Text>}
        {item.designer && <Text className="text-gray-500">By: {item.designer}</Text>}
        <Text className="text-gray-500">{item.date}</Text>
      </View>
      
      <View className="flex-row mt-3">
        {(activeTab === 'mix' || activeTab === 'master') && (
          <TouchableOpacity className="flex-row items-center mr-4">
            <Feather name="play" size={16} color="#3B82F6" />
            <Text className="text-blue-500 ml-1">Play</Text>
          </TouchableOpacity>
        )}
        
        {activeTab === 'cover' && (
          <TouchableOpacity className="flex-row items-center mr-4">
            <Feather name="eye" size={16} color="#3B82F6" />
            <Text className="text-blue-500 ml-1">View</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity className="flex-row items-center mr-4">
          <Feather name="download" size={16} color="#3B82F6" />
          <Text className="text-blue-500 ml-1">Download</Text>
        </TouchableOpacity>
        
        <TouchableOpacity className="flex-row items-center">
          <Feather name="trash-2" size={16} color="#EF4444" />
          <Text className="text-red-500 ml-1">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 p-6">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-xl font-semibold text-gray-800">Tracks</Text>
        <TouchableOpacity 
          className="bg-blue-600 rounded-lg px-4 py-2 flex-row items-center"
          onPress={pickDocument}
        >
          <Feather name="upload" size={16} color="white" />
          <Text className="text-white ml-1">Upload</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
        <View className="flex-row bg-gray-200 rounded-lg p-1">
          {[
            { id: 'mix', label: 'Mix' },
            { id: 'master', label: 'Master' },
            { id: 'session', label: 'Session Files' },
            { id: 'cover', label: 'Cover' },
          ].map((tab) => (
            <TouchableOpacity 
              key={tab.id}
              className={`px-4 py-2 rounded-md ${activeTab === tab.id ? 'bg-white' : ''}`}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text className={`text-center font-medium ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-600'}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <FlatList
        data={getActiveData()}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default TracksChannel;