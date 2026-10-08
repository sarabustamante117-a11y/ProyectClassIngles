import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import useReserva from '../hooks/useReserva';
import { colors, spacing } from '../theme';

import EstadoVacio from '../components/EstadoVacio';
import TarjetaReserva from '../components/TarjetaReserva';

// Pantalla que muestra todas las reservas confirmadas por el usuario.
// Aquí se pueden consultar las clases activas y cancelar las que ya no interesen.
export default function ReservasScreen() {
    // Lee la lista de reservas compartida por el contexto global de la app.
    const { reservas, cargando, cancelarReserva } = useReserva();

    // Ajusta el contenido para evitar que quede oculto detrás de la barra del sistema.
    const insets = useSafeAreaInsets();

    // Solicita confirmación antes de cancelar una reserva guardada por el usuario.
    const confirmarCancelacion = (id) => {
        // Busca la reserva concreta para mostrar su nombre y horario en el mensaje.
        const reserva = reservas.find((r) => r.id === id);
        if (!reserva) {
            return;
        }
        Alert.alert(
            'Cancelar reserva',
            `¿Cancelar ${reserva.titulo} el ${reserva.horario}?`,
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, cancelar',
                    style: 'destructive',
                    onPress: () => cancelarReserva(id),
                },
            ]
        );
    };

    // Mientras se cargan las reservas persistidas, se muestra un estado de carga.
    if (cargando) {
        return (
            <View style={styles.centrado}>
                <ActivityIndicator size="large" color={colors.primario} />
            </View>
        );
    }

    return (
        <View style={[styles.pantalla, { paddingTop: insets.top }]}>
            {/* Encabezado de la vista para identificar rápidamente la sección de reservas. */}
            <Text style={styles.tituloPantalla}>Mis reservas</Text>
            <FlatList
                data={reservas}
                keyExtractor={(item) => item.id}
                contentContainerStyle={[styles.lista, reservas.length === 0 && styles.listaVacia]}
                renderItem={({ item }) => <TarjetaReserva reserva={item} onCancelar={confirmarCancelacion} />}
                ListEmptyComponent={
                    <EstadoVacio
                        icono="calendar-outline"
                        titulo="Aún no tienes reservas"
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