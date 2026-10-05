import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import ClasesStack from '../navigation/ClasesStack';
import { colors } from '../theme';

const Tab = createBottomTabNavigator();

// Pantallas temporales (después las cambias por ReservasScreen y PerfilScreen)
const Temporal = ({ nombre }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text variant="titleLarge">{nombre}</Text>
  </View>
);
const ReservasTemporal = () => <Temporal nombre="Reservas" />;
const PerfilTemporal = () => <Temporal nombre="Perfil" />;

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
        component={ReservasTemporal}
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
        component={PerfilTemporal}
        options={{
          tabBarIcon: ({ color, size }) => <Icon source="account" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}