/* eslint-disable react/style-prop-object */
/* eslint-disable camelcase */
import "./src/config";
import "react-native-gesture-handler";
import "intl";
import "intl/locale-data/jsonp/pt-BR";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_900Black,
} from "@expo-google-fonts/roboto";
import { Comfortaa_400Regular } from "@expo-google-fonts/comfortaa";
import {
  BarlowCondensed_400Regular,
  BarlowCondensed_600SemiBold,
  BarlowCondensed_300Light,
} from "@expo-google-fonts/barlow-condensed";
import AppLoading from "expo-app-loading";
import { ThemeProvider } from "styled-components/native";

import { NavigationContainer } from "@react-navigation/native";
import theme from "./src/global/styles/theme";
import { SingIn } from "./src/pages/LogIn";
import AppProvider from "./src/hooks";
import { Route } from "./src/routes/index.routes";

export default function App() {
  const [loaded] = useFonts({
    Roboto_400Regular,
    Roboto_900Black,
    Comfortaa_400Regular,
    BarlowCondensed_400Regular,
    BarlowCondensed_600SemiBold,
    BarlowCondensed_300Light,
  });

  if (!loaded) {
    return <AppLoading />;
  }

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <StatusBar style="light" hidden />
        <AppProvider>
          <Route />
        </AppProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}
