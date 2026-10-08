import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, HelperText, Snackbar, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NIVELES } from '../data/clases';
import useAlmacenamiento from '../hooks/useAlmacenamiento';
import { colors } from '../theme';

const CLAVE_PERFIL = '@perfil_ingles';

// Objetivos predefinidos para categorizar la finalidad del aprendizaje del usuario.
const OBJETIVOS = ['Viajar', 'Trabajo', 'Estudios', 'Conversación'];

// Formatea la fecha mientras se escribe: 25031998 -> 25/03/1998 para mejorar la UX.
const formatearFecha = (texto) => {
  const n = texto.replace(/\D/g, '').slice(0, 8);
  if (n.length <= 2) return n;
  if (n.length <= 4) return n.slice(0, 2) + '/' + n.slice(2);
  return n.slice(0, 2) + '/' + n.slice(2, 4) + '/' + n.slice(4);
};

// Verifica que la fecha sea real, válida y no superior a la fecha actual.
const fechaValida = (texto) => {
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
  if (!m) return false;
  const [, d, mes, a] = m.map(Number);
  const fecha = new Date(a, mes - 1, d);
  return (
    a >= 1900 &&
    fecha.getFullYear() === a &&
    fecha.getMonth() === mes - 1 &&
    fecha.getDate() === d &&
    fecha <= new Date()
  );
};

// Formulario reutilizable para crear o editar el perfil del usuario.
// Si ya existe información guardada, llena automáticamente los campos en pantalla.
function Formulario({ perfil, onGuardar, onBorrar }) {
  const [form, setForm] = useState({
    nombre: perfil?.nombre ?? '',
    apellido: perfil?.apellido ?? '',
    cedula: perfil?.cedula ?? '',
    correo: perfil?.correo ?? '',
    telefono: perfil?.telefono ?? '',
    fechaNacimiento: perfil?.fechaNacimiento ?? '',
    nivel: perfil?.nivel ?? '',
    objetivo: perfil?.objetivo ?? '',
  });
  const [error, setError] = useState('');

  // Actualiza solo el campo que el usuario está editando en ese momento.
  const cambiar = (campo) => (texto) => setForm({ ...form, [campo]: texto });

  const guardar = () => {
    const { nombre, apellido, cedula, correo, telefono, fechaNacimiento, nivel, objetivo } = form;

    if (
      !nombre.trim() ||
      !apellido.trim() ||
      !cedula.trim() ||
      !correo.trim() ||
      !telefono.trim() ||
      !fechaNacimiento.trim() ||
      !nivel ||
      !objetivo
    ) {
      setError('Completa todos los campos.');
      return;
    }
    if (!/^\d{6,10}$/.test(cedula.trim())) {
      setError('La cédula debe tener solo números (6 a 10 dígitos).');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      setError('Escribe un correo válido, por ejemplo nombre@correo.com.');
      return;
    }
    if (!/^\d{7,15}$/.test(telefono.trim())) {
      setError('El teléfono debe tener solo números (7 a 15 dígitos).');
      return;
    }
    if (!fechaValida(fechaNacimiento)) {
      setError('La fecha debe existir y tener formato DD/MM/AAAA.');
      return;
    }

    setError('');
    onGuardar({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      cedula: cedula.trim(),
      correo: correo.trim().toLowerCase(),
      telefono: telefono.trim(),
      fechaNacimiento,
      nivel,
      objetivo,
    });
  };

  // Limpia los campos del formulario y elimina el perfil almacenado localmente.
  const limpiar = () => {
    setForm({
      nombre: '',
      apellido: '',
      cedula: '',
      correo: '',
      telefono: '',
      fechaNacimiento: '',
      nivel: '',
      objetivo: '',
    });
    setError('');
    onBorrar();
  };

  return (
    <View>
      <TextInput label="Nombre" mode="outlined" value={form.nombre} onChangeText={cambiar('nombre')} style={styles.input} />
      <TextInput label="Apellido" mode="outlined" value={form.apellido} onChangeText={cambiar('apellido')} style={styles.input} />
      <TextInput label="Cédula" mode="outlined" keyboardType="numeric" value={form.cedula} onChangeText={cambiar('cedula')} style={styles.input} />
      <TextInput
        label="Correo electrónico"
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={form.correo}
        onChangeText={cambiar('correo')}
        style={styles.input}
      />
      <TextInput
        label="Teléfono"
        mode="outlined"
        keyboardType="phone-pad"
        maxLength={15}
        value={form.telefono}
        onChangeText={(t) => setForm({ ...form, telefono: t.replace(/\D/g, '') })}
        style={styles.input}
      />
      <TextInput
        label="Fecha de nacimiento (DD/MM/AAAA)"
        mode="outlined"
        keyboardType="numeric"
        maxLength={10}
        value={form.fechaNacimiento}
        onChangeText={(t) => setForm({ ...form, fechaNacimiento: formatearFecha(t) })}
        style={styles.input}
      />

      <Text variant="titleSmall" style={styles.etiqueta}>Nivel</Text>
      <View style={styles.chips}>
        {NIVELES.filter((n) => n !== 'Todos').map((n) => (
          <Chip
            key={n}
            selected={form.nivel === n}
            onPress={() => setForm({ ...form, nivel: n })}
            style={styles.chip}
          >
            {n}
          </Chip>
        ))}
      </View>

      <Text variant="titleSmall" style={styles.etiqueta}>Objetivo para aprender inglés</Text>
      <View style={styles.chips}>
        {OBJETIVOS.map((o) => (
          <Chip
            key={o}
            selected={form.objetivo === o}
            onPress={() => setForm({ ...form, objetivo: o })}
            style={styles.chip}
          >
            {o}
          </Chip>
        ))}
      </View>

      <HelperText type="error" visible={!!error}>
        {error}
      </HelperText>

      <View style={styles.fila}>
        <Button mode="outlined" onPress={limpiar} style={styles.boton}>
          Limpiar
        </Button>
        <Button mode="contained" onPress={guardar}>
          Guardar
        </Button>
      </View>
    </View>
  );
}

export default function PerfilScreen() {
  const insets = useSafeAreaInsets();
  const { valor: perfil, listo, actualizar } = useAlmacenamiento(CLAVE_PERFIL, null);
  const [mensaje, setMensaje] = useState('');

  // Espera a completar la lectura del almacenamiento local para evitar mostrar
  // un formulario vacío antes de confirmar si ya existe un perfil guardado.
  if (!listo) return null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.fondo }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.contenido, { paddingTop: insets.top + 16 }]}
      >
        <Text variant="headlineMedium" style={styles.titulo}>
          {perfil ? 'Mi perfil' : 'Registro'}
        </Text>

        <Formulario
          perfil={perfil}
          onGuardar={async (datos) => {
            await actualizar(datos);
            setMensaje('Perfil guardado');
          }}
          onBorrar={async () => {
            await actualizar(null);
            setMensaje('Datos borrados');
          }}
        />
      </ScrollView>

      <Snackbar visible={!!mensaje} onDismiss={() => setMensaje('')} duration={2000}>
        {mensaje}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  contenido: { padding: 16, paddingBottom: 32 },
  titulo: { marginBottom: 16, textAlign: 'center' },
  input: { marginBottom: 12 },
  etiqueta: { marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  chip: { marginRight: 8, marginBottom: 8 },
  fila: { flexDirection: 'row', justifyContent: 'center' },
  boton: { marginRight: 8 },
});