import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function useAlmacenamiento(clave, valorInicial) {
  const [valor, setValor] = useState(valorInicial);
  const [listo, setListo] = useState(false);

  useEffect(() => {
  let activo = true; // esto es una bandera para saber si el componente sigue montado

AsyncStorage.getItem(clave)
    .then((guardando) => {
        if(activo && guardando !== null) setValor(JSON.parse(guardando));

    })
    .catch((error) => console.log('Error leyendo'+ clave,error))
    .finally(() => setListo(true));

    return()=>{
        activo=false; // cuando el componente se desmonte, cambiamos la bandera a false
    }

    },[clave]);

    const actualizar = useCallback(
        async(nuevoValor) => {
            setValor(nuevoValor);
            try{
                await AsyncStorage.setItem(clave, JSON.stringify(nuevoValor));

            }catch(error){
                console.log('Error guardando'+ clave,error);
            }
        }, [clave]
    );
};