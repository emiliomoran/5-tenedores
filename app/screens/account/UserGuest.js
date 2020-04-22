import React from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Button } from "react-native-elements";
import { withNavigation } from "@react-navigation/compat";

function UserGuest(props) {
  const { navigation } = props;
  return (
    <ScrollView style={styles.viewBody} centerContent={true}>
      <Image
        source={require("../../../assets/img/user-guest.jpg")}
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Check your profile of 5 Tenedores</Text>
      <Text style={styles.description}>
        How describe your best restaurants? Search and view the best restaurants
        a simple shape, voting which do you like more and comment how have been
        your experience.
      </Text>
      <View style={styles.viewBtn}>
        <Button
          buttonStyle={styles.btnStyle}
          containerStyle={styles.btnContainerStyle}
          title="Profile"
          onPress={() => navigation.navigate("Login")}
        />
      </View>
    </ScrollView>
  );
}

export default withNavigation(UserGuest);

const styles = StyleSheet.create({
  viewBody: {
    marginLeft: 0,
    marginRight: 0,
  },
  image: {
    height: 300,
    width: "100%",
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    fontSize: 19,
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    textAlign: "center",
    marginBottom: 20,
  },
  viewBtn: {
    flex: 1,
    alignItems: "center",
    //marginBottom: 20,
  },
  btnStyle: {
    backgroundColor: "tomato",
  },
  btnContainerStyle: {
    width: "70%",
  },
});
