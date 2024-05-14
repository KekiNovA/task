import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "./state/useAuthState";

const PrivateRoutes = () => {
  const { userToken } = useAuthState();
  return userToken !== null ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
