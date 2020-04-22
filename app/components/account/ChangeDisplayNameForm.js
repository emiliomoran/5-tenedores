import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

export default function ChangeDisplayNameForm(props) {
  const { displayName, setIsVisibleModal, setReloadData, toastRef } = props;
  const [newDisplayName, setNewDisplayName] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const updateDisplayName = () => {
    setError(null);
    if (!newDisplayName) {
      setError("Name is obligatory!");
    } else {
      setLoading(true);
      const update = {
        displayName: newDisplayName,
      };

      firebase
        .auth()
        .currentUser.updateProfile(update)
        .then((res) => {
          setLoading(false);
          setReloadData(true);
          toastRef.current.show("Name updated successfully");
          setIsVisibleModal(false);
        })
        .catch((error) => {
          console.log(error);
          setError("Error updating the name");
          setLoading(false);
        });
    }
  };

  return (
    <View style={styles.view}>
      <Input
        placeholder="Name"
        containerStyle={styles.input}
        defaultValue={displayName && displayName}
        onChange={(e) => setNewDisplayName(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "account-circle-outline",
          color: "#c2c2c2",
        }}
        errorMessage={error}
      />
      <Button
        title="Change name"
        containerStyle={styles.btnContainer}
        buttonStyle={styles.btn}
        onPress={updateDisplayName}
        loading={loading}
      />
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
  },
  btnContainer: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "tomato",
  },
});
