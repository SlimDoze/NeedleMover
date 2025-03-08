import { StyleSheet, Platform } from 'react-native';
import { AppColors } from '@/common/constants/AppColors';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: AppColors.background,
    },
    teamHeader: {
      padding: 20,
      paddingTop: 50, // Increased top padding for the back button
      paddingBottom: 40,
      position: 'relative', // For absolute positioning of back button
    },
    teamInfo: {
      alignItems: 'center', // Center content horizontally
    },
    teamName: {
      fontSize: 30, // Slightly larger for emphasis
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 10,
      textAlign: 'center', // Center text
    },
    teamDescription: {
      fontSize: 16,
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: 22,
      textAlign: 'center', // Center text
      maxWidth: '90%', // Prevent text from stretching too wide
    },
    customBackButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 10,
      padding: 8, // Larger touch target
      borderRadius: 20, // Make it slightly rounded
      backgroundColor: 'rgba(0, 0, 0, 0.1)', // Subtle background
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 16,
      backgroundColor: 'white',
      borderRadius: 12,
      marginTop: -20,
      marginHorizontal: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        android: {
          elevation: 3,
        },
        web: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      }),
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
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.05,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.05)',
        },
      }),
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
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        },
        android: {
          elevation: 5,
        },
        web: {
          boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.2)',
        },
      }),
    },
  });