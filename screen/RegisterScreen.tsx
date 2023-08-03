import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

import * as Font from "expo-font";
import styles from "./style";
import {
  GoogleAuthProvider,
  signInWithCredential,
  FacebookAuthProvider,
  OAuthProvider,
} from "firebase/auth";
import * as Facebook from "expo-auth-session/providers/facebook";
import Constants from "expo-constants";
import * as WebBrowser from "expo-web-browser";
import {
  fetchUserInfoAsync,
  makeRedirectUri,
  ResponseType,
} from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import {
  Ionicons,
  Feather,
  FontAwesome,
  AntDesign,
  Entypo,
} from "@expo/vector-icons";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db, auth } from "../Components/Event/Firestore";
import { useTheme } from "react-native-paper";
import AsyncStorageLib from "@react-native-async-storage/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { uid } from "uid";
import { openURL } from "expo-linking";
import dayjs from "dayjs";
const { height, width } = Dimensions.get("window");

WebBrowser.maybeCompleteAuthSession();

const RegisterScreen = ({ navigation }) => {
  const [secureTextEntry, setsecurePassword] = useState(true);
  //const [confirm, setconfirm] = useState(true)
  const { colors } = useTheme();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [startGoogleLogin, setstartGoogleLogin] = useState(false);
  const [Load, setLoad] = useState(false);
  const [startFacebookLogin, setstartFacebookLogin] = useState(false);
  //const [avatar, setAvatar] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef<ScrollView>();
  const [loded] = Font.useFonts({
    comfortaa: require("../comfortaa-main/comfortaa-main/fonts/OTF/Comfortaa-Regular.otf"),
    bold: require("../comfortaa-main/comfortaa-main/fonts/OTF/Comfortaa-Bold.otf"),
  });

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
  // const FB = Facebook.useAuthRequest({
  //   responseType: ResponseType.Token,
  //   clientId: "521450439455524",
  //   expoClientId: "521450439455524",

  //   redirectUri: "https://auth.expo.io/@dix107/Sportana",
  // });

  useEffect(() => {
    if (startGoogleLogin) {
      if (response?.type === "success") {
        setIsLoading(true);
        // console.log(response);
        const { id_token } = response.params;

        const credential = GoogleAuthProvider.credential(id_token);
        fetch("https://www.googleapis.com/oauth2/v3/tokeninfo?id_token="+id_token).then((response) => {
          return response.json()
        }).then((json) => {
          console.log(json)

          addDoc(collection(db,"user",json.email,"profile"),{
            image:json.picture||"",
            firstname:json.family_name||"",
            lastname:json.given_name||"",
          }).then(()=>{
            
            signInWithCredential(auth, credential)
              .then((user) => {
                setIsLoading(false);
              AsyncStorage.setItem("Method","Google")
              setDoc(doc(db,"feed",json.email),{
                image:json.picture||"",
                title:`${json.family_name||""} ${json.given_name||""}  join the Sportana community`,
               time:new Date(),
               id:json.email
      
              })
                
                setstartGoogleLogin(false);
              })
              .catch((e) => {
                alert("Network error");
                setIsLoading(false);
              });
          }).catch(e=>{
            console.log(e.message);
            setIsLoading(false);
          })

        })
      }
    }
  }, [response]);

  // useEffect(() => {
  //   if (startFacebookLogin) {
  //     if (FB[1]?.type === "success") {
  //       const { access_token } = FB[1]?.params;

  //       const provider = new FacebookAuthProvider();
  //       provider.addScope("public_profile");
  //       provider.addScope("email");
  //       // const credential = provider.credential(access_token);

  //       // Sign in with the credential from the Facebook user.
  //       signInWithCredential(
  //         auth,
  //         FacebookAuthProvider.credential(access_token)
  //       ).then((data) => {
  //         setstartFacebookLogin(false);
  //       });
  //     }
  //   }
  // }, [FB[1]]);
  // const signInWithFB = async () => {
  //   FB[2]().then(() => {
  //     setstartFacebookLogin(true);
  //   });
  // };

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
        alert(appleCredential.fullName.familyName+appleCredential.fullName.givenName+appleCredential.fullName.middleName)
        AsyncStorage.setItem("apple",appleCredential.fullName.familyName+appleCredential.fullName.givenName+appleCredential.fullName.middleName)


        const provider = new OAuthProvider("apple.com");
        const credential = provider.credential({
          idToken: identityToken,
          rawNonce: nonce,
        });
        // console.log(credential)

        return signInWithCredential(auth, credential).then(() => {
          AsyncStorage.setItem("Method","Apple")
          if(appleCredential.fullName.givenName){
            addDoc(collection(db,"user",appleCredential.email,"profile"),{
              firstname:appleCredential.fullName.givenName||"",
              lastname:appleCredential.fullName.familyName||"",
              image:"https://res.cloudinary.com/dz7xfhqxk/image/upload/v1656943883/Image/WhatsApp_Image_2022-07-02_at_16.20.59-removebg-preview_oomv2c.png"
            })
          }
          setIsLoading(false);
        });
        // Successful sign in is handled by firebase.auth().onAuthStateChanged
      })
      .catch((error) => {
        alert("Network error");
        setIsLoading(false);
        // ...
      });
  };

  const handleSignUp = () => {
    if (password.trim().length < 6 || email === "") {
      setIsLoading(false);
      setError("Please enter password more then 6 characters");
      // navigation.navigate("Register")
      scrollRef.current?.scrollTo({
        y: 0,
        animated: true,
      });
    } else {
      setIsLoading(true);

      createUserWithEmailAndPassword(auth, email.trim(), password.trim())
        .then((user) => {
          console.log("yes");
          AsyncStorageLib.setItem("email", email.trim());

          setIsLoading(false),
            navigation.navigate("Profile", {
              email: email,
            }),
            setDoc(doc(db, "user", email), {
              userEmail: email,
              userPassword: password,
            });
          AsyncStorage.setItem("Method","email")

        })
        .catch((err) => {
          setIsLoading(false);
          // alert("error")
          console.log(err.message);
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
              break;
            case "auth/email-already-in-use":
              setError("Email already in use !");
              break;
            default:
              setError("Network error");
              break;
          }

          // navigation.navigate("Register")
        });
    }
  };

  const updateSecureTextEntry = () => {
    setsecurePassword(!secureTextEntry);
  };
  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
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

          {/* <Text
            style={[
              styles.text_footer,
              {
                color: colors.text,
              },
            ]}
          >
            Email Address
          </Text> */}
          <View style={styles.action}>
            {/* <FontAwesome name="user-o" color={colors.text} size={20} /> */}
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
            <TouchableOpacity style={styles.signIn} onPress={handleSignUp}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#fff",
                    fontFamily: "bold",
                  },
                ]}
              >
                Register
              </Text>
            </TouchableOpacity>
          </View>
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
                promptAsync();
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
          </View>
          <View style={{alignItems:"center",flexDirection:"row"}}>

          <Text>
            By Signing up, you're agree to our</Text>
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
            style={{ marginTop: 40, width: "100%", alignItems: "center" }}
            onPress={() => navigation.navigate("Login")}
          >
            <Text style={{ fontFamily: "comfortaa" }}>
              Already have an account?
              <Text
                style={{
                  color: "#7BCB78",
                  marginHorizontal: 5,
                  fontFamily: "comfortaa",
                }}
              >
                {" "}
                Log in
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#ffffff",

//     paddingHorizontal: 20,
//     // paddingVertical: 30,
//     justifyContent: "center",
//     //alignItems: "center",
//     width: "100%",
//     height: "100%",
//   },
//   header: {
//     flex: 1,
//     justifyContent: "flex-end",
//     alignItems: "center",
//     // paddingHorizontal: 20,
//     // paddingBottom: 50,
//     // marginTop: 30,
//   },
//   footer: {
//     flex: Platform.OS === "ios" ? 3 : 5,
//     backgroundColor: "#fff",
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     paddingHorizontal: 20,

//     marginBottom: 40,
//   },
//   text_header: {
//     color: "#000",
//     // fontWeight: "bold",
//     fontSize: 26,
//     textAlign: "center",
//     fontFamily: "bold",
//   },
//   text_footer: {
//     color: "#05375a",
//     fontSize: 18,
//   },
//   action: {
//     flexDirection: "row",
//     marginTop: 10,

//     backgroundColor: "#F0F0F0",
//     paddingBottom: 5,
//     height: 60,
//     borderRadius: 45,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   textInput: {
//     flex: 1,
//     marginLeft: "10%",
//     color: "#05375a",
//   },
//   button: {
//     alignItems: "center",
//     marginTop: 50,
//     marginBottom: "auto",
//   },
//   signIn: {
//     width: 249,
//     height: 64,
//     justifyContent: "center",
//     alignItems: "center",
//     borderRadius: 56,
//     backgroundColor: "#77C375",
//   },
//   textSign: {
//     fontSize: 18,
//   },
//   textPrivate: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     marginTop: 20,
//   },
//   color_textPrivate: {
//     color: "grey",
//   },
//   errorMessage: {
//     height: 30,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   error: {
//     color: "#FF3B30",
//     fontSize: 13,
//     fontWeight: "600",
//     textAlign: "center",
//   },
// })
export default RegisterScreen;
