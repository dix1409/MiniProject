import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TextInput, Button, Alert } from "react-native";
import { CardField, GooglePay, GooglePayButton, initGooglePay, initStripe, useConfirmPayment } from "@stripe/stripe-react-native";
import * as Constants from "expo-constants"
import * as Linking from "expo-linking"
import { isGooglePaySupported,useGooglePay } from '@stripe/stripe-react-native';
import { auth } from "../Components/Event/Firestore";

//ADD localhost address of your server
const API_URL = "http://192.168.1.5:3000";

const StripeApp = ({navigation,route}) => {
 
const  {createGooglePayPaymentMethod}=useGooglePay()
  React.useEffect(() => {
    const check=async()=>{
    if (!(await isGooglePaySupported({ googlePay: {testEnv: true} }))) {
      Alert.alert('Google Pay is not supported.');
      return;
    }
    
    const { error } = initGooglePay({

      testEnv: false,
      merchantName: 'Sportana',
      countryCode: 'CH',
      billingAddressConfig: {
          format: 'FULL',
          isPhoneNumberRequired: true,
          isRequired: false,
      },
      existingPaymentMethodRequired: false,
      isEmailRequired: true,
  });

  if (error) {
      // DO SOMETHING HERE
      console.log(error);
      return;
  }else{
    console.log(error);
  }

  }
  check()
  }, []);
  useEffect(()=>{
    navigation.setOptions({
      headerShown:"true",
      headerTitleAlign:'left',
      headerTitle:"Total: "+route.params.fee
    })
  },[navigation])

  const [email, setEmail] = useState();
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();

  const pay = async () => {
    // const clientSecret = await fetchPaymentIntentClientSecret();

    const { error, paymentMethod } = await createGooglePayPaymentMethod({
      amount: 1099,
      currencyCode: "INR",
  });

  if (error) {
    console.log(error);
      
      return;
  } else if (paymentMethod) {
     // do something here

     Alert.alert('Success', 'The payment was confirmed successfully.');
  }
  };
  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  };
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  const handlePayPress = async () => {
    //1.Gather the customer's billing information (e.g., email)
    if (!cardDetails?.complete) {
      Alert.alert("Please enter Complete card details and Email");
      return;
    }
    const billingDetails = {
      email: auth.currentUser.email,

    };

    //2.Fetch the intent client secret from the backend
    try {
      
      const { clientSecret, error } = await fetchPaymentIntentClientSecret()
      console.log(clientSecret);
      
      //2. confirm the payment
      if (error) {
        console.log("Unable to process payment");
      } else {
        await initStripe({
          publishableKey: "pk_test_51MbjoqIkJAZBYY4dLv1kPnAbj8FeU8W3emTbOgHJDQO5vX1lDH4ctIPr47g8VL6AxmrjCeby6kbBy5kIK3ipZfIb0061f3vKpR",
          urlScheme:
Constants.appOwnership === 'expo'
  ? Linking.createURL('/--/')
  : Linking.createURL(''),
  merchantIdentifier:"merchant.com.Sportana" 
      })
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          paymentMethodType: "Card",
          billingDetails: billingDetails,
        });
        if (error) {
          alert(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          alert("Payment Successful");
          console.log("Payment successful ", paymentIntent);
        }
      }
    } catch (e) {
      console.log(e);
    }
    //3.Confirm the payment with the card details
  };


  return (
    <View style={styles.container}>
      
      <CardField
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={styles.card}
        style={styles.cardContainer}
        onCardChange={cardDetails => {
          setCardDetails(cardDetails);
        }}
      />
      <Button onPress={handlePayPress} title="Pay" disabled={loading} />
      
      <GooglePayButton
       
        onPress={pay}
        style={{
          width: '100%',
          height: 50,
        }}
      />
    </View>
  );
};
export default StripeApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    margin: 20,
  },
  input: {
    backgroundColor: "#efefefef",

    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  card: {
    backgroundColor: "#efefefef",
  },
  cardContainer: {
    height: 50,
    marginVertical: 30,
  },
});