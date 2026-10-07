import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Chip, HelperText, Snackbar, Text, TextInput } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NIVELES } from '../data/clases';
import useAlmacenamiento from '../hooks/useAlmacenamiento';
import { colors } from '../theme';

const CLAVE_PERFIL = '@perfil_ingles';

// Formulario: aparece lleno si ya hay perfil, vacío si no hay
function Formulario({ perfil, onGuardar, onBorrar }) {
  const [form, setForm] = useState({
    nombre: perfil?.nombre ?? '',
    apellido: perfil?.apellido ?? '',
    nivel: perfil?.nivel ?? '',
    cedula: perfil?.cedula ?? '',
  });
  const [error, setError] = useState('');

  // Actualiza solo el campo que se está escribiendo
  const cambiar = (campo) => (texto) => setForm({ ...form, [campo]: texto });

  const guardar = () => {
    const { nombre, apellido, nivel, cedula } = form;

    if (!nombre.trim() || !apellido.trim() || !nivel || !cedula.trim()) {
      setError('Completa todos los campos.');
      return;
    }
    if (!/^\d{6,10}$/.test(cedula.trim())) {
      setError('La cédula debe tener solo números (6 a 10 dígitos).');
      return;
    }

    setError('');
    onGuardar({
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      nivel,
      cedula: cedula.trim(),
    });
  };

  // Vacía el formulario y también borra el perfil guardado en el celular
  const limpiar = () => {
    setForm({ nombre: '', apellido: '', nivel: '', cedula: '' });
    setError('');
    onBorrar();
  };

  return (
    <View>
      <TextInput label="Nombre" mode="outlined" value={form.nombre} onChangeText={cambiar('nombre')} style={styles.input} />
      <TextInput label="Apellido" mode="outlined" value={form.apellido} onChangeText={cambiar('apellido')} style={styles.input} />
      <TextInput label="Cédula" mode="outlined" keyboardType="numeric" value={form.cedula} onChangeText={cambiar('cedula')} style={styles.input} />

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

  // Esperamos a que termine de leer el almacenamiento para no mostrar el formulario vacío por error
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
  chips: { flexDirection: 'row', flexWrap: 'wrap' },
  chip: { marginRight: 8, marginBottom: 8 },
  fila: { flexDirection: 'row', justifyContent: 'center' },
  boton: { marginRight: 8 },
});