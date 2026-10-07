import React from 'react';
import { View, Text, StyleSheet, FlatList} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {colors, spacing } from '../theme';
import useReserva from '../hooks/useReserva';
import { ActivityIndicator } from 'react-native-paper';
import EstadoVacio from '@/components/EstadoVacio';


//Pantalla que nos muestra la lista de reservar hechas por el usuario.
export default function ReservasScreen(){
    //sacamos del contexto la lista de reservas
    const { reservas, cargando } = useReserva();

    //Margenes del sistema para no quedar debajo de la barra
    const insets  = useSafeAreaInsets();

    //Mientras se leen las reservas guardadas, mostrammos solo el indicador.
    if(cargando){
        return(
            <View style={styles.centrado}>
                <ActivityIndicator size="large" color = {colors.primario}/>
            </View>
        );
    }


    return (
        <View style={[styles.pantalla, { paddingTop: insets.top }]}>
            <FlatList
                data={reservas}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.lista}
                renderItem={({ item }) => <Text style={styles.titulo}>{item.titulo}</Text>}
                ListEmptyComponent={
                    <EstadoVacio
                        icono = "calendar-outline"
                        titulo="Aún no tienes  reservas"
                        mensaje="Explora las clases y reserva la que más te guste"
                    />
                }
            />
        </View>

    );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: colors.fondo,
    paddingHorizontal: spacing.lg,
  },
  centrado:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fondo,
  },
  lista: {
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  titulo: {
    color: colors.texto,
    paddingVertical: spacing.sm,
  },
});
