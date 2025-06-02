import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Favourite() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Favourite</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1c1f26", // Cool dark blue-gray
    padding: 16,
  },
  text: {
    color: "white", // readable text on black
    fontSize: 18,
  },
});
