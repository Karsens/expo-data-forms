import React from "react";
import { Text, View, Button } from "react-native";

import Header from "../components/Header";
export default function App({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <Header navigation={navigation} />

      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Welcome to this example</Text>
      </View>
    </View>
  );
}
