#!/usr/bin/env node

/**
 * Este script se usa para restablecer el proyecto a un estado vacío.
 * Elimina o mueve los directorios /src y /scripts a /example según la entrada del usuario y crea un nuevo directorio /src/app con los archivos index.tsx y _layout.tsx.
 * Puedes quitar el script `reset-project` de package.json y borrar este archivo de forma segura después de ejecutarlo.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["src", "scripts"];
const exampleDir = "example";
const newAppDir = "src/app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Edita src/app/index.tsx para cambiar esta pantalla.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Crear el directorio app-example
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 Se creó el directorio /${exampleDir}.`);
    }

    // Mover los directorios antiguos al directorio app-example o eliminarlos
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await fs.promises.rename(oldDirPath, newDirPath);
          console.log(`➡️ /${dir} se movió a /${exampleDir}/${dir}.`);
        } else {
          await fs.promises.rm(oldDirPath, { recursive: true, force: true });
          console.log(`❌ /${dir} eliminado.`);
        }
      } else {
        console.log(`➡️ /${dir} no existe, se omite.`);
      }
    }

    // Crear el nuevo directorio /src/app
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 Se creó el directorio /src/app.");

    // Crear index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 Se creó src/app/index.tsx.");

    // Crear _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 Se creó src/app/_layout.tsx.");

    console.log("\n✅ Reinicio del proyecto completado. Siguientes pasos:");
    console.log(
      `1. Ejecuta \`npx expo start\` para iniciar el servidor de desarrollo.\n2. Edita src/app/index.tsx para cambiar la pantalla principal.\n3. Coloca todo el código de tu aplicación en /src; solo las pantallas y el layout deben ir en /src/app.${
        userInput === "y"
          ? `\n4. Elimina el directorio /${exampleDir} cuando termines de referenciarlo.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error durante la ejecución del script: ${error.message}`);
  }
};

rl.question(
  "¿Quieres mover los archivos existentes a /example en lugar de eliminarlos? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Entrada no válida. Ingresa 'Y' o 'N'.");
      rl.close();
    }
  }
);
