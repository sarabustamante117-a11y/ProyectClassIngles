import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { colors, spacing, radius } from '../theme';

export default function NivelChip({ etiqueta, activo, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        activo && styles.chipActivo,
        pressed && styles.chipPressed,
      ]}
    >
      <Text style={[styles.texto, activo && styles.textoActivo]}>{etiqueta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    minHeight: 44,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.superficie,
    borderWidth: 1,
    borderColor: colors.borde,
    marginRight: spacing.sm,
  },
  chipActivo: {
    backgroundColor: colors.primario,
    borderColor: colors.primario,
  },
  chipPressed: {
    opacity: 0.8,
  },
  texto: {
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '700',
    color: colors.textoSuave,
    includeFontPadding: false,
    textAlign: 'center',
    whiteSpace: 'nowrap',
  },
  textoActivo: {
    color: '#FFFFFF',
  },
});

