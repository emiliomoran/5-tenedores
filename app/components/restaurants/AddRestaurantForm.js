import React, { useState, useEffect } from "react";
import { StyleSheet, View, ScrollView, Alert, Dimensions } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import MapView from "react-native-maps";
import Modal from "../Modal";
import * as Location from "expo-location";
import uuid from "random-uuid-v4";

import { firebaseApp } from "../../utils/FireBase";
import firebase from "firebase";
import "firebase/firestore";
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantForm(props) {
  const { toastRef, setLoading, navigation, setReloadRestaurants } = props;
  const [imagesSelected, setImagesSelected] = useState([]);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [location, setLocation] = useState(null);

  const addRestaurant = () => {
    if (!name || !address || !description) {
      toastRef.current.show("All field are obligatory!");
    } else if (imagesSelected.length === 0) {
      toastRef.current.show("Restaurant has a least a image!");
    } else if (!location) {
      toastRef.current.show("Add location!");
    } else {
      setLoading(true);
      uploadImageStorage(imagesSelected)
        .then((arrayImages) => {
          //console.log(arrayImages);
          let data = {
            name: name,
            address: address,
            description: description,
            location: location,
            images: arrayImages,
            rating: 0,
            ratingTotal: 0,
            quantityVoting: 0,
            createAt: new Date(),
            createBy: firebaseApp.auth().currentUser.uid,
          };
          //console.log(data);
          db.collection("restaurants")
            .add(data)
            .then(() => {
              setLoading(false);
              setReloadRestaurants(true);
              navigation.navigate("Restaurants");
            })
            .catch((error) => {
              //console.log(error);
              setLoading(false);
              toastRef.current.show("Error creating restaurant, try later");
            });
        })
        .catch((error) => {
          //console.log(error);
          setLoading(false);
          toastRef.current.show("Error creating restaurant, try later");
        });
    }
  };

  const uploadImageStorage = async (imagesArray) => {
    const imagesBlob = [];
    await Promise.all(
      imagesArray.map(async (image) => {
        const response = await fetch(image);
        const blob = await response.blob();
        const ref = firebase.storage().ref("restaurants_images").child(uuid());
        await ref.put(blob).then((result) => {
          imagesBlob.push(result.metadata.name);
        });
      })
    );
    return imagesBlob;
  };

  return (
    <ScrollView>
      <ImageRestaurant imageRestaurant={imagesSelected[0]} />
      <FormAdd
        setName={setName}
        setAddress={setAddress}
        setDescription={setDescription}
        setIsVisibleMap={setIsVisibleMap}
        location={location}
      />
      <UploadImage
        imagesSelected={imagesSelected}
        setImagesSelected={setImagesSelected}
        toastRef={toastRef}
      />
      <Button
        title="Create"
        onPress={addRestaurant}
        buttonStyle={styles.btnAddRestaurant}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setIsVisibleMap={setIsVisibleMap}
        setLocation={setLocation}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}

function ImageRestaurant(props) {
  const { imageRestaurant } = props;

  return (
    <View style={styles.viewPhoto}>
      {imageRestaurant ? (
        <Image
          source={{
            uri: imageRestaurant,
          }}
          style={{ width: widthScreen, height: 200 }}
        />
      ) : (
        <Image
          source={require("../../../assets/img/no-image.png")}
          style={{ width: widthScreen, height: 200 }}
        />
      )}
    </View>
  );
}

function UploadImage(props) {
  const { imagesSelected, setImagesSelected, toastRef } = props;

  const imageSelect = async () => {
    const resultPermission = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );
    const resultPermissionCamera =
      resultPermission.permissions.cameraRoll.status;

    if (resultPermissionCamera === "denied") {
      toastRef.current.show("Permission denied");
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show("Cancelled select");
      } else {
        setImagesSelected([...imagesSelected, result.uri]);
      }
    }
  };

  const removeImage = (image) => {
    const arrayImages = imagesSelected;
    Alert.alert(
      "Delete imagen",
      "Are you sure that delete the image?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () =>
            setImagesSelected(
              arrayImages.filter((imageUrl) => imageUrl !== image)
            ),
        },
      ],
      {
        cancelable: false,
      }
    );
  };

  return (
    <View style={styles.viewImages}>
      {imagesSelected.length < 5 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}

      {imagesSelected.map((imageRestaurant, index) => (
        <Avatar
          key={index}
          onPress={() => removeImage(imageRestaurant)}
          containerStyle={styles.miniatureStyle}
          source={{
            uri: imageRestaurant,
          }}
        />
      ))}
    </View>
  );
}

function FormAdd(props) {
  const {
    setName,
    setAddress,
    setDescription,
    setIsVisibleMap,
    location,
  } = props;

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Name"
        containerStyle={styles.input}
        onChange={(e) => setName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Address"
        containerStyle={styles.input}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: location ? "tomato" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
        onChange={(e) => setAddress(e.nativeEvent.text)}
      />
      <Input
        placeholder="Description"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={(e) => setDescription(e.nativeEvent.text)}
      />
    </View>
  );
}

function Map(props) {
  const { isVisibleMap, setIsVisibleMap, setLocation, toastRef } = props;
  const [locationMap, setLocationMap] = useState(null);
  //console.log(locationMap);

  useEffect(() => {
    (async () => {
      let resultPermissions = await Permissions.askAsync(Permissions.LOCATION);
      const statusPermissions = resultPermissions.permissions.location.status;

      if (statusPermissions !== "granted") {
        toastRef.current.show("Permission denied, got to settings");
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        setLocationMap({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocation(locationMap);
    toastRef.current.show("Location saved successfully");
    setIsVisibleMap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
      <View>
        {locationMap && (
          <MapView
            style={styles.mapStyle}
            initialRegion={locationMap}
            showsUserLocation={true}
            onRegionChange={(region) => setLocationMap(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: locationMap.latitude,
                longitude: locationMap.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title="Save"
            onPress={confirmLocation}
            containerStyle={styles.viewMapBtnContainerSave}
            buttonStyle={styles.viewMapBtnSave}
          />
          <Button
            title="Cancel"
            onPress={() => setIsVisibleMap(false)}
            containerStyle={styles.viewMapBtnContainerCancel}
            buttonStyle={styles.viewMapBtnCancel}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  viewImages: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  viewMapBtnContainerSave: {
    paddingRight: 5,
    width: "45%",
  },
  viewMapBtnSave: {
    backgroundColor: "tomato",
  },
  viewMapBtnContainerCancel: {
    paddingLeft: 5,
    width: "45%",
  },
  viewMapBtnCancel: {
    backgroundColor: "#a60d0d",
  },
  btnAddRestaurant: {
    backgroundColor: "tomato",
    margin: 20,
  },
});
