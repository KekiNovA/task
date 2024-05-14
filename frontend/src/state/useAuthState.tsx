import { useState } from "react";
import constate from "constate";
import axios from "axios";

const useAuthState_ = () => {
  const [userToken, setUserToken] = useState<any | null>(
    localStorage.getItem("userToken") || null
  );
  const login = async (data: any) => {
    const response = await axios.post("http://localhost:8000/login", data);
    setUserToken(response.data.token);
    localStorage.setItem("userToken", response.data.token);
  };
  const logout = async () => {};
  return {
    userToken,
    setUserToken,
    login,
    logout,
  };
};

export const [AuthStateProvider, useAuthState] = constate(useAuthState_);
