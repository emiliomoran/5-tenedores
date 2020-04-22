import React from "react";
import { StyleSheet } from "react-native";
import MapView from "react-native-maps";
import openMap from "react-native-open-maps";

export default function Map(props) {
  const { location, name, height } = props;

  /* const openAppMap2 = () => {
    OpenMap.show({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }; */

  const openAppMap = () => {
    //console.log("Enter open map");
    openMap({
      zoom: 19,
      query: `${location.latitude},${location.longitude}`,
    });
    /* openMap({
      latitude: location.latitude,
      longitude: location.longitude,
      zoom: 19,
      query: name,
    }); */
  };

  return (
    <MapView
      style={{
        width: "100%",
        height: height,
      }}
      initialRegion={location}
      onPress={openAppMap}
    >
      <MapView.Marker
        coordinate={{
          latitude: location.latitude,
          longitude: location.longitude,
        }}
      />
    </MapView>
  );
}
