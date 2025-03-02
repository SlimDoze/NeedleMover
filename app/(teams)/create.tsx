// // File: /app/teams/create.tsx
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useRouter } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';

// export default function CreateTeamScreen() {
//   const [teamName, setTeamName] = useState('');
//   const [teamDescription, setTeamDescription] = useState('');
//   const router = useRouter();

//   const handleCreateTeam = () => {
//     // Implement team creation logic here
//     // After creating the team, navigate to the team home
//     router.replace('/teams');
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-gray-50">
//       <StatusBar style="dark" />
//       <ScrollView className="flex-1 px-6 py-8">
//         <View className="mb-8">
//           <Text className="text-3xl font-bold text-gray-800">Create a New Team</Text>
//           <Text className="text-lg text-gray-600 mt-2">Set up your music collaboration team</Text>
//         </View>
        
//         <View className="bg-white rounded-xl shadow-sm p-6 mb-6">
//           <View className="mb-4">
//             <Text className="text-gray-700 mb-2">Team Name</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800"
//               placeholder="Enter team name"
//               value={teamName}
//               onChangeText={setTeamName}
//             />
//           </View>
          
//           <View className="mb-6">
//             <Text className="text-gray-700 mb-2">Description</Text>
//             <TextInput
//               className="border border-gray-300 rounded-lg px-4 py-3 text-gray-800 h-32"
//               placeholder="Describe your team and its goals"
//               value={teamDescription}
//               onChangeText={setTeamDescription}
//               multiline
//               textAlignVertical="top"
//             />
//           </View>
//         </View>
        
//         <View className="flex-row mb-8">
//           <TouchableOpacity
//             className="bg-gray-200 rounded-lg py-3 flex-1 mr-2"
//             onPress={() => router.back()}
//           >
//             <Text className="text-gray-800 text-center font-semibold">Cancel</Text>
//           </TouchableOpacity>
          
//           <TouchableOpacity
//             className="bg-blue-600 rounded-lg py-3 flex-1 ml-2"
//             onPress={handleCreateTeam}
//           >
//             <Text className="text-white text-center font-semibold">Create Team</Text>
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }
