import {
    AntDesign,
    Entypo,
    FontAwesome5,
    MaterialCommunityIcons,
} from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { RFValue } from "react-native-responsive-fontsize";
import { Image } from "react-native";
import theme from "../global/styles/theme";
import { Aviso } from "../pages/Aviso";
import { Consumo } from "../pages/Consumo";
import { StacKMembros } from "./StackMembros";
import { StackHome } from "./StackHome";
import sobreImg from "../assets/sobre.png";
import { InfoGeb } from "../pages/infoGeb";

const Tab = createBottomTabNavigator();
export function TabBarApp() {
    return (
        <Tab.Navigator
            initialRouteName="home"
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: theme.colors.focus,
                tabBarLabelStyle: { fontFamily: theme.fonts.regular },
                tabBarInactiveTintColor: theme.colors.tex_light,
                tabBarStyle: {
                    paddingTop: 5,
                    paddingBottom: 10,
                    height: 60,
                },
            }}
        >
            <Tab.Screen
                name="Home"
                component={StackHome}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <Entypo name="home" size={size} color={color} />
                    ),
                }}
            />

            {/* <Tab.Screen
                name="Noticias"
                component={Aviso}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <MaterialCommunityIcons
                            name="chat-alert"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            /> */}

            <Tab.Screen
                name="Sobre o GEB"
                component={InfoGeb}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome5
                            name="info-circle"
                            size={size}
                            color={color}
                        />
                    ),
                }}
            />

            <Tab.Screen
                name="Membros"
                component={StacKMembros}
                options={{
                    tabBarIcon: ({ size, color }) => (
                        <FontAwesome5 name="users" size={size} color={color} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}