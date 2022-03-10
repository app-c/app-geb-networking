import React from "react";
import { View } from "react-native";
import { useAuth } from "../hooks/AuthContext";
import { Inicio } from "../pages/Inicio";
import { SingIn } from "../pages/LogIn";
import { AuthApp } from "./AuthApp";

export function Route() {
  const { user } = useAuth();
  return user ? <AuthApp /> : <SingIn />;
}
