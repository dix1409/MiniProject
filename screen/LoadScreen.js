import React from "react";
import { ImageBackground, StyleSheet, View, Image, Text } from "react-native";
import * as Font from "expo-font";
export default function LoadScreen(props) {
  // const [loaded] = Font.useFonts({
  //   comfortaa: require("../comfortaa-main/comfortaa-main/fonts/OTF/Comfortaa-Regular.otf"),
  //   bold: require("../comfortaa-main/comfortaa-main/fonts/OTF/Comfortaa-Bold.otf"),
  // });
  return (
    <View style={styles.container}>
      <Image
        source={require("../Photo/splashimage.png")}
        style={{ width: "100%", height: "100%" }}
        resizeMode="contain"
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#75c475",
  },
});
