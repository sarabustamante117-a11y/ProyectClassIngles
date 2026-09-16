import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EtiquetaNivel from './EtiquetaNivel';
import { colors, radius, spacing, sombra } from '../theme';
import { formatearPrecio } from '../data/clases';

export default function Card({ clase, onPress, onReservar }) {
  return (
    <Pressable onPress={onPress} style={styles.tarjeta}>
      <Image source={{ uri: clase.imagen }} style={styles.imagen} />

      <View style={styles.cuerpo}>
        <EtiquetaNivel nivel={clase.nivel} />

        <Text style={styles.titulo}>{clase.titulo}</Text>

        <View style={styles.filaMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={14} color={colors.acento} />
            <Text style={styles.metaTexto}>{clase.rating}</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={14} color={colors.textoSuave} />
            <Text style={styles.metaTexto}>{clase.duracion} min</Text>
          </View>

          <View style={styles.metaItem}>
            <Ionicons name="people-outline" size={14} color={colors.textoSuave} />
            <Text style={styles.metaTexto}>{clase.cupos} cupos</Text>
          </View>
        </View>

        <View style={styles.filaProfesor}>
          <Image source={{ uri: clase.profesor.foto }} style={styles.avatar} />
          <Text style={styles.profesor}>{clase.profesor.nombre}</Text>
        </View>

        <View style={styles.pie}>
          <Text style={styles.precio}>{formatearPrecio(clase.precio)}</Text>
          <Pressable
            onPress={() => {
              if (onReservar) {
                onReservar(clase.id);
              }
            }}
            style={styles.boton}
          >
            <Text style={styles.botonTexto}>Reservar</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    ...sombra,
  },
  imagen: {
    width: '100%',
    height: 180,
    backgroundColor: colors.primarioSuave,
  },
  cuerpo: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.texto,
    lineHeight: 24,
  },
  filaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  metaTexto: {
    fontSize: 12,
    color: colors.textoSuave,
    fontWeight: '600',
  },
  filaProfesor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.borde,
  },
  profesor: {
    fontSize: 13,
    color: colors.texto,
    fontWeight: '600',
    flexShrink: 1,
  },
  pie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  precio: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primario,
  },
  boton: {
    backgroundColor: colors.primario,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});

