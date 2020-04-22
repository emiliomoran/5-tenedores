import React, { useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";
import { reauthenticate } from "../../utils/Api";

export default function ChangePasswordForm(props) {
  const { setIsVisibleModal, toastRef } = props;
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newConfirmPassword, setNewConfirmPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [hideNewPassword, setHideNewPassword] = useState(true);
  const [hideNewConfirmPassword, setHideNewConfirmPassword] = useState(true);

  const updatePassword = () => {
    setError({});

    if (!password || !newPassword || !newConfirmPassword) {
      let objError = {};
      !password && (objError.password = "Isn't empty");
      !newPassword && (objError.newPassword = "Isn't empty");
      !newConfirmPassword && (objError.newConfirmPassword = "Isn't empty");
      setError(objError);
    } else {
      if (newPassword !== newConfirmPassword) {
        setError({
          newPassword: "New passwords aren't same",
          newConfirmPassword: "New passwords aren't same",
        });
      } else {
        setLoading(true);
        reauthenticate(password)
          .then(() => {
            firebase
              .auth()
              .currentUser.updatePassword(newPassword)
              .then(() => {
                setLoading(false);
                toastRef.current.show("Password updated successfully");
                setIsVisibleModal(false);
                //firebase.auth().signOut();
              })
              .catch(() => {
                setError({
                  general: "Error updating password",
                });
                setLoading(false);
              });
          })
          .catch(() => {
            setError({
              password: "Invalid password",
            });
            setLoading(false);
          });
      }
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Current password"
        containerStyle={styles.input}
        secureTextEntry={hidePassword}
        onChange={(e) => setPassword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hidePassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHidePassword(!hidePassword),
        }}
        errorMessage={error.password}
      />
      <Input
        placeholder="New password"
        containerStyle={styles.input}
        secureTextEntry={hideNewPassword}
        onChange={(e) => setNewPassword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewPassword(!hideNewPassword),
        }}
        errorMessage={error.newPassword}
      />
      <Input
        placeholder="Confirm new password"
        containerStyle={styles.input}
        secureTextEntry={hideNewConfirmPassword}
        onChange={(e) => setNewConfirmPassword(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: hideNewConfirmPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setHideNewConfirmPassword(!hideNewConfirmPassword),
        }}
        errorMessage={error.newConfirmPassword}
      />
      <Button
        title="Change password"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={updatePassword}
        loading={loading}
      />
      <Text>{error.general}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
    marginTop: 10,
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "tomato",
  },
});
