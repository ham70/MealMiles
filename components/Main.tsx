import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function Main({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Main Screen</Text>
      <Button
        title="Go to Select Roles"
        onPress={() => navigation.navigate('SelectRoles')} // 👈 navigate to SelectRoles screen
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
});
