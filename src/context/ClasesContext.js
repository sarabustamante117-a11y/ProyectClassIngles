import { createContext, useContext, useState } from 'react';
import { CLASES as CLASES_INICIALES } from '../data/clases';

// Contexto global para compartir el catálogo y el estado de clases reservadas.
const ClasesContext = createContext(null);

// Proveedor que expone el catálogo y las funciones para reservar o cancelar clases.
export function ClasesProvider({ children }) {
  // Catálogo real de clases disponibles en la app.
  const [clases, setClases] = useState(CLASES_INICIALES);

  // Mapa de clases ya reservadas por el usuario para controlar disponibilidad.
  const [reservadas, setReservadas] = useState(new Map());

  // Reduce el cupo disponible de la clase indicada al reservarla.
  function reservarClase(id, horario) {
    const idx = clases.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    if (clases[idx].cupos <= 0) return false;
    setClases((prev) =>
      prev.map((c) => (c.id === id ? { ...c, cupos: c.cupos - 1 } : c))
    );
    setReservadas((prev) => new Map(prev).set(id, horario));
    return true;
  }

  // Vuelve a sumar un cupo y elimina la reserva asociada a la clase.
  function cancelarClase(id) {
    const idx = clases.findIndex((c) => c.id === id);
    if (idx === -1) return false;
    setClases((prev) => prev.map((c) => (c.id === id ? { ...c, cupos: c.cupos + 1 } : c)));
    setReservadas((prev) => {
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
    return true;
  }

  return (
    <ClasesContext.Provider value={{ clases, reservarClase, cancelarClase, reservadas }}>
      {children}
    </ClasesContext.Provider>
  );
}

// Hook reutilizable para consumir el contexto sin repetir useContext en cada pantalla.
export function useClases() {
  const ctx = useContext(ClasesContext);
  if (!ctx) throw new Error('useClases must be used within ClasesProvider');
  return ctx;
}

export default ClasesContext;