import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  StyleSheet,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  StatusBar,
  Dimensions,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";

import { Dropdown } from "react-native-element-dropdown";
import * as Font from "expo-font";
import {
  AntDesign,
  EvilIcons,
  MaterialCommunityIcons,
  FontAwesome,
} from "@expo/vector-icons";
import { auth, db, store } from "../Components/Event/Firestore";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { uid } from "uid";

import { BottomSheet } from "react-native-btr";
import DateTimePicker from "react-native-modal-datetime-picker";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef,
} from "react-native-google-places-autocomplete";
const { height, width } = Dimensions.get("window");
const EditProfileScreen = ({ navigation, route }) => {
  const colorScheme = useColorScheme();
  const [status, requestPermission] = ImagePicker.useCameraPermissions();
  const [url, seturl] = useState("");
  const [image, setImage] = useState<any>("");
  const [first, setfirst] = useState("");
  const [last, setlast] = useState("");
  const [Date, setDate] = useState("");
  var placeRef = useRef<GooglePlacesAutocompleteRef>();
  var scrollRef = useRef<ScrollView>();

  const [city, setcity] = useState("");
  const { colors } = useTheme();
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [load, setload] = useState(false);
  const [Focus, setFocus] = useState(false);
  const [heights, setheight] = useState(30);
  const [gender, setgender] = useState("");
  const [address, setaddress] = useState(false);
  const [show, setshow] = useState(false);

  const toggleBottomNavigationView = () => {
    //Toggling the visibility state of the bottom sheet
    setVisible(!visible);
  };
  const email = route.params.email;
  const [loded] = Font.useFonts({
    comfortaa: require("../comfortaa-main/comfortaa-main/fonts/OTF/Comfortaa-Regular.otf"),
    bold: require("../comfortaa-main/comfortaa-main/fonts/OTF/Comfortaa-Bold.otf"),
  });

  console.log(placeRef.current?.isFocused());
  // alert("ok")
  const takePhotoFromCamera = async () => {
    requestPermission();
    if (status.granted) {
      console.log("hello");
      let photo: any = await ImagePicker.launchCameraAsync({
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      if (!photo.cancelled) {
        setImage(photo.uri);
      }
    }
  };
  const uploadimage = async (uri: RequestInfo) => {
    setload(true);
    const response = await fetch(uri);
    const blob = await response.blob();

    const refs = ref(store, email);

    uploadBytes(refs, blob).then((snapshot) => {
      console.log("Uploaded a blob or file!");
      getDownloadurl();
    });
  };
  const getDownloadurl = () => {
    const starsRef = ref(store, email);

    // Get the download URL
    getDownloadURL(starsRef)
      .then((url) => {
        // Insert url into an <img> tag to "download"
        // seturl(url)
        console.log(url);
        setload(false);
        const userData={
          first: first,
          last: last,
          date: Date,
          city: city,
          gender: gender,
        };
        Object.keys(userData).forEach(key => {
          if(userData[key] === '' || userData[key] === null){
            delete userData[key];
          }
        })
        navigation.navigate("Interest", {
          first: first,
          last: last,
          date: Date,
          city: city,
          gender: gender,

          email: email,
          image: url,
        });
        
      })
      .catch((error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/object-not-found":
            // File doesn't exist
            break;
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect the server response
            break;
        }
      });
  };
  const onHandle = (text) => {
    if (Date.length === 2 || Date.length === 5) {
      setDate(`${Date}/${text.charAt(text.length - 1)}`);
    } else {
      setDate(text);
    }
  };
  const choosePhotoFromLibrary = async () => {
    // No permissions request is necessary for launching the image library
    let result: any = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result.base64)

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const Check = () => {
    if (
      first === "" ||
      last === "" 
    
    ) {
      scrollRef.current.scrollTo(0);
      setaddress(true);

      setError("Fill All Details");

      return 0;
    } else {
      if (image.length === 0) {
        try{
        const userData={
          first: first,
          last: last,
          date: Date,
          city: city,
          gender: gender,
        };
        Object.keys(userData).forEach(key => {
          if(userData[key] === '' || userData[key] === null){
            delete userData[key];
          }
        })
        navigation.navigate("Interest", {
          first: first,
          last: last,
          date: Date,
          city: city,
          gender: gender,

          email: email,
          image:
            "https://res.cloudinary.com/dz7xfhqxk/image/upload/v1656943883/Image/WhatsApp_Image_2022-07-02_at_16.20.59-removebg-preview_oomv2c.png",
        });
      }
      catch (err){
        alert(err.message);
      }
      } else {
        uploadimage(image);
      }
    }
  };
  const onChange = (selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      const date = JSON.stringify(currentDate);
      setDate(date.slice(1, 11));
      console.log(date.slice(1, 11));

      setshow(false);
    }
  };
  const shown = () => {
    setshow(!show);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {!load && (
        <TouchableWithoutFeedback
          onPress={Keyboard.dismiss}
          style={styles.container}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            ref={scrollRef}
          >
            <KeyboardAvoidingView>
              <View style={{ paddingHorizontal: height * 0.05 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 15,

                    flex: 1,
                    position: "relative",
                  }}
                >
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <AntDesign name="left" size={24} color="black" />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontSize: 26,
                      fontFamily: "comfortaa",
                      textAlign: "center",
                      alignSelf: "center",
                      // position: "absolute",
                      marginLeft: "auto",
                      marginRight: "auto",
                      paddingRight: 0.06 * width,
                    }}
                  >
                    Profile
                  </Text>
                </View>
                <View style={{ alignItems: "center", marginBottom: 20 }}>
                  <TouchableOpacity
                    onPress={toggleBottomNavigationView}
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <View
                      style={{
                        height: 88,
                        width: 88,
                        borderRadius: 44,
                        justifyContent: "center",
                        alignItems: "center",
                        borderColor: "#7BCB78",
                        borderWidth: 2,
                      }}
                    >
                      <ImageBackground
                        source={{
                          uri: image ? image : "",
                        }}
                        style={{ height: "100%", width: "100%" }}
                        imageStyle={{ borderRadius: 44 }}
                      >
                        <View
                          style={{
                            flex: 1,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          {!image && (
                            <MaterialCommunityIcons
                              name="camera"
                              size={35}
                              color="#BABABA"
                              style={{
                                // opacity: 0.7,
                                alignItems: "center",
                                justifyContent: "center",
                                borderWidth: 1,
                                borderColor: "#fff",
                                borderRadius: 10,
                              }}
                            />
                          )}
                        </View>
                      </ImageBackground>
                    </View>
                  </TouchableOpacity>
                </View>
                {/* <View style={{ marginVertical: 10 }}>
                  <TouchableOpacity
                    onPress={toggleBottomNavigationView}
                    style={{ flexDirection: "row", justifyContent: "center" }}
                  >
                    <AntDesign name="edit" size={20} color="#8fa8c8" />
                    <Text
                      style={{
                        textAlign: "center",
                        marginStart: 10,
                        color: "#5398F3",
                      }}
                    >
                      Edit Photo
                    </Text>
                  </TouchableOpacity>
                </View> */}
                {error.length > 0 && (
                  <View
                    style={{
                      width: "100%",
                      alignItems: "center",
                      height: 20,
                    }}
                  >
                    <Text style={{ color: "red", fontSize: 15 }}>{error}</Text>
                  </View>
                )}
                <BottomSheet
                  visible={visible}
                  //setting the visibility state of the bottom shee
                  onBackButtonPress={toggleBottomNavigationView}
                  //Toggling the visibility state on the click of the back botton
                  onBackdropPress={toggleBottomNavigationView}
                  //Toggling the visibility state on the clicking out side of the sheet
                >
                  {/*Bottom Sheet inner View*/}
                  <View
                    style={{
                      backgroundColor: "rgba(252, 252, 252, 1)",
                      width: "100%",
                      // height: 350,
                      borderTopStartRadius: 70,
                      borderTopEndRadius: 70,
                    }}
                  >
                    <View style={styles.panel}>
                      {/* <View style={{ alignItems: "center" }}>
                      <Text style={styles.panelTitle}>Upload Photo</Text>
                      <Text style={styles.panelSubtitle}>
                        Choose Your Profile Picture
                      </Text>
                    </View> */}

                      <TouchableOpacity onPress={takePhotoFromCamera}>
                        <LinearGradient
                          colors={[
                            "rgba(240, 240, 240, 1)",
                            "rgba(240, 240, 240, 1)",
                          ]}
                          style={styles.panelButton}
                        >
                          <Text style={styles.panelButtonTitle}>
                            Take Photo
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={choosePhotoFromLibrary}>
                        <LinearGradient
                          colors={[
                            "rgba(240, 240, 240, 1)",
                            "rgba(240, 240, 240, 1)",
                          ]}
                          style={styles.panelButton}
                        >
                          <Text style={styles.panelButtonTitle}>
                            Choose From Library
                          </Text>
                        </LinearGradient>
                      </TouchableOpacity>
                      {image.length > 0 && (
                        <TouchableOpacity
                          onPress={() => {
                            setImage("");
                            toggleBottomNavigationView();
                          }}
                        >
                          <LinearGradient
                            colors={[
                              "rgba(240, 240, 240, 1)",
                              "rgba(240, 240, 240, 1)",
                            ]}
                            style={styles.panelButton}
                          >
                            <Text style={styles.panelButtonTitle}>
                              Remove Photo
                            </Text>
                          </LinearGradient>
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => {
                          toggleBottomNavigationView();
                          // setImage(null)
                        }}
                      >
                        <LinearGradient
                          colors={[
                            "rgba(240, 240, 240, 1)",
                            "rgba(240, 240, 240, 1)",
                          ]}
                          style={styles.panelButton}
                        >
                          <Text style={styles.panelButtonTitle}>Cancel</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  </View>
                </BottomSheet>

                <Text style={styles.family}>First Name</Text>

                <View style={styles.action}>
                  <TextInput
                    placeholder="First Name"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    style={[
                      styles.textInput,
                      {
                        color: colors.text,
                      },
                    ]}
                    onChangeText={(text) => setfirst(text)}
                  />
                </View>

                <Text style={styles.family}>Last Name</Text>

                <View style={styles.action}>
                  <TextInput
                    placeholder="Last Name"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    style={[
                      styles.textInput,
                      {
                        color: colors.text,
                      },
                    ]}
                    onChangeText={(text) => setlast(text)}
                  />
                </View>
                <View style={{flexDirection:"row",alignItems: "center"}}>
                <Text style={styles.family}>
                  City {address && <Text style={{ color: "red" }}>*</Text>}
                </Text>
                <Text style={{fontSize: 13,color:"grey"}}>(optional)</Text>
                </View>

                <View style={styles.action}>
                  {/* <TextInput
                    placeholder="City"
                    placeholderTextColor="#666666"
                    autoCorrect={false}
                    style={[
                      styles.textInput,
                      {
                        color: colors.text,
                      },
                    ]}
                    onChangeText={(text) => setcity(text)}
                  /> */}
                  <GooglePlacesAutocomplete
                    placeholder="City "
                    ref={placeRef}
                    onPress={(data, details = null) => {
                      // 'details' is provided when fetchDetails = true
                      console.log(details);
                      setaddress(false);
                      setheight(200);
                      setcity(details.formatted_address);
                      // setlatitude(details.geometry.location.lat)
                      // setlongitude(details.geometry.location.lng)
                      // setyes(false)
                    }}
                    enablePoweredByContainer={false}
                    fetchDetails={true}
                    keyboardShouldPersistTaps="always"
                    nearbyPlacesAPI="GooglePlacesSearch"
                    query={{
                      key: "AIzaSyCcN6s8ippd7mIFFE6tMcY8nFMffg83BuA",
                      language: "en",
                      // location: "48.1523699, ",
                    }}
                    debounce={200}
                    minLength={2}
                    styles={{
                      container: {
                        width: "100%",
                        borderRadius: 20,
                        marginTop: 10,
                        // height:400,

                        // placeholderTextColor: "#05375a",
                      },

                      textInputContainer: {
                        marginRight: -10,
                        marginLeft: -10,
                      },
                      textInput: {
                        fontFamily: "comfortaa",
                        borderBottomWidth: 1,
                        borderColor: "#BABABA",
                        borderRadius: 15,
                        width: "100%",
                        color: "#000",
                        paddingBottom: Platform.OS === "ios" ? -4 : 0,
                        height: 30,
                      },
                    }}
                  />
                </View>
                <View style={{flexDirection:"row",alignItems: "center"}}>

                <Text style={styles.family}>Date of Birth</Text>
                <Text style={{fontSize: 13,color:"grey"}}> (optional)</Text>
                </View>

                {show && (
                  <DateTimePicker
                    mode="date"
                    isVisible={true}
                    onConfirm={onChange}
                    onCancel={() => setshow(!show)}
                    isDarkModeEnabled={colorScheme === "dark"}
                  />
                )}

                <TouchableOpacity onPress={shown}>
                  <View style={styles.input}>
                    <Text style={styles.text}>
                      {Date ? `${Date}` : "Select a Date"}
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={{flexDirection:"row",alignItems: "center"}}>

                <Text style={[styles.family, { marginTop: 20 }]}>Gender </Text>
                <Text style={{fontSize: 13,color:"grey",marginTop:20}}>(optional)</Text>
                </View>

                <View style={[styles.action, { marginTop: 20 }]}>
                  <TouchableOpacity onPress={() => setgender("Female")}>
                    <View
                      style={{
                        height: 36,
                        width: 83,
                        backgroundColor:
                          gender === "Female"
                            ? "rgba(123, 203, 120, 0.6)"
                            : "white",
                        borderColor:
                          gender === "Female"
                            ? "rgba(123, 203, 120, 1)"
                            : "rgba(186, 186, 186, 1)",
                        borderWidth: 2,
                        borderRadius: 26,
                        justifyContent: "center",
                        alignItems: "center",
                        marginRight: "5%",
                      }}
                    >
                      <Text style={[styles.family, { fontSize: 15 }]}>
                        Female
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setgender("Male")}>
                    <View
                      style={{
                        height: 36,
                        width: 83,
                        backgroundColor:
                          gender === "Male"
                            ? "rgba(123, 203, 120, 0.6)"
                            : "white",
                        borderColor:
                          gender === "Male"
                            ? "rgba(123, 203, 120, 1)"
                            : "rgba(186, 186, 186, 1)",
                        borderWidth: 2,
                        borderRadius: 26,
                        justifyContent: "center",
                        marginRight: "5%",
                        alignItems: "center",
                      }}
                    >
                      <Text style={[styles.family, { fontSize: 15 }]}>
                        Male
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setgender("Diverse")}>
                    <View
                      style={{
                        height: 36,
                        width: 83,
                        backgroundColor:
                          gender === "Diverse"
                            ? "rgba(123, 203, 120, 0.6)"
                            : "white",
                        borderColor:
                          gender === "Diverse"
                            ? "rgba(123, 203, 120, 1)"
                            : "rgba(186, 186, 186, 1)",
                        borderWidth: 2,
                        borderRadius: 26,
                        justifyContent: "center",
                        alignItems: "center",

                      }}
                    >
                      <Text style={[styles.family, { fontSize: 15 }]}>
                        Diverse
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>

                <View
                  style={{ alignItems: "center", justifyContent: "center" }}
                >
                  <TouchableOpacity
                    style={[
                      styles.commandButton,
                      {
                        backgroundColor: "rgba(123, 203, 120, 1)",
                        width: 206,
                        height: 54,
                        borderRadius: 56,
                        marginBottom: "5%",
                      },
                    ]}
                    onPress={Check}
                  >
                    <Text style={styles.panelButtonTitle}>Next</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
        </TouchableWithoutFeedback>
      )}
      {load && (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator color="red" size="large" />
          <Text style={{ textAlign: "center" }}>
            Please wait! we setup your profile
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};
export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    // padding: 10,

    // paddingVertical: 10,
    width: width,
    height: height,

    // justifyContent: "center",
  },
  commandButton: {
    // padding: 15,
    borderRadius: 10,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginHorizontal: "auto",
  },
  panel: {
    padding: 20,

    paddingVertical: 40,

    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
    marginBottom: "auto",
  },
  header: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#333333",
    shadowOffset: { width: -1, height: -3 },
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  view: {
    marginTop: 20,
    // alignItems: "center",
  },
  text: {
    marginTop: 15,
    color: "rgba(59, 59, 59, 1)",
  },
  input: {
    borderBottomColor: "#8a8f9e",
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 47,
    // width: width * 0.86,
    fontSize: 15,

    color: "rgba(59, 59, 59, 1)",

    fontFamily: "comfortaa",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#00000040",
    marginBottom: 10,
  },
  family: {
    fontFamily: "comfortaa",
    fontSize: 16,
  },
  panelTitle: {
    fontSize: 27,
    height: 35,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: Platform.OS === "ios" ? 35 : 45,
    justifyContent: "center",
    height: 60,
    backgroundColor: "rgba(123, 203, 120, 1)",
    alignItems: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,

    color: "black",
    fontFamily: "bold",
  },
  action: {
    flexDirection: "row",
    // marginTop: 10,
    marginBottom: 20,

    paddingBottom: 5,
    // marginHorizontal: 20,
    //alignItems: "center",
    //justifyContent: "center",
    //height: 40,
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
    marginTop: 20,
    // marginTop: Platform.OS === "ios" ? 0 : -5,
    // paddingLeft: 10,
    color: "#05375a",
    borderBottomColor: "#8a8f9e",
    borderBottomWidth: StyleSheet.hairlineWidth,
    fontFamily: "comfortaa",
  },
  //
});
