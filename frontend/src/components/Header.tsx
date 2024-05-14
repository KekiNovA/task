import React from "react";
import { useAuthState } from "../state/useAuthState";

function Header() {
  const { logout } = useAuthState();
  return (
    <div>
      <nav className="nav">
        <div className="nav-right my-lg-0">
          <div className="tabs">
            <button
              className="btn btn-link"
              onClick={() => {
                logout();
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
