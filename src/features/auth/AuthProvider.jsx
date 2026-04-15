import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config"; // ❗ EZ FONTOS

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("AUTH CHANGE:", firebaseUser);
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}