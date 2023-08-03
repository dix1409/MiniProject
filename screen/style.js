import { StyleSheet } from "react-native"
import { useFonts } from "expo-font"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",

    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "center",
    //alignItems: "center",
    width: "100%",
    height: "100%",
  },
  header: {
    justifyContent: "flex-end",
    alignItems: "center",
  },
  footer: {
    flex: 3,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 30,
    margin: "auto",
  },
  text_header: {
    color: "#333",
    // fontWeight: "bold",
    fontSize: 26,
    // fontFamily: "comfortaa",
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
    marginTop: 5,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,

    backgroundColor: "#F0F0F0",
    paddingBottom: 5,
    height: 60,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    width:"100%",
    height:"100%",

    color: "#05375a",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: 249,
    height: 64,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 56,
    backgroundColor: "#77C375",
  },
  textSign: {
    fontSize: 18,
    // fontWeight: "bold",
  },
  errorMessage: {
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  error: {
    color: "#FF3B30",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    color: "#000",
    fontSize: 14,
    marginTop: 10,
    maxWidth: "70%",
    textAlign: "center",
    lineHeight: 23,
  },
  title: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  indicator: {
    height: 10,
    width: 10,
    backgroundColor: "grey",
    marginHorizontal: 3,
    borderRadius: 20,
  },
  btn: {
    flex: 1,
    height: 50,
    borderRadius: 5,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
})
export default styles
