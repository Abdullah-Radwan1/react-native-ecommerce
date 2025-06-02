import { COLORS } from "@/constants/theme";
import { useAuth, useSignIn } from "@clerk/clerk-expo";
import { Link, Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";

export default function Page() {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const { isSignedIn } = useAuth();
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const [emailError, setEmailError] = React.useState("");
  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [secureTextEntry, setSecureTextEntry] = React.useState(true);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [visible, setVisible] = useState(false);

  const validateEmail = () => {
    if (!emailAddress.trim()) {
      setEmailError("Email is required");
      return false;
    }
    setEmailError("");
    return true;
  };

  // Modify your submit handler

  const onSignInPress = async () => {
    if (!isLoaded || !validateEmail()) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      }
      setSnackbarMessage("Sign in successfully!");
      setVisible(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const message =
        err?.errors?.[0]?.long_message ||
        err?.message ||
        "Something went wrong during sign in.";
    }
  };
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);
  if (isSignedIn) {
    return <Redirect href={"/"} />;
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>
          Welcome Back
        </Text>
        <Text
          variant="bodyMedium"
          style={{ color: COLORS.text, textAlign: "center" }}
        >
          Sign in to continue
        </Text>
      </View>

      <View>
        <TextInput
          autoFocus={true}
          mode="outlined"
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={emailAddress}
          onChangeText={setEmailAddress}
          style={styles.input}
          theme={{ roundness: 8 }}
        />

        <TextInput
          mode="outlined"
          label="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          theme={{ roundness: 8 }}
          right={
            <TextInput.Icon
              icon={secureTextEntry ? "eye-off" : "eye"}
              onPress={() => setSecureTextEntry(!secureTextEntry)}
            />
          }
        />
        {emailError ? (
          <Text
            style={{
              color: "red",

              textAlign: "center",
            }}
          >
            {emailError}
          </Text>
        ) : null}
        <Button
          mode="contained"
          onPress={onSignInPress}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Sign In
        </Button>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Link href="/sign_up" asChild>
            <Button mode="text" textColor={COLORS.text} compact>
              Sign Up
            </Button>
          </Link>
        </View>
      </View>
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
    padding: 20,
    justifyContent: "center",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  title: {
    textAlign: "center",
    marginBottom: 4,
    color: COLORS.primaryDark,
  },

  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  button: {
    marginTop: 24,
  },
  buttonText: {
    color: "white",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    color: COLORS.textLight,
  },
});
