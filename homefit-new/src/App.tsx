import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import FitnessDashboard from "./FitnessDashboard";

export default function App() {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // meglévő session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // login/logout figyelés
    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  if (!session) {
    return (
      <div style={{ color: "white", textAlign: "center", marginTop: "50px" }}>
        <h1>Not logged in</h1>
        <p>Kattints a TEST LOGIN-re</p>

        <button
          onClick={async () => {
            await supabase.auth.signInWithPassword({
              email: "teszt@teszt.com",
              password: "123456",
            });
          }}
        >
          TEST LOGIN
        </button>
      </div>
    );
  }

  return <FitnessDashboard />;
}