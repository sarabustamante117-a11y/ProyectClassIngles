import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-paper';
import ClasesStack from '../navigation/ClasesStack';
import { colors } from '../theme';
import PerfilScreen from './PerfilScreen';

import ReservasScreen from './ReservasScreen';

const Tab = createBottomTabNavigator();

// Menú principal con tres secciones: reservas, inicio y perfil.
// La ruta central muestra la lista de clases y el detalle, mientras que las
// demás pantallas permiten consultar y administrar la información del usuario.
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