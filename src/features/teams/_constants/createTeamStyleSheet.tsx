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
    formCard: {
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 20,
      marginBottom: 24,
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
    inputContainer: {
      marginBottom: 16,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 8,
      color: AppColors.text.dark,
    },
    input: {
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      backgroundColor: '#F9FAFC',
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 30,
    },
    button: {
      flex: 1,
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: '#E2E8F0',
      marginRight: 8,
    },
    createButton: {
      backgroundColor: AppColors.primary,
      marginLeft: 8,
    },
    cancelButtonText: {
      color: AppColors.text.dark,
      fontWeight: '600',
    },
    createButtonText: {
      color: 'white',
      fontWeight: '600',
    },
  });