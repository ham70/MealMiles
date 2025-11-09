import { View, Text, StyleSheet } from 'react-native'
import { Session } from '@supabase/supabase-js'
import RestaurantList from './RestaurantList'

export default function Main({ session } : { session: Session }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Restaurants</Text>
      <RestaurantList session={session} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fefefe',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: '#222',
  },
})
