import { COLORS } from "@/constants/theme";
import React from "react";
import { View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

const Loader = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator color={COLORS.primaryLight} size="large" />
    </View>
  );
};

export default Loader;
