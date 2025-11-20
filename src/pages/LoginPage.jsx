import React from "react";
import LoginForm from "../utils/LoginForm";

export default function LoginPage({ setIsLoggedIn }) {
  return <LoginForm setIsLoggedIn={setIsLoggedIn} />;
}