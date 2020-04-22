import React, { useState, useRef } from "react";
import { View, Text } from "react-native";
import Toast from "react-native-easy-toast";
import Loading from "../../components/Loading";
import AddRestaurantForm from "../../components/restaurants/AddRestaurantForm";

export default function AddRestaurant(props) {
  const { navigation, route } = props;
  const { setReloadRestaurants } = route.params;
  const toastRef = useRef();
  const [loading, setLoading] = useState(false);

  return (
    <View>
      <AddRestaurantForm
        toastRef={toastRef}
        setLoading={setLoading}
        navigation={navigation}
        setReloadRestaurants={setReloadRestaurants}
      />
      <Toast ref={toastRef} position="center" opacity={0.5} />
      <Loading isVisible={loading} text="Creating restaurant..." />
    </View>
  );
}
