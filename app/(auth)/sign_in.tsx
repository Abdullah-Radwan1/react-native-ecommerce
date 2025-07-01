import { COLORS } from "@/constants/theme";
import { useSignIn, useSSO } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Snackbar, Text } from "react-native-paper";

export default function SignInScreen() {
  const { isLoaded } = useSignIn();
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    setLoading(true);
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: undefined,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        setSnackbarMessage("Signed in successfully!");
        setVisible(true);

        router.replace("/(tabs)/home"); // ✅ You control this now
        await setActive({ session: createdSessionId }); // ⬅️ Important!
      }
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.long_message ||
        err?.message ||
        "Something went wrong during sign in.";
      setSnackbarMessage(message);
      setVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View>
        <Snackbar
          style={styles.snackbar}
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={5000}
        >
          {snackbarMessage}
        </Snackbar>

        <Image
          source={require("@/assets/images/icon.png")}
          style={{ width: 50, height: 50, marginHorizontal: "auto" }}
          resizeMode="cover"
        />

        <View>
          <Text variant="headlineMedium" style={styles.title}>
            FunnyGram
          </Text>
          <Text style={{ color: COLORS.textLight, textAlign: "center" }}>
            Welcome back!
          </Text>
        </View>

        <Image
          source={require("@/assets/images/hero4.png")}
          style={{ width: "100%", height: 300, marginHorizontal: "auto" }}
          resizeMode="cover"
        />

        <TouchableOpacity>
          <Button
            mode="contained"
            onPress={onSignInPress}
            loading={loading}
            disabled={loading}
            style={styles.button}
            textColor="white"
            contentStyle={{
              flexDirection: "row-reverse",
            }}
            icon={() => (
              <Ionicons
                name="logo-google"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
            )}
          >
            Sign In with Google
          </Button>
        </TouchableOpacity>

        <Text
          style={{
            color: COLORS.textLight,
            textAlign: "center",
            fontSize: 12,
            marginTop: 10,
            lineHeight: 18,
          }}
        >
          by continuing you agree to our Terms of Service.
        </Text>

        <View style={styles.footer}>
          <Text style={{ color: COLORS.text }}>Don't have an account?</Text>
          <Link href="/sign_up" asChild>
            <Button mode="text" compact textColor={COLORS.text}>
              Sign Up
            </Button>
          </Link>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 35,
    textAlign: "center",
    marginBottom: 4,
    color: COLORS.primaryLight,
    fontFamily: "jetBrainsMono-Medium",
    letterSpacing: 2,
  },
  button: {
    marginTop: 24,
    alignItems: "center",
  },
  snackbar: {
    position: "absolute",
    backgroundColor: COLORS.surface,
    borderRadius: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    gap: 4,
  },
});
