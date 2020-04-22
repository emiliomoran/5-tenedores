import React, { useState, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { AirbnbRating, Button, Input } from "react-native-elements";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function AddReviewRestaurant(props) {
  //console.log("ADDREVIEW", props);
  const { navigation, route } = props;
  const { idRestaurant } = route.params;
  const { setReviewsReload } = route.params;
  const [rating, setRating] = useState(null);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const toastRef = useRef();

  const addReview = () => {
    if (rating === null) {
      toastRef.current.show("Rating is obligatory");
    } else if (!title) {
      toastRef.current.show("Title is obligatory");
    } else if (!comment) {
      toastRef.current.show("Comment is obligatory");
    } else {
      setLoading(true);
      const user = firebase.auth().currentUser;
      const payload = {
        idUser: user.uid,
        avatarUser: user.photoURL,
        idRestaurant: idRestaurant,
        title: title,
        comment: comment,
        rating: rating,
        createAt: new Date(),
      };

      db.collection("review")
        .add(payload)
        .then(() => {
          updateRestaurant();
        })
        .catch(() => {
          toastRef.current.show("Error sending review, try later");
          setLoading(false);
        });
    }
  };

  const updateRestaurant = () => {
    const restaurantRef = db.collection("restaurants").doc(idRestaurant);
    restaurantRef.get().then((response) => {
      const restaurantData = response.data();
      const ratingTotal = restaurantData.ratingTotal + rating;
      const quantityVoting = restaurantData.quantityVoting + 1;
      const ratingResult = ratingTotal / quantityVoting;

      restaurantRef
        .update({
          rating: ratingResult,
          ratingTotal,
          quantityVoting,
        })
        .then(() => {
          setLoading(false);
          setReviewsReload(true);
          navigation.goBack();
        })
        .catch(() => {
          toastRef.current.show("Error sending review, try later");
          setLoading(false);
        });
    });
  };

  return (
    <View style={styles.viewBody}>
      <View style={styles.viewRating}>
        <AirbnbRating
          count={5}
          reviews={["Much low", "low", "Normal", "Much Good", "Excellent"]}
          defaultRating={0}
          size={35}
          onFinishRating={(value) => setRating(value)}
        />
      </View>
      <View style={styles.formReview}>
        <Input
          placeholder="Title"
          containerStyle={styles.input}
          onChange={(e) => setTitle(e.nativeEvent.text)}
        />
        <Input
          placeholder="Comment"
          multiline={true}
          inputContainerStyle={styles.textArea}
          onChange={(e) => setComment(e.nativeEvent.text)}
        />
        <Button
          title="Send"
          onPress={addReview}
          containerStyle={styles.btnContainer}
          buttonStyle={styles.btn}
        />
        <Toast ref={toastRef} position="center" opacity={0.5} />
        <Loading isVisible={loading} text="Sending review..." />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
  viewRating: {
    height: 110,
    backgroundColor: "#f2f2f2",
  },
  formReview: {
    margin: 10,
    marginTop: 40,
    flex: 1,
    alignItems: "center",
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 150,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginTop: 20,
    marginBottom: 10,
    width: "95%",
  },
  btn: {
    backgroundColor: "tomato",
  },
});
