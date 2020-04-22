import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Icon, Button } from "react-native-elements";
import { validateEmail } from "../../utils/Validation";
import * as firebase from "firebase";
import Loading from "../../components/Loading";
import { withNavigation } from "@react-navigation/compat";

function RegisterForm(props) {
  const { toastRef, navigation } = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async () => {
    setLoading(true);
    if (!email || !password || !confirmPassword) {
      toastRef.current.show("All fields are obligatory!");
    } else {
      if (!validateEmail(email)) {
        toastRef.current.show("Email isn't valid!");
      } else {
        if (password !== confirmPassword) {
          toastRef.current.show("The passwords aren't same!");
        } else {
          await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then((res) => {
              //console.log(res);
              //toastRef.current.show("User joined!");
              navigation.navigate("My Account");
            })
            .catch((error) => {
              //console.log(error);
              toastRef.current.show("Oop, try again!");
            });
        }
      }
    }
    setLoading(false);
  };

  return (
    <View style={styles.formContainer}>
      <Input
        placeholder="Email"
        containerStyle={styles.inputForm}
        onChange={(e) => setEmail(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name="at"
            iconStyle={styles.IconRight}
          />
        }
      />
      <Input
        placeholder="Password"
        //password={true}
        secureTextEntry={hidePassword}
        containerStyle={styles.inputForm}
        onChange={(e) => setPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hidePassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.IconRight}
            onPress={() => setHidePassword(!hidePassword)}
          />
        }
      />
      <Input
        placeholder="Confirm password"
        //password={true}
        secureTextEntry={hideConfirmPassword}
        containerStyle={styles.inputForm}
        onChange={(e) => setConfirmPassword(e.nativeEvent.text)}
        rightIcon={
          <Icon
            type="material-community"
            name={hideConfirmPassword ? "eye-outline" : "eye-off-outline"}
            iconStyle={styles.IconRight}
            onPress={() => setHideConfirmPassword(!hideConfirmPassword)}
          />
        }
      />
      <Button
        title="Join"
        containerStyle={styles.btnContainerRegister}
        buttonStyle={styles.btnRegister}
        onPress={register}
      />
      <Loading text="Creating account ..." isVisible={loading} />
    </View>
  );
}

export default withNavigation(RegisterForm);

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  inputForm: {
    width: "100%",
    marginTop: 20,
  },
  IconRight: {
    color: "rgba(0, 0, 0, .5)",
  },
  btnContainerRegister: {
    marginTop: 20,
    width: "95%",
  },
  btnRegister: {
    backgroundColor: "tomato",
  },
});
