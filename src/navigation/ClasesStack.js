import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ClasesScreen from '../screens/ClasesScreen';
import DetalleClaseScreen from '../screens/DetalleClaseScreen';

// Navegación en pila para pasar entre la lista de clases y el detalle individual.
const Stack = createNativeStackNavigator();

export default function ClasesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Pantalla principal con la lista de clases disponibles. */}
      <Stack.Screen name="Home" component={ClasesScreen} />

      {/* Pantalla de detalle de una clase específica. */}
      <Stack.Screen
        name="DetalleClase"
        component={DetalleClaseScreen}
        options={{ title: 'Detalle', headerBackTitle: 'Atrás' }}
      />
    </Stack.Navigator>
  );
}
