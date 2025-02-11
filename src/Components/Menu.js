import React, { useState } from "react";
import { useAuth } from "../Contexts/AuthContext";

function Menu() {
    const { user, signInWithGoogle, signOutUser } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="Menu">
            {/* {user && (
                <div className="dropdown">
                    <button className="dropdown-toggle" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        Saved Recipes ▼
                    </button>
                    {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            <li>Chicken and Lime Rice Bowl</li>
                            <li>Steak and Potatoes with Sauce</li>
                            <li>Ramen with Rich Tonkatsu Broth</li>
                        </ul>
                    )}
                </div>
            )} */}
            <button className="SignInButton" onClick={user ? signOutUser : signInWithGoogle}>
                {user ? "Sign Out" : "Sign In"}
            </button>
        </div>
    );
}

export default Menu;
