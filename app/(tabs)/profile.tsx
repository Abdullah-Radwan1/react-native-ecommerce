import React, { Component } from "react";
import { StyleSheet, View } from "react-native";
import { SignOutButton } from "../(auth)/sign_out_button";

export default class profile extends Component {
  render() {
    return (
      <View>
        <SignOutButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({});
