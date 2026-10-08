import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Card from '../components/Card';
import EstadoVacio from '../components/EstadoVacio';
import NivelChip from '../components/NivelChip';
import useReserva from '../hooks/useReserva';
import useResponsive from '../hooks/useResponsive';

import { CLASES, NIVELES } from '../data/clases';
import { colors, radius, spacing, typography } from '../theme';

// Pantalla principal que muestra todas las clases disponibles y permite filtrarlas.
export default function ClasesScreen({ navigation }) {
  // Ajusta el contenido para no quedar tapado por la notch o barra del sistema.
  const insets = useSafeAreaInsets();

  // Estado para el filtro de nivel actual.
  const [nivel, setNivel] = useState('Todos');

  // Estado para el texto que escribe el usuario en la búsqueda.
  const [busqueda, setBusqueda] = useState('');

  // Reservas reales guardadas en el contexto.
  const { reservas } = useReserva();

  // Detecta cuántas columnas deben usarse según el ancho de la pantalla.
  const { columnas } = useResponsive();

  // Calcula los cupos disponibles de cada clase a partir de las reservas reales:
  // cupos disponibles = cupos totales - reservas guardadas de esa clase.
  // Así los cupos solo bajan cuando una reserva se guarda bien, y suben si se cancela.
  const clases = useMemo(() => {
    return CLASES.map((clase) => {
      // El id de cada reserva tiene la forma "idClase-horario" (ej: "1-Lun 7:00 a.m.").
      const reservadas = reservas.filter((r) => r.id.split('-')[0] === clase.id).length;

      return {
        ...clase,
        cupos: Math.max(0, clase.cupos - reservadas),
      };
    });
  }, [reservas]);

  // Calcula la lista final según nivel y texto buscado.
  const resultados = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();

    return clases.filter((clase) => {
      const coincideNivel = nivel === 'Todos' || clase.nivel === nivel;
      const coincideTexto =
        !textoBusqueda ||
        clase.titulo.toLowerCase().includes(textoBusqueda) ||
        clase.profesor.nombre.toLowerCase().includes(textoBusqueda);

      return coincideNivel && coincideTexto;
    });
  }, [clases, nivel, busqueda]);

  // Abre el detalle de la clase, donde se elige el horario y se confirma la reserva.
  const abrirDetalle = (clase) => {
    navigation.navigate('DetalleClase', { clase });
  };

  return (
    <View style={[style.pantalla, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={style.header}>
        <Text style={typography.titulo}>Aplicación para clases de inglés</Text>

        <View style={style.buscador}>
          <Ionicons name="search-outline" size={18} color={colors.textoSuave} />
          <TextInput
            style={style.input}
            placeholder="Buscar por clase o profesor"
            placeholderTextColor={colors.textoSuave}
            value={busqueda}
            onChangeText={setBusqueda}
            autoCorrect={false}
          />

          {busqueda.length > 0 && (
            <Ionicons
              name="close-circle"
              size={18}
              color={colors.textoSuave}
              onPress={() => setBusqueda('')}
            />
          )}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={style.filtros}
        style={style.filtrosScroll}
      >
        {NIVELES.map((item) => (
          <NivelChip
            key={item}
            etiqueta={item}
            activo={nivel === item}
            onPress={() => setNivel(item)}
          />
        ))}
      </ScrollView>

      <FlatList
        data={resultados}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            clase={item}
            onPress={() => abrirDetalle(item)}
            // El botón Reservar ya no resta cupos: lleva al detalle para elegir horario.
            onReservar={() => abrirDetalle(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={style.lista}
        numColumns={columnas}
        ListEmptyComponent={
          <EstadoVacio
            icono="search-outline"
            titulo="No encontramos resultados"
            mensaje="La combinación de búsqueda no tiene resultados."
            onAction={() => {
              setNivel('Todos');
              setBusqueda('');
            }}
          />
        }
      />
    </View>
  );
}

const style = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
    paddingHorizontal: spacing.lg,
  },
  header: {
    paddingTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  buscador: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.superficie,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 48,
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.borde,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: colors.texto,
    paddingVertical: 0,
  },
  filtrosScroll: {
    marginBottom: spacing.sm,
  },
  filtros: {
    paddingVertical: spacing.sm,
    paddingRight: spacing.lg,
    paddingLeft: spacing.lg,
    alignItems: 'center',
  },
  lista: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
});