import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Post } from "../pages/Post";
import { Home } from "../pages/Home";

const Stak = createStackNavigator();
export function StackHome() {
    return (
        <Stak.Navigator screenOptions={{ headerShown: false }}>
            <Stak.Screen name="home" component={Home} />
            <Stak.Screen name="Post" component={Post} />
        </Stak.Navigator>
    );
}
