import { useClerk } from "@clerk/clerk-expo";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { SignOutButton } from "../(auth)/sign_out_button";

export default function Profile() {
  const { user } = useClerk();

  if (!user) return null;

  const fullName = user.fullName || "No name provided";
  const email = user.primaryEmailAddress?.emailAddress || "No email";
  const imageUrl = user.imageUrl;

  return (
    <View style={styles.container}>
      <Image source={{ uri: imageUrl }} style={styles.profileImage} />
      <Text style={styles.name}>{fullName}</Text>
      <Text style={styles.email}>{email}</Text>

      <View style={styles.signOutButton}>
        <SignOutButton />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    alignItems: "center",
    height: "100%",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#ffffff",
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
  },
  signOutButton: {
    marginTop: 20,
  },
});
