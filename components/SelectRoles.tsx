import { useState, useEffect } from 'react' 
import { supabase } from '../lib/supabase'
import { StyleSheet, View, Alert } from 'react-native'
import { Button, Input } from '@rneui/themed'
import { Checkbox } from 'expo-checkbox'
import { useAuth } from '../contexts/AuthContext' // 👈 import your hook

export default function SelectRoles({ navigation }) { // 👈 add navigation prop
  const { session } = useAuth() // 👈 get session from context
  const [loading, setLoading] = useState(true)
  const [firstname, setFirstname] = useState('')
  const [lastname, setLastname] = useState('')
  const [isRestaurant, setRestaurant] = useState(false)

  useEffect(() => {
    if (session) getProfile()
  }, [session])

  async function getProfile() {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`first_name, last_name, is_restaurant`)
        .eq('id', session.user.id)
        .single()

      if (error && status !== 406) throw error

      if (data) {
        setFirstname(data.first_name)
        setLastname(data.last_name)
        setRestaurant(data.is_restaurant)
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile({
    firstName,
    lastName,
    isRestaurant,
  }: {
    firstName: string
    lastName: string
    isRestaurant: boolean
  }) {
    try {
      setLoading(true)
      if (!session?.user) throw new Error('No user on the session!')

      const updates = {
        id: session.user.id,
        first_name: firstName,
        last_name: lastName,
        is_restaurant: isRestaurant,
        updated_at: new Date(),
      }

      const { error } = await supabase.from('profiles').upsert(updates)
      if (error) throw error
      Alert.alert('Profile updated!')
    } catch (error) {
      if (error instanceof Error) Alert.alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input label="Email" value={session?.user?.email} disabled />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="First Name"
          value={firstname || ''}
          onChangeText={(text) => setFirstname(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Last Name"
          value={lastname || ''}
          onChangeText={(text) => setLastname(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Checkbox
          value={isRestaurant}
          onValueChange={setRestaurant}
          color={isRestaurant ? '#4630EB' : undefined}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? 'Loading ...' : 'Update'}
          onPress={() =>
            updateProfile({
              firstName: firstname,
              lastName: lastname,
              isRestaurant,
            })
          }
          disabled={loading}
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button title="Sign Out" onPress={() => supabase.auth.signOut()} />
      </View>

      {/* 👇 New button to go back to Main */}
      <View style={styles.verticallySpaced}>
        <Button
          title="Go to Main"
          onPress={() => navigation.navigate('Main')}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
})
