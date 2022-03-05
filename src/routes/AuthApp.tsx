// import { createStackNavigator } from "@react-navigation/stack";
// import React, { useEffect } from "react";
// import { View } from "react-native";
// import Push from "../components/push";
// import { Ranking } from "../pages/ADM/Classificaçao";
// import { SingUp } from "../pages/ADM/CreateUser";
// import { Classificaçao } from "../pages/Classificaçao";
// import { Consumo } from "../pages/Consumo";
// import { FindUser } from "../pages/FindMembro";
// import { Valide } from "../pages/ValidePresença";
// import { Inicio } from "../pages/Inicio";
// import { Profile } from "../pages/Profile";
// import { StacKMembros } from "./StackMembros";
// import { TabBarApp } from "./TabBarApp";
// import { ListPresenca } from "../pages/ADM/ListaPresenca";
// import { UpdateSenhaUser } from "../pages/ADM/UpdateSenhaUser";
// import { DeletUser } from "../pages/ADM/DeleteUser";
// import { Indicaçoes } from "../pages/Indicaçes";
// import { Indication } from "../pages/Idication";

// const Stak = createStackNavigator();

// export function AuthApp() {
//   return (
//     <Stak.Navigator
//       initialRouteName="Inicio"
//       screenOptions={{ headerShown: false }}
//     >
//       <Stak.Screen name="Inicio" component={Inicio} />
//       <Stak.Screen name="valide" component={Valide} />
//       <Stak.Screen name="perfil" component={Profile} />
//       <Stak.Screen name="home" component={TabBarApp} />
//       <Stak.Screen name="consumo" component={Consumo} />
//       <Stak.Screen name="negociar" component={StacKMembros} />
//       <Stak.Screen name="indicacao" component={Indicaçoes} />

//       <Stak.Screen name="ranking" component={Ranking} />
//       <Stak.Screen name="user" component={SingUp} />
//       <Stak.Screen name="updateSenha" component={UpdateSenhaUser} />
//       <Stak.Screen name="delete" component={DeletUser} />
//       {/* <Stak.Screen name="push" component={Push} /> */}
//       <Stak.Screen name="classificaçao" component={Classificaçao} />
//       <Stak.Screen name="findUser" component={FindUser} />
//       <Stak.Screen name="presenca" component={ListPresenca} />
//       <Stak.Screen name="indication" component={Indication} />
//     </Stak.Navigator>
//   );
// }
