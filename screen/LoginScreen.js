import React, { Component, useEffect, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Keyboard,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Image,
  Button,
  Platform,
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import Constants from "expo-constants";
import styles from "./style";
import * as Facebook from "expo-auth-session/providers/facebook";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { ResponseType, makeRedirectUri } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import {
  OAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import * as Font from "expo-font";
import { auth, db, store } from "../Components/Event/Firestore";
import { useTheme } from "react-native-paper";
import { AntDesign, Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { addDoc, collection, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider,
} from "firebase/auth";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { navigate } from "../Nav/RootNavigation";
import { discovery } from "expo-auth-session/providers/google";
import { uid } from "uid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { openURL } from "expo-linking";
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const [secureTextEntry, setsecurePassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [startGoogleLogin, setstartGoogleLogin] = useState(false);
  const [startFacebookLogin, setstartFacebookLogin] = useState(false);
  const [valid, setvalid] = useState(false);
  const [text, setText] = useState("");
  const { colors } = useTheme();
  const [isAppleLoginAvailable, setIsAppleLoginAvailable] = useState(false);
// alert(isLoading)
  useEffect(() => {
    AppleAuthentication.isAvailableAsync().then(setIsAppleLoginAvailable);
  }, []);
  const EXPO_REDIRECT_PARAMS = {
    useProxy: true,
    projectNameForProxy: "@dix107/Sportana",
  };
  const NATIVE_REDIRECT_PARAMS = {
    native: "com.company.sportana://",
  };
  const REDIRECT_PARAMS =
    Constants.appOwnership === "expo"
      ? EXPO_REDIRECT_PARAMS
      : NATIVE_REDIRECT_PARAMS;
  const redirectUri = makeRedirectUri(REDIRECT_PARAMS);
   
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId:
      "257278662825-mklbvk64rq06qrb5g3ti4r35rpf3jvc6.apps.googleusercontent.com",
    clientId:
      "257278662825-tbrke466mhrd6n996kg4utrkbiu1fb86.apps.googleusercontent.com",
    androidClientId:
      "257278662825-0cd900uota0k1jdcus36l0u7h69g0s8i.apps.googleusercontent.com",
    webClientId:
      "257278662825-tbrke466mhrd6n996kg4utrkbiu1fb86.apps.googleusercontent.com",
    iosClientId:
      "257278662825-q6l35eubtos5eobojq718fr2grmoa00h.apps.googleusercontent.com",
    redirectUri: redirectUri,
  });
  const FB = Facebook.useAuthRequest({
    responseType: ResponseType.Token,
    clientId: "521450439455524",
    expoClientId: "521450439455524",
    androidClientId: "521450439455524",
    iosClientId: "521450439455524",
    redirectUri: "fb521450439455524://authorize",
  });

  const signInWithApple = async () => {
    setIsLoading(true);
    const nonce = Math.random().toString(36).substring(2, 10);

    return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, nonce)
      .then((hashedNonce) =>
        AppleAuthentication.signInAsync({
          requestedScopes: [
            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
            AppleAuthentication.AppleAuthenticationScope.EMAIL,
          ],
          nonce: hashedNonce,
        })
      )
      .then((appleCredential) => {
        const { identityToken } = appleCredential;
        const provider = new OAuthProvider("apple.com");
        console.log(appleCredential);
        const credential = provider.credential({
          idToken: identityToken,
          rawNonce: nonce,
        });
        return signInWithCredential(auth, credential).then(() => {
          AsyncStorage.setItem("Method","Apple")
          if(appleCredential.fullName.givenName){
            addDoc(collection(db,"user",appleCredential.email,"profile"),{
              firstname:appleCredential.fullName.givenName,
              lastname:appleCredential.fullName.familyName,
              image:"https://res.cloudinary.com/dz7xfhqxk/image/upload/v1656943883/Image/WhatsApp_Image_2022-07-02_at_16.20.59-removebg-preview_oomv2c.png"
            })
          }
          setIsLoading(false);

        });
        // Successful sign in is handled by firebase.auth().onAuthStateChanged
      })
      .catch((error) => {
        setIsLoading(false);
        alert("Network error");
        // ...
      });
  };

  const [loded] = Font.useFonts({
    comfortaa: require("../comfortaa-main/comfortaa-main/fonts/OTF/Comfortaa-Regular.otf"),
    bold: require("../comfortaa-main/comfortaa-main/fonts/OTF/Comfortaa-Bold.otf"),
  });

  const handleLogin = async () => {
    if (email.length > 0 && password.length > 0) {
      if (password.length >= 6) {
        setIsLoading(true);
        // console.log(valid);
        const profileref = collection(db, `user/${email.trim()}/profile`);
        const data = onSnapshot(profileref, (query) => {
          if (query.empty) {
            signInWithEmailAndPassword(auth, email.trim(), password.trim())
              .then((user) => {
                AsyncStorageLib.setItem("email", email.trim());
                setIsLoading(false);
                // console.log(users)
                // alert("yupp");
                navigation.navigate("Profile", {
                  email: email,
                });
                AsyncStorage.setItem("Method","email")

              })
              .catch((err) => {
                setIsLoading(false);
                switch (err.code) {
                  case "auth/email-already-exists":
                    setError("Email already in use !");
                    break;
                  case "auth/invalid-email":
                    setError("Email and Password is incorrect");
                    break;
                  case "auth/invalid-password":
                    setError("Password is incorrect");
                    break;
                  case "auth/user-not-found":
                    setError("user not registered");
                    break;
                  case "auth/wrong-password":
                    setError("The email or password is incorrect");
                }
                console.log(err.code);
                // setError(err.message)
                navigation.navigate("Login");
              });
          } else {
            signInWithEmailAndPassword(auth, email.trim(), password.trim())
              .then((user) => {
                setIsLoading(false);
                // console.log(user)
                AsyncStorage.setItem("Method","email")

                navigation.navigate("Home");
              })
              .catch((err) => {
                setIsLoading(false);
                switch (err.code) {
                  case "auth/email-already-exists":
                    setError("Email already in use !");
                    break;
                  case "auth/invalid-email":
                    setError("Email and Password is incorrect");
                    break;
                  case "auth/invalid-password":
                    setError("Password is incorrect");
                    break;
                  case "auth/user-not-found":
                    setError("user not registered");
                    break;
                  case "auth/wrong-password":
                    setError("The email or password is incorrect");
                }
                console.log(err.code);

                // setError(err.message)
                navigation.navigate("Login");
              });
          }
        });
      } else {
        setError("Enter a password more than 6 characters");
      }
    } else {
      setError("Enter a email and password");
    }
  };

  useEffect(() => {
    if (startGoogleLogin) {
      if (response?.type === "success") {
        setIsLoading(true);
        // console.log(response);
        const { id_token } = response.params;

        const credential = GoogleAuthProvider.credential(id_token);
        fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+id_token).then((response) => {
          return response.json()
        }).then(async(json) => {
          // console.log(json)
          const data=await getDoc(doc(db,"user",json.email))
          
          if(!data.exists()){
          addDoc(collection(db,"user",json.email,"profile"),{
            image:json.picture,
            firstname:json.family_name,
            lastname:json.given_name
          }).then(()=>{

         LogWithCredentials(credential)
          })
        }
        else{
          LogWithCredentials(credential)
        }
        })
      
      }
    }
  }, [response]);

  useEffect(() => {
    if (startFacebookLogin) {
      if (FB[1]?.type === "success") {
        const { access_token } = FB[1]?.params;

        const provider = new FacebookAuthProvider();
        provider.addScope("public_profile");
        provider.addScope("email");
        // const credential = provider.credential(access_token);

        // Sign in with the credential from the Facebook user.
        signInWithCredential(
          auth,
          FacebookAuthProvider.credential(access_token)
        ).then((data) => {
          setstartFacebookLogin(false);
        });
      }
    }
  }, [FB[1]]);
  const signInWithFB = async () => {
    FB[2]().then(() => {
      setstartFacebookLogin(true);
    });
  };

  const LogWithCredentials = async (credential) => {
    signInWithCredential(auth, credential)
    .then((user) => {
      setIsLoading(false);
    AsyncStorage.setItem("Method","Google")

      
      setstartGoogleLogin(false);

    })
    .catch((e) => {
      alert("Network error");
      setIsLoading(false);
    });
  }

  //   LayoutAnimation.easeInEaseOut();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  const updateSecureTextEntry = () => {
    setsecurePassword(!secureTextEntry);
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <Text>{text}</Text>
        <View style={{ justifyContent: "center", marginBottom: 30 }}>
          <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              width: 150,
              height: 150,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <Image
              source={require("../Photo/logo2.png")}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </View>
          <View style={styles.header}>
            <Text style={[styles.text_header, { fontFamily: "comfortaa" }]}>
              Welcome to Sportana
            </Text>
          </View>

          <View style={styles.errorMessage}>
            {!!error && (
              <Text style={[styles.error, { fontFamily: "comfortaa" }]}>
                {error}
              </Text>
            )}
          </View>

          <View style={styles.action}>
            <TextInput
              placeholder="Email"
              placeholderTextColor="#666666"
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  marginLeft: "10%",
                  fontFamily: "comfortaa",
                },
              ]}
              autoCapitalize="none"
              onChangeText={(val) => setEmail(val)}
            />
          </View>

          <View style={styles.action}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#666666"
              secureTextEntry={secureTextEntry}
              style={[
                styles.textInput,
                {
                  color: colors.text,
                  marginLeft: "10%",
                  fontFamily: "comfortaa",
                },
              ]}
              autoCapitalize="none"
              onChangeText={(val) => setPassword(val)}
            />
            <TouchableOpacity
              onPress={updateSecureTextEntry}
              style={{ marginRight: "10%" }}
            >
              {secureTextEntry ? (
                <Feather name="eye-off" color="grey" size={20} />
              ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.button}>
            <TouchableOpacity style={styles.signIn} onPress={handleLogin}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#fff",
                    fontFamily: "bold",
                  },
                ]}
              >
                Login
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ForgatPassword");
            }}
          >
            <Text
              style={{
                color: "#2F80ED",
                marginTop: 15,
                textAlign: "center",
                fontFamily: "comfortaa",
              }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              textAlign: "center",
              marginTop: 10,
              fontSize: 16,
              fontFamily: "bold",
            }}
          >
            -OR-
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15,
            }}
          >
            <TouchableOpacity
              disabled={!request}
              style={{
                // marginRight: 10,
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#77C375",
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={() => {
                setstartGoogleLogin(true);
                promptAsync(discovery, { useProxy: true, showInRecents: true });
              }}
            >
              <Image
                source={require("../assets/google.jpg")}
                style={{width:50,height:50}}
              />
            </TouchableOpacity>

            {Platform.OS === "ios" && (
              <TouchableOpacity
              style={{width:50,height:50,backgroundColor:"black",borderRadius:25,alignItems:"center",justifyContent:"center",marginLeft:10}}
              onPress={()=>{
                signInWithApple()
            
              }}
              >
                
                  <AntDesign name="apple1" size={24} color="white"/>
              </TouchableOpacity>
            )}

            {/* 
            <TouchableOpacity disabled={!FB[0]} onPress={signInWithFB}>
              <Entypo name="facebook-with-circle" size={48} color="#3b5998" />
            </TouchableOpacity> */}
          </View>
          <View style={{alignItems:"center",flexDirection:"row"}}>

<Text>
  By Continuing, you're agree to our</Text>
  <TouchableOpacity style={{justifyContent:"center"}} onPress={()=>openURL("https://www.termsandconditionsgenerator.com/live.php?token=YdaanGspdO2wNDbDqvmYeHgiq7tYM7rV")} >
    <Text style={{ color: "#7BCB78"}}> Terms & Conditions</Text>
  </TouchableOpacity>
</View>
<View style={{alignItems:"center",flexDirection:"row"}}>

  <Text>and</Text>
   <TouchableOpacity onPress={()=>openURL("https://www.apppolicy.live/sportana-914841/Privacy")}>
       
    <Text style={{ color: "#7BCB78"}}> Privacy Policy</Text>
  </TouchableOpacity>
</View>
          <TouchableOpacity
            style={{
              marginTop: 10,

              alignItems: "center",
              // backgroundColor: "red",
            }}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={{ fontFamily: "comfortaa" }}>
              Don’t have an account yet?
              <Text
                style={{
                  color: "#7BCB78",
                  marginHorizontal: 5,
                  fontFamily: "comfortaa",
                }}
              >
                {" "}
                Register
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default LoginScreen;
