import { useContext } from "react";
import { ReservaContext } from "../context/ReservaContext";

// Hook personalizado para consumir el contexto de reservas desde cualquier componente.
// Hace más fácil acceder al estado compartido sin repetir useContext en cada pantalla.
export default function useReserva() {
    // Obtiene el valor actual del contexto de reservas.
    const contexto = useContext(ReservaContext);

    // Si se usa fuera del proveedor, lanza un error para avisar al desarrollador.
    if (!contexto) {
        throw new Error("useReserva debe ser usado dentro de un <ReservaProvider>");
    }

    // Devuelve los datos del contexto para que el componente pueda usarlos.
    return contexto;
};