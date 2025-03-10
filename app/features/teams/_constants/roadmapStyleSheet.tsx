import { StyleSheet, Platform } from 'react-native';
import { AppColors } from '@/common/constants/AppColors';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: AppColors.background,
    },
    scrollView: {
      flex: 1,
      padding: 20,
    },
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: AppColors.text.dark,
    },
    subtitle: {
      fontSize: 16,
      color: AppColors.text.muted,
      marginTop: 8,
    },
    actionsContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginBottom: 16,
    },
    addButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: AppColors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
    },
    addButtonText: {
      color: 'white',
      marginLeft: 8,
      fontWeight: '500',
    },
    roadmapContainer: {
      marginBottom: 20,
    },
    roadmapCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.05,
          shadowRadius: 3,
        },
        android: {
          elevation: 2,
        },
        web: {
          boxShadow: '0px 2px 3px rgba(0, 0, 0, 0.05)',
        },
      }),
    },
    roadmapHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    roadmapTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: AppColors.text.dark,
    },
    deadlineContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3F4F6',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 16,
    },
    deadlineIcon: {
      marginRight: 4,
    },
    deadlineText: {
      fontSize: 12,
      color: AppColors.text.muted,
    },
    roadmapDescription: {
      fontSize: 14,
      color: AppColors.text.muted,
      marginBottom: 16,
      lineHeight: 20,
    },
    progressContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressBar: {
      flex: 1,
      height: 6,
      backgroundColor: '#F3F4F6',
      borderRadius: 3,
      marginRight: 10,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      backgroundColor: AppColors.primary,
      borderRadius: 3,
    },
    progressText: {
      fontSize: 12,
      color: AppColors.text.muted,
      width: 36,
      textAlign: 'right',
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    emptyStateText: {
      color: AppColors.text.muted,
      fontSize: 14,
    },
  });