import { registerRootComponent } from 'expo';

import App from './App';

// registerRootComponent llama a AppRegistry.registerComponent('main', () => App);
// También garantiza que, tanto si cargas la app en Expo Go como en una compilación nativa,
// el entorno quede configurado correctamente.
registerRootComponent(App);
