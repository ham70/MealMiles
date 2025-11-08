import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Text } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { Image } from 'expo-image'

export default function FoodItemCard({ session, id } : { session: Session, id: number }) {
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cost, setCost] = useState(0.0)
  const [photo_url, setPhoto] = useState('')

  useEffect(() => {
    if(id) getFoodItemData()
  }, [id])

  async function getFoodItemData(){
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('food_items')
        .select(`name, description, cost, photo_path`)
        .eq('id', id)
        .single()
      if (error && status !== 406) throw error

      if (data) {
        setName(data.name)
        setDescription(data.description)
        setCost(data.cost)
        setPhoto(data.photo_path)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.cardWrapper}>
      { loading ? (
        <Text style={styles.loadingText}>Loading ...</Text>
      ) : (
        <View style={styles.card}>
          {photo_url ? (
            <Image
              source={photo_url}
              style={styles.image}
            />
          ) : null}
          <View style={styles.info}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.description}>{description}</Text>
            <Text style={styles.cost}>${cost.toFixed(2)}</Text>
          </View>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginVertical: 10,
    paddingHorizontal: 16,
  },
  loadingText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  info: {
    padding: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  cost: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
})
