import React, { useState, useRef, useEffect } from 'react';
import { View, Text,TouchableOpacity, Image, Dimensions, Animated, ScrollView, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Feather, Ionicons } from '@expo/vector-icons';
import { AppColors } from '@/common/constants/AppColors';
import { styles } from '../_constants/selectionStyleSheet';
import { Team_Routes } from '../_constants/routes';
import { mockTeams } from '../_components/MockTeams';
import { ComponentCaptions } from '../_constants/componentCaptions';
import TeamCard from '../_components/TeamCard';
const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height * 0.5;

export default function TeamSelectionScreen() {
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [cardItems, setCardItems] = useState(mockTeams);

  useEffect(() => {
    setCardItems(mockTeams);
  }, []);

  const navigateToTeam = (teamId: string) => {
    router.push(`./${teamId}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{ComponentCaptions.teamSelection.header.title}</Text>
        <TouchableOpacity style={styles.profileButton}>
          <Image source={require("@/assets/images/userAvatar.png")} style={styles.profileImage} />
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollViewContent, { paddingBottom: height * 0.5 }]}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
          useNativeDriver: false,
        })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        snapToInterval={CARD_HEIGHT * 0.9}
        decelerationRate="fast"
      >
        {cardItems.map((team, index) => (
          <TeamCard key={team.id} team={team} onPress={navigateToTeam} scrollY={scrollY} index={index} cardHeight={CARD_HEIGHT} />
        ))}
      </Animated.ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerButton} onPress={() => router.push("./joinTeam")}>
          <Feather name="user-plus" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>{ComponentCaptions.teamSelection.footer.joinTeam}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createButton} onPress={() => router.push("./createTeam")}>
          <Feather name="plus" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerButton} onPress={() => {}}>
          <Feather name="edit" size={20} color="#fff" />
          <Text style={styles.footerButtonText}>{ComponentCaptions.teamSelection.footer.editTeam}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}