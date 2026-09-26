import {useState, useEffect, useCallback} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hook reutilizable para leer y guardar datos en AsyncStorage.
// Se usa para persistir información como reservas, preferencias o cualquier valor local.
export default function useAlmacenamiento(clave, valorInicial) {
  // Estado donde guardamos el valor actual que estamos manejando.
  const [valor, setValor] = useState(valorInicial);

  // Indica si la carga inicial ya terminó.
  const [listo, setListo] = useState(false);

  // Cuando cambia la clave, intentamos recuperar el valor guardado.
  useEffect(() => {
    // Bandera para evitar actualizar el estado si el componente ya se desmontó.
    let activo = true;

    AsyncStorage.getItem(clave)
      .then((guardando) => {
        // Si existe algo guardado, lo convertimos de JSON a objeto/array y lo cargamos.
        if (activo && guardando !== null) setValor(JSON.parse(guardando));
      })
      .catch((error) => console.log('Error leyendo ' + clave, error))
      .finally(() => setListo(true));

    return () => {
      // Cuando el componente desaparece, dejamos la bandera en false.
      activo = false;
    };
  }, [clave]);

  // Función para actualizar el valor y guardarlo automáticamente en almacenamiento local.
  const actualizar = useCallback(
    async (nuevoValor) => {
      setValor(nuevoValor);

      try {
        await AsyncStorage.setItem(clave, JSON.stringify(nuevoValor));
      } catch (error) {
        console.log('Error guardando ' + clave, error);
      }
    },
    [clave]
  );

  // Se devuelve el valor, si ya cargó y la función para actualizar.
  return { valor, listo, actualizar };
}