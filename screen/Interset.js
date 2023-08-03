import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState, useRef } from "react";
import {
  ImageBackground,
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import * as RootNavigation from "../Nav/RootNavigation";

import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../Components/Event/Firestore";
import { uid } from "uid";

const { height, width } = Dimensions.get("window");
export default function FirseEventCopy({ navigation, route }) {
  // const [loaded] = useFonts({
  //   comfortaa: require("../../Open_Sans/static/OpenSans/OpenSans-Bold.ttf"),
  // })
  // alert("pl")
  const [Loading, setLoading] = useState(false);
  const scroll = useRef(ScrollView);
  const [Interest, setInterest] = useState([]);
  const [error, seterror] = useState("");
  const slide = [
    { id: 1, title: "Badminton", subTitle: "🏸 " },
    { id: 2, title: "Baseball", subTitle: "⚾ " },
    { id: 3, title: "Basketball", subTitle: "🏀 " },

    { id: 5, title: "Climbing", subTitle: "🧗 " },
    { id: 6, title: "Cricket", subTitle: "🏏 " },
    { id: 7, title: "Cycling", subTitle: "🚴 " },
    { id: 8, title: "Darts", subTitle: "🎯 " },
    { id: 9, title: "Football", subTitle: "⚽️ " },
    { id: 11, title: "Gym and crossfit", subTitle: "🏋️ " },

    { id: 13, title: "Hiking", subTitle: "🌲 " },
    { id: 14, title: "Rugby", subTitle: "🏉 " },
    { id: 15, title: "Running", subTitle: "🏃 " },
    { id: 17, title: "Skateboarding", subTitle: "🛹 " },
    { id: 18, title: "Skiing", subTitle: "🎿 " },
    { id: 19, title: "Snowboarding", subTitle: "⛷️ " },

    { id: 20, title: "Spikeball", subTitle: "🟡 " },
    { id: 21, title: "Table Tennis", subTitle: "🏓 " },

    { id: 25, title: "Tennis", subTitle: "🎾 " },
    { id: 22, title: "Volleyball", subTitle: "🏐 " },
    { id: 23, title: "Yoga", subTitle: "🧘 " },
  ];
  console.log(route.params);
 
  React.useEffect(() => {
    if (Interest.length > 5) {
      seterror("Please select upto 5");
      console.log("yupp");
    } else {
      seterror("");
    }
  }, [Interest]);
  const Done = () => {
    if (Interest.length === 0) {
      seterror("Please Select at least one");
      scroll.current.scrollTo(0);
      return 0;
    } else if (Interest.length > 5) {
      seterror("Please select upto 5");
      scroll.current.scrollTo(0);
      return 0;
    } else {
      submitDetail();
      getdata();

      RootNavigation.navigate("Home");
    }
  };
  const submitDetail = () => {
    setLoading(true);
    const profileref = doc(db, "user", route.params.email, "profile", uid(15));
    
    setDoc(profileref, {
      ...route.params,
      Interest: Interest,
    })
      .then(() => {
        setDoc(doc(db,"feed",route.params.email),{
          image:route.params.image||"",
          title:`${route.params.first||""} ${route.params.last||""} join the Sportana community`,
         time:new Date(),
         id:route.params.email

        })
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);

        console.log(err.code);
      });
  };
  const getdata = async () => {
    try {
      await AsyncStorage.setItem("isDone", "true");
      console.log("here ...");
    } catch (e) {
      // saving error
      console.log(e);
    }
  };
  if (Loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator color="red" size="large" />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} ref={scroll}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: height * 0.05,

            flex: 1,
            position: "relative",
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ paddingLeft: 15 }}
          >
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
              paddingRight: 15,
            }}
          >
            Interest
          </Text>
        </View>
        <View
          style={{
            marginTop: 40,
            paddingHorizontal: 15,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              // maxWidth: "70%",
              marginHorizontal: 13,
              // marginBottom: 5,
              fontFamily: "bold",
            }}
          >
            What sports are you interested in?
            <Text
              style={{
                fontSize: RFValue(20, height),
                // maxWidth: "70%",
                marginHorizontal: 15,
                marginBottom: 5,
                // fontFamily: "comfortaa",
                color: "black",
              }}
            >
              {" "}
              Choose up to 5:
            </Text>
          </Text>
          <Text
            style={{
              fontFamily: "comfortaa",
              fontSize: 16,
              textAlign: "center",
              color: "red",
              width: "100%",
              marginBottom: 10,
            }}
          >
            {error}
          </Text>

          {/* <View style={{ flex: 1, flexDirection: "row" }}>
            <View style={{ maxWidth: "50%" }}>
              {slide.slice(0, slide.length / 2).map((item) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={{
                      width: 165,
                      height: 44,
                      backgroundColor:
                        Interest.filter((val) => val === item.title).length > 0
                          ? "#77C375"
                          : "#ffff",
                      // marginLeft: 5,
                      fontFamily: "comfortaa",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      borderRadius: 26,
                      borderColor: "#333",
                      borderWidth: 1,
                    }}
                    onPress={() => {
                      Interest.filter((val) => val === item.title).length === 0
                        ? setInterest([...Interest, item.title])
                        : (Interest.splice(Interest.indexOf(item.title), 1),
                          setInterest([...Interest]))
                      console.log(Interest)
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text>{item.subTitle}</Text>
                      <Text
                        style={{
                          fontFamily: "comfortaa",
                          fontSize: RFValue(12, height),
                          color:
                            Interest.filter((val) => val === item.title)
                              .length > 0
                              ? "#fff"
                              : "#000",
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>
            <View style={{ maxWidth: "50%" }}>
              {slide.slice(slide.length / 2, slide.length).map((item) => {
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={{
                      width: 165,
                      height: 44,
                      backgroundColor:
                        Interest.filter((val) => val === item.title).length > 0
                          ? "#77C375"
                          : "#ffff",
                      marginLeft: 5,
                      fontFamily: "comfortaa",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      borderRadius: 26,
                      borderColor: "#333",
                      borderWidth: 1,
                    }}
                    onPress={() => {
                      Interest.filter((val) => val === item.title).length === 0
                        ? setInterest([...Interest, item.title])
                        : (Interest.splice(Interest.indexOf(item.title), 1),
                          setInterest([...Interest]))
                    }}
                  >
                    <View style={{ flexDirection: "row" }}>
                      <Text>{item.subTitle}</Text>
                      <Text
                        style={{
                          fontFamily: "comfortaa",
                          color:
                            Interest.filter((val) => val === item.title)
                              .length > 0
                              ? "#fff"
                              : "#000",
                        }}
                      >
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )
              })}
            </View>

          </View> */}
          <FlatList
            data={slide}
            keyExtractor={(item) => item.title}
            numColumns={2}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id}
                style={{
                  width: "48%",
                  height: 44,
                  backgroundColor:
                    Interest.filter((val) => val === item.title).length > 0
                      ? "#77C375"
                      : "#ffff",
                  marginLeft: 5,
                  fontFamily: "comfortaa",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                  borderRadius: 26,
                  borderColor: "#333",
                  borderWidth: 1,
                }}
                onPress={() => {
                  Interest.filter((val) => val === item.title).length === 0
                    ? setInterest([...Interest, item.title])
                    : (Interest.splice(Interest.indexOf(item.title), 1),
                      setInterest([...Interest]));
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Text>{item.subTitle}</Text>
                  <Text
                    style={{
                      fontFamily: "comfortaa",
                      color:
                        Interest.filter((val) => val === item.title).length > 0
                          ? "#fff"
                          : "#000",
                    }}
                  >
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <View style={styles.button}>
            <TouchableOpacity style={styles.signIn} onPress={Done}>
              <Text
                style={[
                  styles.textSign,
                  {
                    color: "#fff",
                    fontFamily: "bold",
                  },
                ]}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  button: {
    alignItems: "center",
    margin: 30,
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
});
