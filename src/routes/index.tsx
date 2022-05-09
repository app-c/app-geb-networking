import React, { useState } from "react";
import { View } from "react-native";
import { AuthCredential } from "firebase/auth";
import { auth } from "../config";
import { useAuth } from "../hooks/AuthContext";
import { Inicio } from "../pages/Inicio";
import { SingIn } from "../pages/LogIn";
import { AuthApp } from "./AuthApp";

export function Route() {
  const { user } = useAuth();

  return user ? <AuthApp /> : <SingIn />;
}
