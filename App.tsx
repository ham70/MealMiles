import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Auth from './components/Auth'
import Account from './components/Account'
import SelectRoles from './components/SelectRoles'

const Stack = createNativeStackNavigator()

function AppNavigator() {
  const { session, loading } = useAuth()

  if (loading) return null // or show a loading spinner

  return (
    <NavigationContainer>
      {session && session.user ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SelectRole" component={SelectRoles} />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Auth" component={Auth} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  )
}
