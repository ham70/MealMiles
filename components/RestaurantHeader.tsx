import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert, Text } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Session } from '@supabase/supabase-js'
import Menu from './Menu'

export default function RestaurantHeader({ session, id } : { session: Session, id: string}){
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [items, setItems] = useState<number[]>([])

  useEffect(() => {
    if (id) retrieveData()
    }, [id])

    async function retrieveData(){
      try {
      setLoading(true)
      //if (!session?.user) throw new Error('No user on the session!')
      const { data: restaurantData, error: restaurantError, status: restaurantStatus } = await supabase
        .from('restaurant')
        .select(`name, address`)
        .eq('id', id)
        .single()
      if (restaurantError && restaurantStatus !== 406) {
        throw restaurantError
      }
      if (restaurantData) {
        setName(restaurantData.name)
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
        <Text>{name}</Text>
      </View>
    )
  
}