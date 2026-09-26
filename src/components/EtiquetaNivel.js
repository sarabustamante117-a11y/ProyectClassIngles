import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, coloresPorNivel } from '../theme';

// Muestra la categoría del nivel de la clase con un color asociado.
// Sirve para identificar rápidamente si es principiante, intermedio o avanzado.
export default function EtiquetaNivel({ nivel }) {
  // Elige el color que corresponde al nivel; si no coincide, usa el primario por defecto.
  const color = coloresPorNivel[nivel] || colors.primario;

  return (
    <View
      style={[
        styles.contenedor,
        {
          backgroundColor: color + '1A',
          borderColor: color,
        },
      ]}
    >
      <Text style={[styles.texto, { color }]}>{nivel}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderRadius: 999,
  },
  texto: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});