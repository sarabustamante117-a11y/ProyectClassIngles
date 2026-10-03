# Bitácora de consultas con Claude

Proyecto: App de reservas de clases de inglés (Expo + React Native, JavaScript)
Materia: Desarrollo Móvil

---

## Sesión 1 — 2026-10-03

**Tema:** Revisión inicial del proyecto y plan de trabajo.

**Qué pregunté:**
Definí las reglas de trabajo (Claude como guía, sin entregar código), las restricciones (no paquetes nuevos, respetar la arquitectura), las pantallas a desarrollar (InicioScreen, ReservasScreen, PerfilScreen) y las reglas de negocio. Pedí revisar la estructura del proyecto y el `package.json` y recomendar por dónde empezar.

**Resumen de la respuesta:**
- La arquitectura está organizada en `src/` con carpetas `screens`, `components`, `navigation`, `context`, `hooks`, `data` y `theme`. Navegación actual: un Stack (`ClasesStack`) con `Home` (ClasesScreen) y `DetalleClase`.
- Hallazgo importante: `@react-navigation/bottom-tabs` **no está** en el `package.json`, y la regla es no instalar paquetes. Hay que decidir con la compañera/profesor si se pide autorización o si se construye la barra inferior con lo que hay (componentes de React Native + estado o el stack existente).
- Problemas detectados en el código actual (a corregir por nosotras):
  - `ReservasContext.agregarReserva` recibe `reserva` pero usa `clase` y `horario`, que no existen en ese scope.
  - `useReserva.js` importa el contexto con una ruta relativa incorrecta.
  - Existen dos contextos que se solapan (`ClasesContext` y `ReservasContext`) y ninguno está montado como Provider en `App.js`.
  - Las reservas hechas en `ClasesScreen`/`DetalleClaseScreen` solo modifican estado local, no se guardan en el contexto.
  - `AGENTS.md` tiene marcadores de conflicto de merge sin resolver.
  - Los horarios son strings tipo `'Lun 7:00 a.m.'`: para validar cruces de franjas hay que convertirlos a día + minutos y usar `duracion` de la clase.
  - No existe `node_modules` en local (falta `npm install`) y no hay rama propia creada, solo `main`.
- Orden recomendado: 1) rama propia y `npm install`; 2) arreglar la capa de datos (contexto de reservas + hook + Provider en App.js); 3) decidir la estrategia de pestañas; 4) PerfilScreen; 5) ReservasScreen; 6) validación de cruces de horario; 7) InicioScreen.

**Qué apliqué:**


**Qué aprendí:**


---
