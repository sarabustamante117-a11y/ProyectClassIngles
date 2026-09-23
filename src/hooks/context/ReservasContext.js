import React, {useState, useEffect, useCallback, useMemo, createContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CLAVE_RESERVAS = '@reservas_ingles';

export const ReservasContext = createContext(null);

export function ReservasProvider({children}){
    const [reservas, setReservas] = useState([]);
    const [cargando, setCargando] = useState(true);

    useEffect(()=>{
        const cargar = async()=>{
            try{
                const guardado = await AsyncStorage.getItem(CLAVE_RESERVAS);
                if(guardado !== null){
                    setReservas(JSON.parse(guardado));
                }

            }catch(error){
                console.log('Error leyendo las reservas:', error);
            }finally{
                setCargando(false);
            }
            
        };
        cargar();
    },[])

    //hacer el guardado 
    useEffect( (()=>{
        if(cargando) return;
        AsyncStorage.setItem(CLAVE_RESERVAS, JSON.stringify(reservas)).catch((error) =>
            console.log('Error guardando las reservas:', error)

        );
    },[reservas, cargando]) );

    const agregarReserva = useCallback((reserva)=>{
        const nueva ={
            id: clase.id + '-' + horario,
            titulo: clase.titulo,
            nivel: clase.nivel,
            profesor: clase.profesor.nombre,
            precio: clase.precio,
            horario: horario,
            creadoEn: new Date().toISOString(),
            
        };
        let resultado = {ok: true};
        setReservas( (previas) =>{
            if(previas.some((r) => r.id === nueva.id)){
                resultado = {ok: false, mensaje: 'La reserva ya existe'};
                return previas;
            }
            return [nueva, ...previas];

        }); // set reservas
        return resultado;

    },[]); //cierre del callback


const valor = useMemo(
()=>({cargando, agregarReserva, reservas}), [cargando, agregarReserva, reservas]
)

return<ReservasContext.Provider value={valor}> {children}</ReservasContext.Provider>
    
} //esta es la llave de cierre para la funcion 

