import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { TabBarApp } from "./TabBarApp";
import { CreateInfo } from "../pages/ADM/CreateInfo";
import Push from "../components/push";
import { SingUp } from "../pages/ADM/CreateUser";
import { Classificaçao } from "../pages/Classificaçao";

export function DrawerApp() {
    const Drawer = createDrawerNavigator();
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="home" component={TabBarApp} />
            <Drawer.Screen name="Criar um usuário" component={SingUp} />
            <Drawer.Screen name="Classificação" component={Classificaçao} />
            <Drawer.Screen name="Criar notificação" component={CreateInfo} />
            <Drawer.Screen name="Push" component={Push} />
        </Drawer.Navigator>
    );
}
