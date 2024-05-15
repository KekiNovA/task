import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PrivateRoutes from "./PrivateRoutes";
import { AuthStateProvider } from "./state/useAuthState";
import "./index.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthStateProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<Home />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<h1>404</h1>} />
        </Routes>
      </BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          error: {
            style: {
              background: "#ff5252",
              color: "#fff",
            },
            iconTheme: {
              primary: "#713200",
              secondary: "#FFFAEE",
            },
          },
          success: {
            style: {
              background: "#4CAF50",
              color: "#fff",
            },
            iconTheme: {
              primary: "#f1f2f6",
              secondary: "#2f3542",
            },
          },
        }}
      ></Toaster>
    </AuthStateProvider>
  );
}

export default App;
