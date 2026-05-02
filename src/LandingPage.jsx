import { useEffect, useState } from "react";
import supabase from "./supabaseClient";
import FitnessDashboard from "./FitnessDashboard";

function LandingPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #030712 0%, #07111f 38%, #08121e 100%)",
        color: "white",
        fontFamily: "Inter, sans-serif",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* TOPBAR */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 24px",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 999,
            background: "rgba(255,255,255,0.03)",
            marginBottom: 30,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontWeight: 800,
              fontSize: 22,
            }}
          >
            ⚡ Homefit
          </div>

          <div
            style={{
              display: "flex",
              gap: 20,
              color: "#94a3b8",
            }}
          >
            <span>Miért működik</span>
            <span>Edzésterv</span>
            <span>Tesztelés</span>
          </div>
        </div>

        {/* HERO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: 24,
          }}
        >
          {/* LEFT */}
          <div
            style={{
              background: "rgba(255,255,255,0.04)",
              borderRadius: 32,
              padding: 40,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: 999,
                background: "rgba(34,197,94,0.15)",
                color: "#bbf7d0",
                marginBottom: 24,
                fontWeight: 700,
              }}
            >
              🏠 Otthoni edzés · kezdőknek · fogyási célra
            </div>

            <h1
              style={{
                fontSize: 72,
                lineHeight: 1,
                marginBottom: 24,
                fontWeight: 900,
                letterSpacing: "-3px",
              }}
            >
              Személyre szabott edzésterv 1 perc alatt
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: 18,
                lineHeight: 1.8,
                maxWidth: 650,
              }}
            >
              Add meg az alapadataid, és kapsz egy egyszerű, követhető,
              otthon végezhető heti edzéstervet. Nincs konditerem, nincs
              túlbonyolítás — csak egy tiszta kezdőpont.
            </p>

            <div
              style={{
                display: "flex",
                gap: 14,
                marginTop: 30,
                flexWrap: "wrap",
              }}
            >
              <button
                style={{
                  padding: "16px 24px",
                  borderRadius: 18,
                  border: "none",
                  background:
                    "linear-gradient(135deg,#22c55e,#14b8a6)",
                  color: "white",
                  fontWeight: 800,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                🔥 Edzéstervem elkészítése
              </button>

              <button
                style={{
                  padding: "16px 24px",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.03)",
                  color: "white",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                Demó kipróbálása
              </button>
            </div>

            {/* STATS */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3,1fr)",
                gap: 14,
                marginTop: 34,
              }}
            >
              {[
                ["1 perc", "ennyi idő a kitöltés"],
                ["15–30 perc", "rövid edzésblokkok"],
                ["2–5 nap", "rugalmas heti terv"],
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    padding: 18,
                    borderRadius: 22,
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      marginBottom: 8,
                    }}
                  >
                    {item[0]}
                  </div>

                  <div
                    style={{
                      color: "#94a3b8",
                      fontSize: 14,
                    }}
                  >
                    {item[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div
            style={{
              background:
                "linear-gradient(180deg, rgba(15,23,42,0.95), rgba(9,17,31,0.95))",
              borderRadius: 32,
              padding: 28,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 20,
                color: "#94a3b8",
              }}
            >
              <span>App előnézet</span>

              <div
                style={{
                  background: "rgba(34,197,94,0.15)",
                  color: "#bbf7d0",
                  padding: "8px 12px",
                  borderRadius: 999,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                Kezdőbarát rendszer
              </div>
            </div>

            {[
              {
                title: "1. nap - teljes test",
                list: [
                  "Guggolás",
                  "Térdelő fekvőtámasz",
                  "Plank",
                ],
              },
              {
                title: "2. nap - teljes test",
                list: [
                  "Glute bridge",
                  "Helyben járás",
                  "Bird-dog",
                ],
              },
              {
                title: "3. nap - teljes test",
                list: [
                  "Falnál ülés",
                  "Hasprés",
                  "Térdemelés helyben",
                ],
              },
            ].map((day, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 24,
                  padding: 20,
                  marginBottom: 16,
                }}
              >
                <div
                  style={{
                    fontWeight: 800,
                    marginBottom: 12,
                    fontSize: 20,
                  }}
                >
                  {day.title}
                </div>

                <ul
                  style={{
                    color: "#94a3b8",
                    lineHeight: 2,
                    paddingLeft: 20,
                  }}
                >
                  {day.list.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

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
    return <LandingPage />;
  }

  return <FitnessDashboard />;
}