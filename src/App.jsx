import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import supabase from "./supabaseClient"; 
import LoginScreen from "./features/auth/LoginScreen";
import FitnessDashboard from "./FitnessDashboard";

function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // meglévő session lekérése
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // figyeli login/logout-ot
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            session ? <Navigate to="/dashboard" /> : <LoginScreen />
          }
        />
        <Route
          path="/dashboard"
          element={
            session ? <FitnessDashboard /> : <Navigate to="/" />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;