import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Membros } from "../pages/Membros";
import { Transaction } from "../pages/Transaction";
import { Sucess } from "../pages/Sucess";
import { B2B } from "../pages/B2B";
import { OrderB2b } from "../pages/OrderB2b";

const Stak = createStackNavigator();
export function StacKB2b() {
  return (
    <Stak.Navigator screenOptions={{ headerShown: false }}>
      <Stak.Screen name="b2b" component={B2B} />
      <Stak.Screen name="orderB2b" component={OrderB2b} />
      <Stak.Screen name="sucess" component={Sucess} />
    </Stak.Navigator>
  );
}
