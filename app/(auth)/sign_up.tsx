import { COLORS } from "@/constants/theme";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }

    setLoading(true);

    try {
      const result = await signUp.create({
        emailAddress,
        password,
      });

      setVisible(true);
      setSnackbarMessage("Sign up successfully!");
      router.push("/");
    } catch (err: any) {
      const message =
        err?.errors?.[0]?.long_message ||
        err?.message ||
        "Something went wrong during sign up.";
      setVisible(true);
      setSnackbarMessage(message);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setVisible(false);
      }, 5000);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Create Account
          </Text>
          <Text style={{ color: COLORS.textLight, textAlign: "center" }}>
            Join our community
          </Text>
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
        <Snackbar visible={visible} onDismiss={() => setVisible(false)}>
          {snackbarMessage}
        </Snackbar>
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
      </>

      <Snackbar
        visible={visible}
        onDismiss={() => setVisible(false)}
        duration={5000}
      >
        {snackbarMessage}
      </Snackbar>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    marginBottom: 32,
    textAlign: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: COLORS.primaryDark,
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
