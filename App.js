import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReservasProvider } from './src/hooks/context/ReservasContext';
import InicioScreen from './src/screens/InicioScreen';
import { colors } from './src/theme';

const temaNavegacion = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.fondo,
    card: colors.superficie,
    primary: colors.primario,
    text: colors.texto,
    border: colors.borde,
  },
};

// Tema de React Native Paper con el color primario la app
const temaPaper = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, primary: colors.primario },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={temaPaper}>
        <ReservasProvider>
          <NavigationContainer theme={temaNavegacion}>
            <StatusBar style="dark" />
            <InicioScreen />
          </NavigationContainer>
        </ReservasProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}


