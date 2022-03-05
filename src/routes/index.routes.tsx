import React from "react";
import { useAuth } from "../hooks/AuthContext";
// import { AuthApp } from "./AuthApp";
import { SignAuth } from "./SignInAuth";

export function Route() {
  const { user } = useAuth();
  return <SignAuth />;
}
