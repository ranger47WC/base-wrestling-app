import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CoachProfileScreen } from '../screens/onboarding/CoachProfileScreen';
import { TeamSetupScreen } from '../screens/onboarding/TeamSetupScreen';
import { ConfirmationScreen } from '../screens/onboarding/ConfirmationScreen';
import { OnboardingStackParamList } from './types';
import { colors } from '../theme/theme';

const Stack = createNativeStackNavigator<OnboardingStackParamList>();

export const OnboardingNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="CoachProfile" component={CoachProfileScreen} />
      <Stack.Screen name="TeamSetup" component={TeamSetupScreen} />
      <Stack.Screen name="Confirmation" component={ConfirmationScreen} />
    </Stack.Navigator>
  );
};
