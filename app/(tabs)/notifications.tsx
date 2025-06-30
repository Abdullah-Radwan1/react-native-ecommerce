import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Link } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Notifications() {
  const notifications = useQuery(api.notification.getNotification);

  if (!notifications) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (notifications.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No Notifications Yet 💌</Text>
      </View>
    );
  }
  return (
    <View>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Link href={`/user/${item.user.id}`} asChild>
              <TouchableOpacity>
                <Image
                  source={{ uri: item.user.image }}
                  style={styles.avatar}
                />
              </TouchableOpacity>
            </Link>

            <View style={styles.textContent}>
              <Link href={`/user/${item.user.id}`} asChild>
                <TouchableOpacity>
                  <Text style={styles.username}>{item.user.username}</Text>
                </TouchableOpacity>
              </Link>
              <Text style={styles.message}>
                {item.type === "like"
                  ? " Liked Your Post ❤️"
                  : item.type === "comment"
                    ? ` Commented: "${item.comment?.content}" 💬`
                    : "Started Following You"}
              </Text>
            </View>

            {item.postImage && (
              <Image
                source={{ uri: item.postImage }}
                style={styles.postThumb}
              />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
    padding: 10,
    color: COLORS.primaryLight,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
    backgroundColor: "#000",
  },
  emptyText: {
    color: COLORS.primaryLight,
    fontSize: 18,
  },
  listContainer: {
    padding: 10,
    backgroundColor: "#000",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e1e1e",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginRight: 10,
  },
  textContent: {
    flex: 1,
  },
  username: {
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
  message: {
    color: "#ccc",
    fontSize: 14,
    marginTop: 2,
  },
  postThumb: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginLeft: 8,
  },
});
