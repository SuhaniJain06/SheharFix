import React, { createContext, useState, useContext } from "react";
import users from "../Entities/users.json"; // importing the seed users we created

// 1. Create the AuthContext
const AuthContext = createContext(null);

// 2. Provide AuthContext to whole app
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // login function → checks email & password against users.json
  const login = (email, password) => {
    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (foundUser) {
      setCurrentUser(foundUser);
      return true;
    }
    return false;
  };

  // logout function
  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom hook to use AuthContext in components
export const useAuth = () => {
  return useContext(AuthContext);
};
