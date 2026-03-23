import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/theme';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    'BebasNeue-Regular': require('./assets/fonts/BebasNeue-Regular.ttf'),
    'Barlow-Regular': require('./assets/fonts/Barlow-Regular.ttf'),
    'Barlow-Medium': require('./assets/fonts/Barlow-Medium.ttf'),
    'Barlow-SemiBold': require('./assets/fonts/Barlow-SemiBold.ttf'),
    'Barlow-Bold': require('./assets/fonts/Barlow-Bold.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <NavigationContainer
        theme={{
          dark: true,
          colors: {
            primary: colors.gold,
            background: colors.background,
            card: colors.surface,
            text: colors.whiteText,
            border: colors.border,
            notification: colors.red,
          },
          fonts: {
            regular: { fontFamily: 'Barlow-Regular', fontWeight: '400' },
            medium: { fontFamily: 'Barlow-Medium', fontWeight: '500' },
            bold: { fontFamily: 'Barlow-Bold', fontWeight: '700' },
            heavy: { fontFamily: 'Barlow-Bold', fontWeight: '700' },
          },
        }}
      >
        <RootNavigator />
      </NavigationContainer>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
