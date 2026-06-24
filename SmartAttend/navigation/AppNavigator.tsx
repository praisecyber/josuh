import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { COLORS } from '../constants/theme';

// Screens
import LandingScreen from '../screens/LandingScreen';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';
import StudentSignupScreen from '../screens/auth/StudentSignupScreen';
import LecturerSignupScreen from '../screens/auth/LecturerSignupScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import StudentTabNavigator from './StudentTabNavigator';
import LecturerTabNavigator from './LecturerTabNavigator';

export type RootStackParamList = {
  Landing: undefined;
  RoleSelect: undefined;
  StudentSignup: undefined;
  LecturerSignup: undefined;
  Login: undefined;
  StudentTabs: undefined;
  LecturerTabs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="RoleSelect" component={RoleSelectScreen} />
            <Stack.Screen name="StudentSignup" component={StudentSignupScreen} />
            <Stack.Screen name="LecturerSignup" component={LecturerSignupScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
          </>
        ) : user.role === 'student' ? (
          <Stack.Screen name="StudentTabs" component={StudentTabNavigator} />
        ) : (
          <Stack.Screen name="LecturerTabs" component={LecturerTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
