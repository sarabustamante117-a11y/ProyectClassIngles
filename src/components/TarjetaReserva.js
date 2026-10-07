import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EtiquetaNivel from './EtiquetaNivel';
import { colors, radius, spacing, sombra } from '../theme';
import { formatearPrecio } from '../data/clases';

// Tarjeta que muestra la información de una reserva realizada por el usuario
export default function TarjetaReserva({ reserva }){
    return(
        <View style={styles.tarjeta}>
            {/* Etiqueta del nivel de la clase reservada */}
            <EtiquetaNivel nivel={reserva.nivel}/>

            {/* Tirulo de la clase*/}
            <Text style={styles.titulo}>{reserva.titulo}</Text>

            {/* Profesor de la clase */}
            <View style={styles.filaProfesor}>
                <Ionicons name="person-outline" size={14} color={colors.textoSuave}/>
                <Text style={styles.profesor}>{reserva.profesor}</Text>
            </View>

            {/* Fila con datos: horario y duracion*/}
            <View style={styles.filaMeta}>
                <View style={styles.metaItem}>
                    <Ionicons name="calendar-outline" size={14} color={colors.textoSuave}/>
                    <Text style={styles.metaTexto}>{reserva.horario}</Text>
                </View>
                
                <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={14} color={colors.textoSuave}/>
                    <Text style={styles.metaTexto}>{reserva.duracion} min</Text>
                </View>
            
            </View>

            {/* Precio de la clase*/ }
            <Text style={styles.precio}>{formatearPrecio(reserva.precio)}</Text>
        </View>
    );
}
const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: colors.superficie,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borde,
    ...sombra,
  },
  titulo: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.texto,
    lineHeight: 24,
  },
  profesor: {
    fontSize: 13,
    color: colors.texto,
    fontWeight: '600',
  },
  filaProfesor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
    filaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingTop: spacing.xs,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaTexto: {
    fontSize: 12,
    color: colors.textoSuave,
    fontWeight: '600',
  },
  precio: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.primario,
    marginTop: spacing.xs,
  },
});