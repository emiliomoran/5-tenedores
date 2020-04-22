import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, FlatList } from "react-native";
import { Button, Avatar, Rating } from "react-native-elements";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function ListReviews(props) {
  const { navigation, idRestaurant, setRating } = props;
  const [reviews, setReviews] = useState([]);
  const [reviewsReload, setReviewsReload] = useState(false);
  const [userLogged, setUserLogged] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogged(true) : setUserLogged(false);
  });

  console.log(reviews);

  useEffect(() => {
    (async () => {
      const resultReviews = [];
      const arrayRating = [];

      db.collection("review")
        .where("idRestaurant", "==", idRestaurant)
        .get()
        .then((response) => {
          response.forEach((doc) => {
            resultReviews.push(doc.data());
            arrayRating.push(doc.data().rating);
          });

          let numSum = 0;
          arrayRating.map((value) => {
            numSum = numSum + value;
          });

          const countRating = arrayRating.length;
          const resultRating = numSum / countRating;
          const resultRatingFinish = resultRating ? resultRating : 0;

          setReviews(resultReviews);
          setRating(resultRatingFinish);
        });
      setReviewsReload(false);
    })();
  }, [reviewsReload]);

  return (
    <View>
      {userLogged ? (
        <Button
          buttonStyle={styles.btnAddReview}
          titleStyle={styles.btnTitleAddReview}
          title="Review"
          icon={{
            type: "material-community",
            name: "square-edit-outline",
            color: "tomato",
          }}
          onPress={() =>
            navigation.navigate("New review", {
              idRestaurant: idRestaurant,
              setReviewsReload: setReviewsReload,
            })
          }
        />
      ) : (
        <View style={{ flex: 1 }}>
          <Text
            style={{ textAlign: "center", color: "tomato", padding: 20 }}
            onPress={() => navigation.navigate("Login")}
          >
            To make a review, you need are logged.{" "}
            <Text style={{ fontWeight: "bold" }}>Touch here to go login</Text>
          </Text>
        </View>
      )}
      <FlatList
        data={reviews}
        renderItem={(review) => <Review review={review} />}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

function Review(props) {
  const { title, comment, rating, createAt, avatarUser } = props.review.item;
  const createAtReview = new Date(createAt.seconds * 1000);
  //console.log(createAtReview);
  return (
    <View style={styles.viewReview}>
      <View style={styles.viewImageAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.imageAvatarUser}
          source={{
            uri: avatarUser
              ? avatarUser
              : "https://api.adorable.io/avatars/285/abott@adorable.io.png",
          }}
        />
      </View>
      <View style={styles.viewInfo}>
        <Text styles={styles.reviewTitle}>{title}</Text>
        <Text style={styles.reviewText}>{comment}</Text>
        <Rating imageSize={15} startingValue={rating} readonly />
        <Text style={styles.reviewDate}>
          {createAtReview.getDate()}/{createAtReview.getMonth() + 1}/
          {createAtReview.getFullYear()} - {createAtReview.getHours()}:
          {createAtReview.getMinutes() < 10 ? "0" : ""}
          {createAtReview.getMinutes()}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  btnAddReview: {
    backgroundColor: "transparent",
  },
  btnTitleAddReview: {
    color: "tomato",
  },
  viewReview: {
    flexDirection: "row",
    margin: 10,
    paddingBottom: 20,
    borderBottomColor: "#e3e3e3",
    borderBottomWidth: 1,
  },
  viewImageAvatar: {
    marginRight: 15,
  },
  imageAvatarUser: {
    width: 50,
    height: 50,
  },
  viewInfo: {
    flex: 1,
    alignItems: "flex-start",
  },
  reviewTitle: {
    fontWeight: "bold",
  },
  reviewText: {
    paddingTop: 2,
    color: "grey",
    marginBottom: 5,
  },
  reviewDate: {
    marginTop: 5,
    color: "grey",
    fontSize: 12,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
