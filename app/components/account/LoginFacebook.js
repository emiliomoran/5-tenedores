import React, { useState } from "react";
import { SocialIcon } from "react-native-elements";
import * as Facebook from "expo-facebook";
import * as firebase from "firebase";
import { FacebookApi } from "../../utils/Social";
import Loading from "../../components/Loading";

export default function LoginFacebook(props) {
  const { toastRef, navigation } = props;
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      await Facebook.initializeAsync(FacebookApi.application_id);
      const { type, token } = await Facebook.logInWithReadPermissionsAsync({
        permissions: FacebookApi.permissions,
      });

      if (type === "success") {
        const credentials = firebase.auth.FacebookAuthProvider.credential(
          token
        );
        await firebase
          .auth()
          .signInWithCredential(credentials)
          .then(() => {
            //console.log(res);
            //console.log("Login with Facebook correct");
            navigation.navigate("My Account");
          })
          .catch((error) => {
            console.log(error);
            toastRef.current.show("Error to login with Facebook, try later!");
          });
      } else if (type === "cancel") {
        toastRef.current.show("Login with Facebook cancelled!");
      } else {
        toastRef.current.show("Error to login with Facebook, try later!");
      }
    } catch ({ message }) {
      toastRef.current.show("Error to login with Facebook, try later!");
    }
    setLoading(false);
  };

  return (
    <>
      <SocialIcon
        title="Login with Facebook"
        button
        type="facebook"
        onPress={login}
      />
      <Loading isVisible={loading} text="Login with Facebook..." />
    </>
  );
}
