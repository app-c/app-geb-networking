import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Membros } from "../pages/Membros";
import { Transaction } from "../pages/Transaction";
import { Sucess } from "../pages/Sucess";

const Stak = createStackNavigator();
export function StacKMembros() {
    return (
        <Stak.Navigator screenOptions={{ headerShown: false }}>
            <Stak.Screen name="Membros" component={Membros} />
            <Stak.Screen name="Transaction" component={Transaction} />
            <Stak.Screen name="sucess" component={Sucess} />
        </Stak.Navigator>
    );
}
