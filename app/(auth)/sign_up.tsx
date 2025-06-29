import { COLORS } from "@/constants/theme";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";

export default function SignUpScreen() {
  const { isLoaded, signUp } = useSignUp();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Basic client-side validation
    if (!emailAddress || !password) {
      setSnackbarMessage("Email and password are required.");
      setVisible(true);
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.create({
        emailAddress,
        password,
      });

      setSnackbarMessage("Sign up successfully!");
      setVisible(true);
      router.push("/home");
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.long_message ||
        err?.message ||
        "Something went wrong during sign up.";
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
          style={{
            position: "absolute",
            backgroundColor: COLORS.surface,
            borderRadius: 10,
          }}
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={5000}
        >
          {snackbarMessage}
        </Snackbar>
        <Image
          source={require("@/assets/images/icon2.png")} // ✅ Load from assets
          style={{ width: 50, height: 50, marginHorizontal: "auto" }}
          resizeMode="cover"
        />
        <View>
          <View>
            <Text variant="headlineMedium" style={styles.title}>
              FunnyGram
            </Text>
            <Text style={{ color: COLORS.textLight, textAlign: "center" }}>
              Join our community
            </Text>
          </View>
          <Image
            source={require("@/assets/images/hero4.png")} // ✅ Load from assets
            style={{ width: "100%", height: 300, marginHorizontal: "auto" }}
            resizeMode="cover"
          />
        </View>

        <TextInput
          mode="outlined"
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={emailAddress}
          onChangeText={setEmailAddress}
          style={styles.input}
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? "eye-off" : "eye"}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
        />

        <Button
          mode="contained"
          onPress={onSignUpPress}
          loading={loading}
          disabled={loading}
          style={styles.button}
          textColor="white"
        >
          Continue
        </Button>

        <View style={styles.footer}>
          <Text style={{ color: COLORS.textLight }}>
            Already have an account?
          </Text>
          <Link href="/sign_in" asChild>
            <Button mode="text" compact textColor={COLORS.text}>
              Sign In
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
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 24,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    gap: 4,
  },
});
