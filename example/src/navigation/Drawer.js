import React from "react";
import { Platform } from "react-native";

import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import { createStackNavigator } from "react-navigation-stack";
import { createBrowserApp } from "@react-navigation/web";

import { screens } from "expo-inputs";

import HomeScreen from "../screens/HomeScreen";
import TextForm from "../screens/TextForm";

const MyDrawerNavigator = createDrawerNavigator({
  // Home: {
  //   screen: HomeScreen
  // },
  TextForm: {
    screen: TextForm
  }
});

//make expo-input screens accessible by adding them to a surrounding stack navigator
const StackNavigator = createStackNavigator({
  MyDrawerNavigator,
  ...screens
});

const createRightContainer =
  Platform.OS === "web" ? createBrowserApp : createAppContainer;

const MyApp = createRightContainer(StackNavigator);

export default MyApp;
