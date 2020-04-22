import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import ActionButton from "react-native-action-button";
import ListRestaurants from "../../components/restaurants/ListRestaurants";
import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase/app";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

export default function Restaurants(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [startRestaurants, setStartRestaurants] = useState(null);
  const [loading, setLoading] = useState(false);
  const [totalRestaurants, setTotalRestaurants] = useState(0);
  const [reloadRestaurants, setReloadRestaurants] = useState(false);
  const limitRestaurants = 8;

  //console.log(restaurants);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useEffect(() => {
    db.collection("restaurants")
      .get()
      .then((snap) => {
        setTotalRestaurants(snap.size);
      });

    (async () => {
      const resultRestaurants = [];

      const restaurants = db
        .collection("restaurants")
        .orderBy("createAt", "desc")
        .limit(limitRestaurants);

      await restaurants.get().then((response) => {
        setStartRestaurants(response.docs[response.docs.length - 1]);
        response.forEach((doc) => {
          let restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurants.push(restaurant);
        });

        setRestaurants(resultRestaurants);
      });
    })();
    setReloadRestaurants(false);
  }, [reloadRestaurants]);

  const handleLoadMore = async () => {
    const resultRestaurants = [];
    restaurants.length < totalRestaurants && setLoading(true);

    const restaurantDb = db
      .collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurants.data().createAt)
      .limit(limitRestaurants);

    await restaurantDb.get().then((response) => {
      if (response.docs.length > 0) {
        setStartRestaurants(response.docs[response.docs.length - 1]);
      } else {
        setLoading(false);
      }

      response.forEach((doc) => {
        let restaurant = doc.data();
        restaurant.id = doc.id;
        resultRestaurants.push(restaurant);
      });

      setRestaurants([...restaurants, ...resultRestaurants]);
    });
  };

  return (
    <View style={styles.viewBody}>
      <ListRestaurants
        restaurants={restaurants}
        loading={loading}
        handleLoadMore={handleLoadMore}
        navigation={navigation}
      />
      {user && (
        <AddRestaurantButton
          navigation={navigation}
          setReloadRestaurants={setReloadRestaurants}
        />
      )}
    </View>
  );
}

function AddRestaurantButton(props) {
  const { navigation, setReloadRestaurants } = props;
  return (
    <ActionButton
      buttonColor="tomato"
      onPress={() =>
        navigation.navigate("New restaurant", { setReloadRestaurants })
      }
    />
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
  },
});
