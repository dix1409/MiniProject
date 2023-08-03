import React, { useState, useEffect, useRef } from "react";
import 'expo-dev-client';
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { onAuthStateChanged } from "firebase/auth";
import HomeScreen from "./screen/HomeScreen";
import LoginScreen from "./screen/LoginScreen.js";
import RegisterScreen from "./screen/RegisterScreen";
import ForgatPassword from "./screen/ForgatPassword";
import { LogBox } from "react-native";
import OnboardingScreen from "./screen/Slider";
import Profile from "./screen/Profile";
import * as Linking from "expo-linking";
import { navigationRef } from "./Nav/RootNavigation";
import { auth, db } from "./Components/Event/Firestore";
const AppStack = createStackNavigator();
import * as RootNavigation from "./Nav/RootNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Load from "./screen/LoadScreen";

import Interset from "./screen/Interset";
import { doc, getDoc } from "@firebase/firestore";
LogBox.ignoreAllLogs();
const App = () => {
  const [First, setFirst] = useState<boolean>();
  const [user, setUser] = useState<boolean>();
  const url=Linking.useURL()
  const [show, setShow] = useState<boolean>(true);
  const handleDeeplink = (event) => {
    let data = Linking.parse(event.url);
    console.log(data)
    AsyncStorage.setItem("data",data?.queryParams?.id.toString());
    alert(data.queryParams.id)
    
  };

  useEffect(() => {
      if(url){
       
          let data = Linking.parse(url);
          console.log(data)
          if(data.queryParams.id){
            getDoc(doc(db,"data",data.queryParams.id)).then(doc=>{
              // alert(doc.data().id)
              if(user){

                RootNavigation.navigate("EventDetail",{
                  item:{...doc.data(),id:doc.id}
                })
              }
            })
          }
        
      }
  },[url])

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem("First_Time");
      console.log(value);
      if (value !== null) {
        // value previously stored
        console.log("yesssss");
        setFirst(false);
        // console.log(First)
      } else {
        setFirst(true);
        // console.log(First)
      }
    } catch (e) {
      // error reading value
      setFirst(true);
    }
  };




  useEffect(() => {
    // console.log(getData())
    const check = getData();
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("yupp");
        setUser(true);

        setShow(false);

        RootNavigation.navigate("Home");
      } else {
        if (!First) {
          console.log("npp");
          setUser(false);
          // console.log(auth.currentUser.email)
          setShow(false);
          RootNavigation.navigate("Login");
        } else {
          setUser(false);
          setShow(false);
          RootNavigation.navigate("OnBordingScreen");
        }
      }
    });
    return unsub;
  }, [First]);

  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {show && <AppStack.Screen name="Load" component={Load} />}
        {First && (
          <AppStack.Screen
            name="OnBordingScreen"
            component={OnboardingScreen}
          />
        )}
        {!user && (
          <>
            <AppStack.Screen name="Login" component={LoginScreen} />
            <AppStack.Screen name="Register" component={RegisterScreen} />
            <AppStack.Screen name="Profile" component={Profile} />
            <AppStack.Screen name="Interest" component={Interset} />
            <AppStack.Screen name="ForgatPassword" component={ForgatPassword} />
            {/* <AppStack.Screen name="Home" component={HomeScreen} /> */}
          </>
        )}
        {user && (
          <>
            <AppStack.Screen name="Home" component={HomeScreen} />

            {/* <AppStack.Screen name="Profile" component={Profile} />

            <AppStack.Screen name="Interest" component={Interset} /> */}
            {/* <AppStack.Screen name="ForgatPassword" component={ForgatPassword} />
            <AppStack.Screen name="Login" component={LoginScreen} />
            <AppStack.Screen name="Register" component={RegisterScreen} /> */}
          </>
        )}
      </AppStack.Navigator>
    </NavigationContainer>
  );
};

export default App;
