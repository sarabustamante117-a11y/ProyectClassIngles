import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors, radius, spacing, typography } from '../theme';
import { formatearPrecio } from '../data/clases';
import EtiquetaNivel from '../components/EtiquetaNivel';

export default function DetalleClase({ route }) {
  const { clase, onReservar } = route.params;
  const [claseActual, setClaseActual] = useState(clase);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(clase.horarios[0]);

  const cuposDisponibles = useMemo(() => Math.max(0, claseActual.cupos), [claseActual.cupos]);

  const reservar = () => {
    if (cuposDisponibles <= 0) {
      return;
    }

    setClaseActual((prev) => ({
      ...prev,
      cupos: Math.max(0, prev.cupos - 1),
    }));

    if (onReservar) {
      onReservar(claseActual.id);
    }

    Alert.alert(
      'Reserva exitosa',
      `Reservaste la clase ${claseActual.titulo} para ${horarioSeleccionado}.`,
      [{ text: 'Aceptar' }]
    );
  };

  return (
    <View style={styles.pantalla}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Image source={{ uri: claseActual.imagen }} style={styles.portada} resizeMode="cover" />

        <View style={styles.content}>
          <EtiquetaNivel nivel={claseActual.nivel} />

          <Text style={styles.titulo}>{claseActual.titulo}</Text>

          <View style={styles.filaMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color={colors.acento} />
              <Text style={styles.metaTexto}>{claseActual.rating}</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={colors.textoSuave} />
              <Text style={styles.metaTexto}>{claseActual.duracion} min</Text>
            </View>

            <View style={styles.metaItem}>
              <Ionicons name="people-outline" size={16} color={colors.textoSuave} />
              <Text style={styles.metaTexto}>{cuposDisponibles} cupos</Text>
            </View>
          </View>

          <View style={styles.profesor}>
            <Image source={{ uri: claseActual.profesor.foto }} style={styles.avatar} />
            <View style={styles.profesorTexto}>
              <Text style={styles.nombreProfesor}>{claseActual.profesor.nombre}</Text>
              <Text style={styles.profesorMeta}>{claseActual.profesor.pais} · {claseActual.modalidad}</Text>
            </View>
          </View>

          <View style={styles.seccion}>
            <Text style={styles.subtitulo}>Sobre la clase</Text>
            <Text style={styles.descripcion}>{claseActual.descripcion}</Text>
          </View>

          <View style={styles.horarioBox}>
            <Text style={styles.label}>Elige tu horario</Text>
            <View style={styles.horarioLista}>
              {claseActual.horarios.map((horario) => {
                const activo = horarioSeleccionado === horario;

                return (
                  <Pressable
                    key={horario}
                    onPress={() => setHorarioSeleccionado(horario)}
                    style={[styles.horarioBoton, activo && styles.horarioBotonActivo]}
                  >
                    <Text style={[styles.horarioTexto, activo && styles.horarioTextoActivo]}>{horario}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View>
          <Text style={styles.precioLabel}>Precio por clase</Text>
          <Text style={styles.precio}>{formatearPrecio(claseActual.precio)}</Text>
        </View>

        <Pressable
          onPress={reservar}
          disabled={cuposDisponibles <= 0}
          style={[styles.botonReservar, cuposDisponibles <= 0 && styles.botonReservarDesactivado]}
        >
          <Text style={styles.botonTexto}>{cuposDisponibles <= 0 ? 'Sin cupos' : 'Reservar'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
  },
  scroll: {
    paddingBottom: 110,
  },
  portada: {
    width: '100%',
    height: 220,
    backgroundColor: colors.primarioSuave,
  },
  content: {
    backgroundColor: colors.fondo,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: spacing.md,
  },
  titulo: {
    ...typography.subtitulo,
    fontSize: 28,
    marginTop: spacing.xs,
  },
  filaMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaTexto: {
    fontSize: 13,
    color: colors.texto,
    fontWeight: '700',
  },
  profesor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    padding: spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.borde,
  },
  profesorTexto: {
    flex: 1,
  },
  nombreProfesor: {
    fontSize: 16,
    color: colors.texto,
    fontWeight: '700',
  },
  profesorMeta: {
    fontSize: 13,
    color: colors.textoSuave,
    marginTop: 2,
  },
  seccion: {
    paddingTop: spacing.sm,
  },
  subtitulo: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.texto,
    marginBottom: spacing.sm,
  },
  descripcion: {
    fontSize: 16,
    color: colors.textoSuave,
    lineHeight: 24,
  },
  horarioBox: {
    marginTop: spacing.sm,
  },
  label: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.texto,
    marginBottom: spacing.sm,
  },
  horarioLista: {
    gap: spacing.sm,
  },
  horarioBoton: {
    borderWidth: 1,
    borderColor: colors.borde,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.superficie,
  },
  horarioBotonActivo: {
    borderColor: colors.primario,
    backgroundColor: colors.primarioSuave,
  },
  horarioTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.texto,
    textAlign: 'center',
  },
  horarioTextoActivo: {
    color: colors.primario,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.superficie,
    borderTopWidth: 1,
    borderTopColor: colors.borde,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },
  precioLabel: {
    fontSize: 12,
    color: colors.textoSuave,
  },
  precio: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.primario,
  },
  botonReservar: {
    backgroundColor: colors.primario,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  botonReservarDesactivado: {
    backgroundColor: colors.textoSuave,
  },
  botonTexto: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
