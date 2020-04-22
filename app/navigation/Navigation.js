import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//Screens
import MyAccount from "../screens/account/MyAccount";
import Restaurants from "../screens/restaurants/Restaurants";
import Search from "../screens/Search";
import TopRestaurants from "../screens/TopRestaurants";
import Login from "../screens/account/Login";
import Register from "../screens/account/Register";
import AddRestaurant from "../screens/restaurants/AddRestaurant";
import Restaurant from "../screens/restaurants/Restaurant";
import AddReviewRestaurant from "../screens/restaurants/AddReviewRestaurant";
import Favorites from "../screens/Favorites";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function MyAccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="My Account" component={MyAccount} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
    </Stack.Navigator>
  );
}

function RestaurantsStack(props) {
  //console.log(props);
  return (
    <Stack.Navigator>
      <Stack.Screen name="Restaurants" component={Restaurants} />
      <Stack.Screen name="New restaurant" component={AddRestaurant} />
      <Stack.Screen
        name="Restaurant"
        component={Restaurant}
        options={({ route }) => ({ title: route.params.restaurant.name })}
      />
      <Stack.Screen name="New review" component={AddReviewRestaurant} />
    </Stack.Navigator>
  );
}

function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={Search} />
    </Stack.Navigator>
  );
}

function TopRestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Top Restaurants" component={TopRestaurants} />
    </Stack.Navigator>
  );
}

function FavoritesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Favorites" component={Favorites} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Restaurants"
        backBehavior={{
          initialRoute: "Restaurants",
          order: [
            "Restaurants",
            "Favorites",
            "Top Restaurants",
            "Search",
            "My Account",
          ],
        }}
        tabBarOptions={{
          activeTintColor: "tomato",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen
          name="Restaurants"
          component={RestaurantsStack}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (
                <MaterialCommunityIcons
                  name="compass-outline"
                  color={color}
                  size={size}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesStack}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (
                <MaterialCommunityIcons
                  name="heart-outline"
                  color={color}
                  size={size}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="Top Restaurants"
          component={TopRestaurantsStack}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="star-outline"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchStack}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (
                <MaterialCommunityIcons
                  name="magnify"
                  color={color}
                  size={size}
                />
              );
            },
          }}
        />
        <Tab.Screen
          name="My Account"
          component={MyAccountStack}
          options={{
            tabBarIcon: ({ color, size }) => {
              return (
                <MaterialCommunityIcons
                  name="home-outline"
                  color={color}
                  size={size}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
