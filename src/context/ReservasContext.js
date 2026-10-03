import React, {useState, useEffect, useCallback, useMemo, createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Nombre de la clave que usaremos en AsyncStorage para guardar las reservas.
const CLAVE_RESERVAS = '@reservas_ingles';

// Creamos el contexto que va a compartir la información de reservas con toda la app.
export const ReservasContext = createContext(null);

// Provider que encapsula el estado de las reservas y lo ofrece a los componentes hijos.
export function ReservasProvider({children}){
    // Estado principal: guarda la lista de reservas actuales.
    const [reservas, setReservas] = useState([]);

    // Estado para saber si aún estamos cargando las reservas guardadas.
    const [cargando, setCargando] = useState(true);

    // Al montar el componente, intentamos leer las reservas almacenadas en almacenamiento local.
    useEffect(() => {
        const cargar = async () => {
            try {
                // Recupera la información guardada bajo la clave CLAVE_RESERVAS.
                const guardado = await AsyncStorage.getItem(CLAVE_RESERVAS);

                // Si había algo guardado, lo parseamos y lo cargamos en el estado.
                if (guardado !== null) {
                    setReservas(JSON.parse(guardado));
                }
            } catch (error) {
                // Si falla la lectura, se muestra un mensaje en consola para depuración.
                console.log('Error leyendo las reservas:', error);
            } finally {
                // Cuando termina la carga, marcamos que ya terminó.
                setCargando(false);
            }
        };

        cargar();
    }, []);

    // Cada vez que cambian las reservas o termina la carga inicial,
    // guardamos la lista actual en AsyncStorage para persistirla.
    useEffect(() => {
        if (cargando) return;

        AsyncStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas)).catch((error) =>
            console.log('Error guardando las reservas:', error)
        );
    }, [reservas, cargando]);

    // Función para agregar una nueva reserva al estado.
    const agregarReserva = useCallback((clase,horario) => {
        // Se prepara el objeto con la información de la reserva.
        // En este punto se asume que la función recibe la clase y el horario necesarios.
        const nueva = {
            id: clase.id + '-' + horario,
            titulo: clase.titulo,
            nivel: clase.nivel,
            profesor: clase.profesor.nombre,
            precio: clase.precio,
            horario: horario,
            creadoEn: new Date().toISOString(),
        };

        // Objeto de resultado para indicar si la operación fue exitosa o no.
        let resultado = {ok: true};

        // Actualizamos el estado usando el valor previo para evitar conflictos.
        setReservas((previas) => {
            // Si ya existe la misma reserva, no la agregamos de nuevo.
            if (previas.some((r) => r.id === nueva.id)) {
                resultado = {ok: false, mensaje: 'La reserva ya existe'};
                return previas;
            }

            // Si no existe, la agregamos al inicio de la lista.
            return [nueva, ...previas];
        });

        // Devolvemos el resultado para que quien llame a la función pueda saber si se guardó o no.
        return resultado;
    }, []);

    // Creamos el valor del contexto para que lo consuman los componentes.
    const valor = useMemo(
        () => ({
            cargando,
            agregarReserva,
            reservas,
        }),
        [cargando, agregarReserva, reservas]
    );

    // Proveemos el valor del contexto a todos los componentes hijos.
    return (
        <ReservasContext.Provider value={valor}>
            {children}
        </ReservasContext.Provider>
    );
}


