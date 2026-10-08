import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { MD3LightTheme, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReservasProvider } from './src/context/ReservasContext';
import InicioScreen from './src/screens/InicioScreen';
import { colors } from './src/theme';

// Configura el tema base de navegación para que el fondo, texto y bordes
// de las pantallas coincidan con la identidad visual de la app.
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

// Tema visual de React Native Paper con el color principal de la aplicación.
const temaPaper = {
  ...MD3LightTheme,
  colors: { ...MD3LightTheme.colors, primary: colors.primario },
};

// Componente raíz que compone el proveedor de reservas, navegación y tema.
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


