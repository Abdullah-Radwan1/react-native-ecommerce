import { formatDistanceToNow } from "date-fns";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type Comment = {
  content: string;
  _creationTime: number;
  user: {
    username?: string;
    image?: string;
  };
};

export default function Comment({ comment }: { comment: Comment }) {
  // Format the creation time (e.g., "2 days ago")
  const formattedTime = formatDistanceToNow(new Date(comment._creationTime), {
    addSuffix: true,
  });

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Image source={{ uri: comment.user.image }} style={styles.avatar} />
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.username}>{comment.user.username}</Text>
          <Text style={styles.commentText}>{comment.content}</Text>
        </View>

        <Text style={styles.time}>{formattedTime}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  userContainer: {
    flexDirection: "row",

    marginBottom: 8,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  username: {
    fontWeight: "600",
    marginRight: 8,
    fontSize: 15,
    color: "white",
  },
  time: {
    color: "white",
    fontSize: 11,
    fontWeight: "200",
    marginTop: 2,
  },
  commentText: {
    fontSize: 14,
    lineHeight: 30,
    color: "white",
  },
});
