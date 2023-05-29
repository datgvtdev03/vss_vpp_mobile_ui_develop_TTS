import "react-native-gesture-handler";
import { AppRegistry } from "react-native";
import { name as appName } from "./app.json";
import { LogBox } from "react-native";
LogBox.ignoreLogs([
  "Setting a timer",
  "EventEmitter.removeListener",
  "Object {}",
]);

import App from "./App";

AppRegistry.registerComponent(appName, () => App);
