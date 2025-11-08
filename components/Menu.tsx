import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Text } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import FoodItemCard from './FoodItemCard'

export default function Menu({ session, id } : { session: Session, id: number}){
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [items, setItems] = useState<number[]>([])

  useEffect(() => {
    if (id) retrieveData()
    }, [id])

  async function retrieveData(){
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('food_items')
        .select(`id`)
        .eq('restaurant_id', id)
      if (error && status !== 406) {
        throw error
      }
      if (data) {
        const ids = data.map((item) => item.id as number)
        setItems(ids)
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
      <View>
        <Text>Menu:</Text>
        {items.map((id) =>(
          <View key = {id}>
            <FoodItemCard id ={id} session ={session}/>
          </View>
        ))}
      </View>
    )
  
}