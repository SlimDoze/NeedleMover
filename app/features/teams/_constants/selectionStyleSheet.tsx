import { StyleSheet, Dimensions, Platform } from 'react-native';
import { AppColors } from '@/common/constants/AppColors';

// Define constants at the top of the file
const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.85;
const CARD_HEIGHT = height * 0.5;

export const styles = StyleSheet.create({
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