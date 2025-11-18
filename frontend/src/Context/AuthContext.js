import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userid, setUserid] = useState(localStorage.getItem("userid"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const login = (userId, userRole) => {
    localStorage.setItem("userid", userId);
    localStorage.setItem("role", userRole);
    setUserid(userId);
    setRole(userRole);
  };

  const logout = () => {
    localStorage.removeItem("userid");
    localStorage.removeItem("role");
    setUserid(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ userid, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
