import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import ClasesStack from '../navigation/ClasesStack';
import { colors } from '../theme';
import PerfilScreen from './PerfilScreen';

import ReservasScreen from './ReservasScreen';

const Tab = createBottomTabNavigator();

// Menú con navegación tipo tab: izquierda = Reservas, centro = Inicio, derecha = Perfil
export default function InicioScreen() {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primario,
        tabBarInactiveTintColor: '#8a8a8a',
        tabBarStyle: {
          backgroundColor: colors.superficie,
          borderTopColor: colors.borde,
        },
      }}
    >
      <Tab.Screen
        name="Reservas"
        component={ReservasScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon source="notebook" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Inicio"
        component={ClasesStack}
        options={{
          tabBarIcon: ({ color, size }) => <Icon source="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Icon source="account" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}