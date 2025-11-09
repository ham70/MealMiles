import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Session } from '@supabase/supabase-js'
import Menu from './Menu'
import { RestaurantType } from '../types'
import { Animated, View, Text, Alert, Image, StyleSheet } from 'react-native'
import Constants from 'expo-constants'

const HEADER_MAX_HEIGHT = 250
const HEADER_MIN_HEIGHT = 70

export default function Restaurant({ session, id }: {session: Session, id: number}) {
  const [loading, setLoading] = useState(true)
  const [restaurant, setRestaurant] = useState<RestaurantType | null>(null)

  useEffect(() => {
    if(id) retrieveData()
  }, [id])

  async function retrieveData(){
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('restaurant')
        .select(`name, address, photo_url`)
        .eq('id', id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        const the_restaurant: RestaurantType = {
          id,
          name: data.name as string,
          address: data.address as string,
          photo_url: data.photo_url
        }
        setRestaurant(the_restaurant)
      }

    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading || !restaurant) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading restaurant...</Text>
      </View>
    )
  }

  const scrollY = new Animated.Value(0)

  const headerTitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  })

  const STATUS_BAR_HEIGHT = Constants.statusBarHeight
  const TEXT_OFFSET = 10 // distance from top of sticky bar for the text

  return (
    <View style={{ flex: 1 }}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        {/* Large header content */}
        <View style={{ height: HEADER_MAX_HEIGHT }}>
          <Image
            source={{ uri: restaurant.photo_url }}
            style={{ width: '100%', height: '100%' }}
          />
          <View style={styles.largeHeaderInfo}>
            <Text style={styles.restaurantName}>{restaurant.name}</Text>
            <Text style={styles.restaurantAddress}>{restaurant.address}</Text>
          </View>
        </View>

        {/* Restaurant content */}
        <View style={{ padding: 16 }}>
          <Menu session={session} id={id}/>
        </View>
      </Animated.ScrollView>

      {/* Small sticky header */}
      <Animated.View
        style={[
          styles.stickyHeader,
          {
            height: HEADER_MIN_HEIGHT + STATUS_BAR_HEIGHT,
            opacity: headerTitleOpacity
          }
        ]}
      >
        <View style={{ height: STATUS_BAR_HEIGHT, backgroundColor: 'white' }} />
        <Text style={[styles.stickyTitle, { marginTop: TEXT_OFFSET }]}>
          {restaurant.name}
        </Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  largeHeaderInfo: {
    position: 'absolute',
    bottom: 16,
    left: 16,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  restaurantAddress: {
    fontSize: 16,
    color: 'white'
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white', // background will cover the top area
    justifyContent: 'flex-start',
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    zIndex: 10,
  },
  stickyTitle: {
    fontSize: 18,
    fontWeight: 'bold'
  }
})
