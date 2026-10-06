import React, {useState, useEffect, useCallback, useMemo, createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertirHorarioAMinutos } from '../data/clases';

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
        const nueva = {
            id: clase.id + '-' + horario,
            titulo: clase.titulo,
            nivel: clase.nivel,
            profesor: clase.profesor.nombre,
            precio: clase.precio,
            horario: horario,
            duracion: clase.duracion,
            creadoEn: new Date().toISOString(),
        };
        // no repetir la misma clase en el mismo horario.
        if (reservas.some((r) => r.id === nueva.id)) {
            return {ok: false, mensaje: 'La reserva ya existe'};
        }
        //2 no reservas clases  que se crucen en la mismo horario.
        const horarioNueva = convertirHorarioAMinutos(nueva.horario);
        const inicioNueva = horarioNueva.minutos;
        const finNueva = inicioNueva + nueva.duracion;
        
        const cruzada = reservas.find ((r) =>{
            const horarioExistente = convertirHorarioAMinutos(r.horario);

            //dias distintos no se pueden cruzar.
            if (horarioExistente.dia !== horarioNueva.dia){
                return false;
            }
            const inicioExistente = horarioExistente.minutos;
            const finExistente = inicioExistente + r.duracion;
            // se cruzan si cada una empieza antes de que la otra termine
            return inicioNueva < finExistente && inicioExistente < finNueva;

        });

        if (cruzada){
            return {
                ok: false,
                mensaje:`Se cruza con ${cruzada.titulo} el ${cruzada.horario}.`,
            };
        }
   
        // Si pasó la validación, la agregamos al inicio de la lista.
        setReservas((previas) => [nueva, ...previas]);

        return {ok: true};
    }, [reservas]);

    //funcion para cancelar una reserva a partir de su id
    const cancelarReserva   = useCallback ((id) => {
        //nos quedamos con todas las reservas menos la que tenga ese id
        setReservas((previas) => previas.filter((r) => r.id !== id));
    },[]);

    // Creamos el valor del contexto para que lo consuman los componentes.
    const valor = useMemo(
        () => ({
            cargando,
            agregarReserva,
            cancelarReserva,
            reservas,
        }),
        [cargando, agregarReserva, cancelarReserva, reservas]
    );

    // Proveemos el valor del contexto a todos los componentes hijos.
    return (
        <ReservasContext.Provider value={valor}>
            {children}
        </ReservasContext.Provider>
    );
}