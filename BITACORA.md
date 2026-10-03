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
intale las dependencias con npm install para poder correr el proyecto

cree mi rama de trabajo DESARROLLO en lygar de trabjar en la rama main

segui coen el orden, empece por la capa de datos (contexto hook y Provider)

deje pendiente la decision de las pestañas por que @react-navigation/bottom-tabs no esta instalado 




**Qué aprendí:**

un contexto no sirve si su provider no esta montado en app.js

El estado local de una pantalla se pierde al salir, lo que debe compartirse o guardarse va en el contexto


---

## Sesión 1 (continuación) — 2026-10-03

**Tema:** ReservasContext como fuente única de reservas, conexión con DetalleClaseScreen y regla de cruces de horario.

**Qué pregunté:**
- Qué contexto usar para las reservas (elegí `ReservasContext`).
- Qué es la "firma" de una función y cómo corregir la de `agregarReserva`.
- Cómo saber si el Provider está montado en `App.js`.
- Por qué `reservar` en DetalleClaseScreen no guardaba nada.
- Cómo validar que una reserva no se cruce con otra.
- Revisiones de mi código en `App.js`, `useReserva.js`, `DetalleClaseScreen.js`, `ReservasContext.js` y `clases.js`.

**Resumen de la respuesta:**
- **ReservasContext** es mejor que ClasesContext: responsabilidad única, persiste con AsyncStorage y guarda un arreglo (no un `Map`, que no se serializa bien a JSON).
- **Firma de una función**: nombre + parámetros + lo que devuelve. `agregarReserva` recibía `reserva` pero usaba `clase` y `horario`; se cambió a `(clase, horario)` y se quitó el parámetro sin uso.
- **Provider**: se monta como la "caja" más externa en `App.js`; todo lo que quede dentro puede usar el contexto. `useReserva` lanza un error claro si se usa fuera del Provider.
- **Rutas de import**: `useReserva.js` apuntaba a `./context` y debía ser `../context`. No fallaba porque nadie lo importaba aún. Mantener un solo estilo (relativo o alias `@/`) en todo el proyecto.
- **DetalleClaseScreen** solo descontaba cupos en estado local; ahora llama a `agregarReserva` y muestra alerta según `resultado.ok` (con *early return*). Error encontrado: faltaban los `()` al llamar `useReserva`. No es buena práctica pasar funciones por `route.params`.
- **Callback de `setState`**: no hay garantía de que se ejecute de inmediato (funcionó por una optimización interna de React). Buena práctica: **validar antes de `setReservas`** leyendo `reservas` y agregarlo a las dependencias del `useCallback`.
- **Regla de cruces**: convertir el horario a día + minutos desde medianoche (cuidado con 12 a.m./12 p.m.); fin = inicio + duración. Dos franjas del mismo día se cruzan si `inicioA < finB && inicioB < finA` (estricto: 6:00–7:00 y 7:00–8:00 no se cruzan). Se agregó `duracion` a la reserva, la función auxiliar en `data/clases.js` y la validación con `.find()` para indicar con qué clase se cruza.
- **Git**: se creó la rama `desarrollo` y se hizo push. Ojo con diferencias de versión de npm en `package-lock.json` y con mensajes de commit cortos y claros.

**Pendientes para la próxima sesión:**
- Cambiar el import de `ReservasContext.js` (y el de `DetalleClaseScreen.js`) a ruta relativa, como se acordó.
- Decidir qué hacer con reservas guardadas sin `duracion` (borrar datos o valor por defecto).
- Probar un cruce real modificando temporalmente una duración (y revertirlo).
- Limpiar comentarios y formato en `clases.js` y `ReservasContext.js`; decidir nombre de la función y de la propiedad `minutos`.
- Hacer commit y push de los cambios de la regla de cruces (aún sin commitear).
- Siguiente pantalla: **ReservasScreen**. Decidir con la compañera el manejo de cupos y la estrategia de pestañas (bottom-tabs no está instalado).

**Qué apliqué:**

Corregí la firma de agregarReserva a (clase, horario) y la ruta de import en useReserva.js.

Escribí convertirHorarioAMinutos en data/clases.js y la probé con console.log en cinco casos, incluidos 12 a.m. y 12 p.m.; todos dieron lo esperado.

Agregué la validación de cruces en agregarReserva con .find(), con un mensaje que dice con qué clase se cruza.

Saqué la validación de duplicados fuera de setReservas y agregué reservas a las dependencias del useCallback.

**Qué aprendí:**

La firma de una función es su nombre, sus parámetros y lo que devuelve; si no coincide con lo que la función usa por dentro, falla.

split corta un texto en trozos y devuelve un arreglo; los trozos siguen siendo texto y hay que convertirlos con Number.

Para comparar horas es más fácil pasarlas a minutos desde la medianoche; las 12 son el caso especial.

Una función pura se puede probar sola antes de conectarla, y así es más fácil encontrar errores.

No se debe depender de lo que pasa dentro del callback de setState para devolver un resultado; se valida antes, leyendo el estado.

---
