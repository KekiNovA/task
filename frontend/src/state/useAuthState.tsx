import { useState } from "react";
import constate from "constate";
import axios from "axios";

const useAuthState_ = () => {
  const [userToken, setUserToken] = useState<any | null>(
    localStorage.getItem("userToken") || null
  );
  const [tasks, setTasks] = useState<any>(null);
  const login = async (data: any) => {
    const response = await axios.post("http://localhost:8000/login", data);
    setUserToken(response.data.token);
    localStorage.setItem("userToken", response.data.token);
  };
  const logout = async () => {
    await axios
      .post(
        "http://localhost:8000/logout",
        {},
        {
          headers: {
            Authorization: `Token ${userToken}`,
          },
        }
      )
      .then((res) => {
        setUserToken(null);
        localStorage.removeItem("userToken");
      })
      .catch((error) => {
        console.log("error in logout");
      });
  };

  const fetchTasks = async () => {
    await axios
      .get("http://localhost:8000/tasks/", {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      })
      .then((res) => {
        setTasks(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return {
    userToken,
    setUserToken,
    login,
    logout,
    tasks,
    setTasks,
    fetchTasks,
  };
};

export const [AuthStateProvider, useAuthState] = constate(useAuthState_);
