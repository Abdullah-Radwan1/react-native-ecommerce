import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import React from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Loader from "../components/Loader";

export default function Booked() {
  const bookedPosts = useQuery(api.bookmarks.getBookmarks);

  if (!bookedPosts) {
    return <Loader />;
  }

  if (bookedPosts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No Bookmarks Yet 💔</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Bookmarks</Text>
      <View style={styles.grid}>
        {bookedPosts.map((post) => (
          <View key={post?._id} style={styles.imageWrapper}>
            <Image
              source={{ uri: post?.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const screenWidth = Dimensions.get("window").width;
const imageSize = screenWidth / 3 - 4 * 2; // width / 3 - margin

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 16,
    color: COLORS.primaryLight,
  },
  scrollContainer: {
    padding: 10,
    backgroundColor: "#000",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  imageWrapper: {
    width: imageSize,
    height: imageSize,
    marginBottom: 6,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
  emptyText: {
    color: COLORS.primaryLight,
    fontSize: 24,
    textAlign: "center",
  },
});
