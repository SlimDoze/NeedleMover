import { View, Text,TouchableOpacity, Alert, StyleSheet } from 'react-native'
import React from 'react'
import { router } from 'expo-router';

const index = () => {
  return (
    <View style = {styles.container}>
      <Text>index</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/AU_SU_EmailPassword')}>
          <Text style={styles.buttonText}>Sign-Up-1</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={() => router.push('/AU_SU_EmailVerification')}>
          <Text style={styles.buttonText}>Sign-Up-2</Text>
    </TouchableOpacity>
    


    {/* To Be Implemented */}
    {/* <TouchableOpacity style={styles.button} onPress={() => router.push('/AU_LI_EmailPassword')}>
          <Text style={styles.buttonText}>Log-In-1</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={() => router.push('/AU_LI_UsernameAvatar')}>
          <Text style={styles.buttonText}>Log-In-2</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={() => router.push('/AU_RE_EmailAdress')}>
          <Text style={styles.buttonText}>Reset-1</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={() => router.push('/AU_RE_EmailVerification')}>
          <Text style={styles.buttonText}>Reset-2</Text>
    </TouchableOpacity>

    <TouchableOpacity style={styles.button} onPress={() => router.push('/AU_RE_NewPassword')}>
          <Text style={styles.buttonText}>Reset-3</Text>
    </TouchableOpacity> */}
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    padding: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default index