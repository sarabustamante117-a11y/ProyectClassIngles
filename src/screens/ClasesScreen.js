import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import Card from '../components/Card';
import NivelChip from '../components/NivelChip';
import EstadoVacio from '../components/EstadoVacio';
import useResponsive from '../hooks/useResponsive';

import { colors, radius, spacing, typography } from '../theme';
import { CLASES, NIVELES } from '../data/clases';

export default function ClasesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [nivel, setNivel] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  const [clases, setClases] = useState(CLASES);
  const { columnas } = useResponsive();

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

  const manejarReserva = (claseId) => {
    setClases((prevClases) =>
      prevClases.map((clase) => {
        if (clase.id !== claseId || clase.cupos <= 0) {
          return clase;
        }

        return {
          ...clase,
          cupos: clase.cupos - 1,
        };
      })
    );
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
            onPress={() =>
              navigation.navigate('DetalleClase', {
                clase: item,
                onReservar: manejarReserva,
              })
            }
            onReservar={manejarReserva}
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
