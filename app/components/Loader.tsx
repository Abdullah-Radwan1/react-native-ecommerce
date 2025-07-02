import { COLORS } from "@/constants/theme";
import React from "react";
import { ActivityIndicator } from "react-native-paper";

const Loader = () => {
  return (
    <ActivityIndicator
      style={{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        alignItems: "center",
      }}
      color={COLORS.primaryLight}
      size="large"
    />
  );
};

export default Loader;
