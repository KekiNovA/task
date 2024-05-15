import React from "react";
import { useAuthState } from "../state/useAuthState";
import toast from "react-hot-toast";

function Header() {
  const { logout } = useAuthState();
  return (
    <div>
      <nav className="nav">
        <div className="nav-right my-lg-0">
          <div className="tabs">
            <button
              className="btn btn-link"
              onClick={async () => {
                await logout();
                toast.success("Logout successullfy");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Header;
