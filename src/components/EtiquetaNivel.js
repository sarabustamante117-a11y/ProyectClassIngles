import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, coloresPorNivel } from '../theme';

export default function EtiquetaNivel({ nivel }) {
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