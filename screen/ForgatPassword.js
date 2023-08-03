import React, { useState, useEffect } from "react"
import {
  StyleSheet,
  View,
  Text,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
} from "react-native"
// import FontAwesome from "react-native-vector-icons/FontAwesome"
import styles from "./style"
import { useTheme } from "react-native-paper"
import { db, auth } from "../Components/Event/Firestore"
import { sendPasswordResetEmail } from "firebase/auth"
import { LinearGradient } from "expo-linear-gradient"
import * as Animatable from "react-native-animatable"
import { FontAwesome } from "@expo/vector-icons"
const { height, width } = Dimensions.get("window")
export default function ForgatPassword({ navigation }) {
  const [email, setemail] = useState("")
  const [error, setError] = useState("")
  const [visible, setvisible] = useState(false)
  const { colors } = useTheme()

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email.trim())
      console.log("Password reset email sent successfully")
      setvisible(true)
      setTimeout(() => {
        setvisible(false)
        navigation.navigate("Login")
      }, 5000)
    } catch (error) {
      setError(error)
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          height: height,
          width: width,
          // alignItems: "center",
          backgroundColor: "#fff",
          paddingTop: height * 0.15,
        }}
      >
        <StatusBar backgroundColor="#FFF" barStyle="dark-content" />
        <View style={styles.header}>
          <Text style={styles.text_header}>Forgot Password</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.errorMessage}>
            {!!error && <Text style={styles.error}>{error}</Text>}
          </View>
          <Modal transparent visible={visible}>
            <View
              style={{
                flex: 1,
                backgroundColor: "rgba(0,0,0,0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  width: "80%",
                  backgroundColor: "#fff",
                  paddingVertical: 30,
                  paddingHorizontal: 20,
                }}
              >
                <View style={{ alignItems: "center" }}>
                  <View
                    style={{
                      width: "100%",
                      height: 40,
                      alignItems: "flex-end",
                      justifyContent: "center",
                    }}
                  >
                    <Image
                      source={require("../Photo/OIP-removebg-preview.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                      onPress={() => {
                        setvisible(false)
                      }}
                    >
                      <Image
                        source={require("../Photo/R.png")}
                        style={{
                          width: 150,
                          height: 150,
                          marginVertical: 10,
                        }}
                      />
                    </TouchableOpacity>
                  </View>

                  <Text
                    style={{
                      alignItems: "center",
                      marginVertical: 30,
                      fontSize: 20,
                    }}
                  >
                    You can change password by using link we will send in Email
                  </Text>
                </View>
              </View>
            </View>
          </Modal>
          <Text
            style={[
              styles.text_footer,
              {
                color: colors.text,
                // width: "100%",
              },
            ]}
          >
            Email Address
          </Text>
          <View style={styles.action}>
            <FontAwesome name="user-o" color={colors.text} size={20} />
            <TextInput
              placeholder="Your Email"
              placeholderTextColor="#666666"
              style={[
                styles.textInput,
                {
                  color: colors.text,
                },
              ]}
              autoCapitalize="none"
              onChangeText={(val) => setemail(val)}
            />
          </View>

          <View style={styles.button}>
            <TouchableOpacity
              style={[
                styles.signIn,
                {
                  backgroundColor: "#77C375",
                },
              ]}
              onPress={handlePasswordReset}
            >
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#fff",
                  },
                ]}
              >
                Send Link
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[
                styles.signIn,
                {
                  marginTop: 15,
                  backgroundColor: "#000",
                },
              ]}
            >
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#fff",
                  },
                ]}
              >
                Back
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
