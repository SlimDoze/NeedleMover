import { StyleSheet } from 'react-native';
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
    elevation: 3, // ✅ Schatten auf Android
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // ✅ Schatten auf iOS & Web
  },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 12,
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
    typeContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    typeCard: {
      flex: 1,
      padding: 16,
      borderWidth: 1,
      borderColor: '#E2E8F0',
      borderRadius: 8,
      backgroundColor: '#F9FAFC',
      marginHorizontal: 4,
      alignItems: 'center',
    },
    typeCardSelected: {
      borderColor: AppColors.primary,
      backgroundColor: `${AppColors.primary}10`, // 10% opacity
    },
    typeIcon: {
      marginBottom: 8,
    },
    typeName: {
      fontSize: 16,
      fontWeight: '600',
      color: AppColors.text.dark,
      marginBottom: 4,
    },
    typeNameSelected: {
      color: AppColors.primary,
    },
    typeDescription: {
      fontSize: 12,
      color: AppColors.text.muted,
      textAlign: 'center',
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