// File: /components/channels/InstrumentalsChannel.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';

// Define interfaces for our file items
interface FileItem {
  id: string;
  title: string;
  filename: string;
  size: string;
  date: string;
  producer?: string; // Optional for stems
}

// Mock data for instrumentals
const mockInstrumentals: FileItem[] = [
  { id: '1', title: 'Main Beat', filename: 'main_beat.mp3', size: '5.4 MB', producer: 'DJ Beats', date: '2023-05-15' },
  { id: '2', title: 'Ambient Intro', filename: 'ambient_intro.wav', size: '3.2 MB', producer: 'Ambient King', date: '2023-05-18' },
];

// Mock data for beat stems
const mockBeatStems: FileItem[] = [
  { id: '1', title: 'Drums', filename: 'drums.wav', size: '2.1 MB', date: '2023-05-15' },
  { id: '2', title: 'Bass', filename: 'bass.wav', size: '1.7 MB', date: '2023-05-15' },
  { id: '3', title: 'Melody', filename: 'melody.wav', size: '1.9 MB', date: '2023-05-15' },
];

interface InstrumentalsChannelProps {
  spaceId: string;
  channelId: string;
}

const InstrumentalsChannel: React.FC<InstrumentalsChannelProps> = ({ spaceId, channelId }) => {
  const [activeTab, setActiveTab] = useState('beats'); // 'beats' or 'stems'
  const [beats, setBeats] = useState<FileItem[]>(mockInstrumentals);
  const [stems, setStems] = useState<FileItem[]>(mockBeatStems);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        // Process the file based on active tab
        const newFile: FileItem = {
          id: Date.now().toString(),
          title: file.name ? file.name.split('.')[0] : 'Unnamed File',
          filename: file.name || 'unnamed.file',
          size: file.size ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : 'Unknown size',
          producer: activeTab === 'beats' ? 'You' : undefined,
          date: new Date().toISOString().split('T')[0],
        };
        
        if (activeTab === 'beats') {
          setBeats([...beats, newFile]);
        } else {
          setStems([...stems, newFile]);
        }
      }
    } catch (error) {
      console.log('Error picking document:', error);
    }
  };

  const renderFileItem = ({ item }: { item: FileItem }) => (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-3">
      <View className="flex-row items-center mb-2">
        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center mr-3">
          <Feather name="music" size={20} color="#3B82F6" />
        </View>
        <View className="flex-1">
          <Text className="text-lg font-medium text-gray-800">{item.title}</Text>
          <Text className="text-gray-500">{item.filename}</Text>
        </View>
      </View>
      
      <View className="flex-row justify-between mt-2">
        <Text className="text-gray-500">{item.size}</Text>
        {item.producer && <Text className="text-gray-500">By: {item.producer}</Text>}
        <Text className="text-gray-500">{item.date}</Text>
      </View>
      
      <View className="flex-row mt-3">
        <TouchableOpacity className="flex-row items-center mr-4">
          <Feather name="play" size={16} color="#3B82F6" />
          <Text className="text-blue-500 ml-1">Play</Text>
        </TouchableOpacity>
        
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
        <Text className="text-xl font-semibold text-gray-800">Instrumentals</Text>
        <TouchableOpacity 
          className="bg-blue-600 rounded-lg px-4 py-2 flex-row items-center"
          onPress={pickDocument}
        >
          <Feather name="upload" size={16} color="white" />
          <Text className="text-white ml-1">Upload</Text>
        </TouchableOpacity>
      </View>
      
      <View className="flex-row bg-gray-200 rounded-lg mb-6 p-1">
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-md ${activeTab === 'beats' ? 'bg-white' : ''}`}
          onPress={() => setActiveTab('beats')}
        >
          <Text className={`text-center font-medium ${activeTab === 'beats' ? 'text-blue-600' : 'text-gray-600'}`}>
            Beats
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className={`flex-1 py-2 rounded-md ${activeTab === 'stems' ? 'bg-white' : ''}`}
          onPress={() => setActiveTab('stems')}
        >
          <Text className={`text-center font-medium ${activeTab === 'stems' ? 'text-blue-600' : 'text-gray-600'}`}>
            Beat Stems
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={activeTab === 'beats' ? beats : stems}
        renderItem={renderFileItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default InstrumentalsChannel;