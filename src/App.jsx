import { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import FitnessDashboard from "./FitnessDashboard";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg,#020617,#111827)",
          color: "white",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.06)",
            padding: 40,
            borderRadius: 24,
            textAlign: "center",
            backdropFilter: "blur(10px)",
          }}
        >
          <h1>🌿 Wellness RPG</h1>

          <p>Login to continue your journey</p>

          <button
            onClick={async () => {
              await supabase.auth.signInWithPassword({
                email: "teszt@teszt.com",
                password: "123456",
              });
            }}
            style={{
              marginTop: 20,
              padding: "14px 24px",
              border: "none",
              borderRadius: 14,
              background:
                "linear-gradient(135deg,#8b5cf6,#ec4899)",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            TEST LOGIN
          </button>
        </div>
      </div>
    );
  }

  return <FitnessDashboard />;
}