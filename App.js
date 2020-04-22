import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./app/navigation/Navigation";
import { firebaseApp } from "./app/utils/FireBase";
import { YellowBox } from "react-native";

import { decode, encode } from "base-64";

global.crypto = require("@firebase/firestore");
global.crypto.getRandomValues = (byteArray) => {
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = Math.floor(256 * Math.random());
  }
};

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

//Ignore warnings
YellowBox.ignoreWarnings(["Setting a timer"]);
YellowBox.ignoreWarnings(["componentWillReceiveProps"]);
YellowBox.ignoreWarnings(["componentWillMount"]);
YellowBox.ignoreWarnings([
  "Non-serializable values were found in the navigation state",
]);
YellowBox.ignoreWarnings([
  "VirtualizedLists should never be nested", // TODO: Remove when fixed
]);

export default function App() {
  return <Navigation />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
