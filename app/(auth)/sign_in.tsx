import { COLORS } from "@/constants/theme";
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";

export default function Page() {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

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
      }
      setSnackbarMessage("Sign in successfully!");
      setVisible(true);
      router.push("/");
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      const message =
        err?.errors?.[0]?.long_message ||
        err?.message ||
        "Something went wrong during sign in.";
      setSnackbarMessage(message);
      setVisible(true);
    }
  };
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View>
        <Snackbar
          visible={visible}
          onDismiss={() => setVisible(false)}
          duration={5000}
          style={{
            position: "absolute",
            backgroundColor: COLORS.surface,
            borderRadius: 10,
          }}
        >
          {snackbarMessage}
        </Snackbar>
        <Image
          source={require("@/assets/images/icon.png")} // ✅ Load from assets
          style={{ width: 50, height: 50, marginHorizontal: "auto" }}
          resizeMode="cover"
        />
        <View>
          <Text variant="headlineMedium" style={styles.title}>
            FunnyGram
          </Text>
          <Text style={{ color: COLORS.textMuted, textAlign: "center" }}>
            {/* inspirational sentence */}
            don't miss any thing
          </Text>
        </View>
        <Image
          source={require("@/assets/images/hero4.png")} // ✅ Load from assets
          style={{ width: "100%", height: 300 }}
          resizeMode="cover"
        />

        <View>
          <TextInput
            style={styles.input}
            autoFocus={true}
            mode="outlined"
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholderTextColor={COLORS.textLight}
          />

          <TextInput
            style={styles.input}
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureTextEntry}
            placeholderTextColor={"white"}
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
      </View>
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
