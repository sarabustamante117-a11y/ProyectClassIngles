import React from 'react';
import { View,Text, StyleSheet, FlatList, ActivityIndicator, Alert} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {colors, spacing } from '../theme';
import useReserva from '../hooks/useReserva';

import EstadoVacio from '../components/EstadoVacio';
import TarjetaReserva from '../components/TarjetaReserva';


//Pantalla que nos muestra la lista de reservar hechas por el usuario.
export default function ReservasScreen(){
    //sacamos del contexto la lista de reservas
    const { reservas, cargando, cancelarReserva } = useReserva();

    //Margenes del sistema para no quedar debajo de la barra
    const insets  = useSafeAreaInsets();

    //pedimos confirmacion de cancelar la reserva con ese id
    const confirmarCancelacion = (id) =>{
        //Buscamos la reserva para mostar su titulo y horario en el mensaje.
        const reserva = reservas.find((r) => r.id ===id);
        if(!reserva){
            return;
        }
        Alert.alert(
            'Cancelar reserva',
            `¿Cancelar ${reserva.titulo} el ${reserva.horario}?`,
            [
                {text: 'No', style: 'cancel' },
                {
                    text: 'Sí, cancelar',
                    style: 'destructive',
                    onPress: () => cancelarReserva(id),
                },
            ]
        );
    };

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

            {/* Titulo para la pantalla*/}
            <Text style={styles.tituloPantalla}>Mis reservas</Text>
            <FlatList
                data={reservas}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.lista, reservas.length === 0 && styles.listaVacia]}
                renderItem={({ item }) => <TarjetaReserva reserva={item} onCancelar={confirmarCancelacion}/>}
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
    flexGrow: 1,
    paddingBottom: spacing.xl,
    paddingTop: spacing.sm,
  },
  listaVacia:{
    justifyContent: 'center',
  },
  titulo: {
    color: colors.texto,
    paddingVertical: spacing.sm,
  },
  tituloPantalla:{
    fontSize: 24,
    fontWeight: '800',
    color: colors.texto,
    paddingTop: spacing.xs,
    marginBottom: spacing.sm,
  },
});