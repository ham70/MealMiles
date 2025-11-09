import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import { View, Text, ScrollView, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native'
import Restaurant from './Restaurant'

interface RestaurantData {
  id: number
  name: string
  photo_url?: string
}

export default function RestaurantList({ session }: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [restaurants, setRestaurants] = useState<RestaurantData[]>([])

  useEffect(() => {
    retrieveRestaurants()
  }, [])

  async function retrieveRestaurants() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('restaurant')
        .select('id, name, photo_url')

      if (error && status !== 406) throw error

      if (data) {
        setRestaurants(data as RestaurantData[])
      }
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Local Favorites</Text>
      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          {restaurants.map((restaurant) => (
            <TouchableOpacity key={restaurant.id} style={styles.cardWrapper}>
              {restaurant.photo_url ? (
                <Image source={{ uri: restaurant.photo_url }} style={styles.image} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>No Image</Text>
                </View>
              )}
              <Text style={styles.name}>{restaurant.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
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
  loading: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 20,
  },
  list: {
    paddingBottom: 16,
  },
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    paddingBottom: 12,
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    width: '100%',
    height: 150,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    color: '#888',
    fontSize: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    padding: 12,
    color: '#222',
  },
})
