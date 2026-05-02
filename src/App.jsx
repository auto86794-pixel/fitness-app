import { useEffect, useState } from "react";
import FitnessDashboard from "./FitnessDashboard";

function LandingPage() {
  function buyPro() {
    window.open(
      "https://buy.stripe.com/test_00w4gt0vP35P4b77Ce6c001",
      "_blank"
    );
  }

  function openDashboard() {
    window.location.href = "/dashboard";
  }

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
            padding: 20,
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 24,
            marginBottom: 40,
            background: "rgba(255,255,255,0.03)",
          }}
        >
          <h2>⚡ Homefit</h2>

          <div style={{ display: "flex", gap: 20 }}>
            <a href="#miert" style={{ color: "#cbd5e1" }}>
              Miért működik
            </a>

            <a href="#terv" style={{ color: "#cbd5e1" }}>
              Edzésterv
            </a>

            <a href="#teszt" style={{ color: "#cbd5e1" }}>
              Tesztelés
            </a>
          </div>
        </div>

        {/* HERO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 30,
            marginBottom: 50,
          }}
        >
          <div
            style={{
              padding: 40,
              borderRadius: 30,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                background: "rgba(34,197,94,0.12)",
                padding: "10px 16px",
                borderRadius: 999,
                display: "inline-block",
                marginBottom: 20,
                color: "#bbf7d0",
              }}
            >
              🏠 Otthoni edzés · kezdőknek · fogyási célra
            </div>

            <h1
              style={{
                fontSize: 72,
                lineHeight: 1,
                marginBottom: 24,
              }}
            >
              Személyre szabott edzésterv 1 perc alatt
            </h1>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: 1.8,
                fontSize: 18,
                marginBottom: 30,
              }}
            >
              Add meg az alapadataid, és kapsz egy egyszerű,
              követhető, otthon végezhető heti edzéstervet.
            </p>

            <div style={{ display: "flex", gap: 16 }}>
              <button
                onClick={openDashboard}
                style={{
                  padding: "16px 28px",
                  borderRadius: 18,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "white",
                  background:
                    "linear-gradient(135deg,#22c55e,#14b8a6)",
                }}
              >
                🔥 Edzéstervem elkészítése
              </button>

              <button
                onClick={openDashboard}
                style={{
                  padding: "16px 28px",
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "white",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                Demó kipróbálása
              </button>
            </div>
          </div>

          {/* PREVIEW */}
          <div
            style={{
              padding: 30,
              borderRadius: 30,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <h3 style={{ marginBottom: 20 }}>
              App előnézet
            </h3>

            <div
              style={{
                display: "grid",
                gap: 16,
              }}
            >
              {[
                ["1. nap", ["Guggolás", "Plank"]],
                ["2. nap", ["Glute bridge", "Bird-dog"]],
                ["3. nap", ["Falnál ülés", "Hasprés"]],
              ].map((day) => (
                <div
                  key={day[0]}
                  style={{
                    padding: 20,
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.03)",
                    border:
                      "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <strong>{day[0]}</strong>

                  <ul style={{ color: "#94a3b8" }}>
                    {day[1].map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FEATURES */}
        <div
          id="miert"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 20,
            marginBottom: 50,
          }}
        >
          {[
            [
              "🎯",
              "Nem motivációra épít",
              "Egyszerű rendszer kezdőknek.",
            ],
            [
              "🧩",
              "Kezdőkre optimalizálva",
              "Rövid és követhető blokkok.",
            ],
            [
              "⚡",
              "Azonnal kipróbálható",
              "Nincs bonyolult setup.",
            ],
          ].map((item) => (
            <div
              key={item[1]}
              style={{
                padding: 28,
                borderRadius: 24,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <div style={{ fontSize: 40 }}>
                {item[0]}
              </div>

              <h3>{item[1]}</h3>

              <p style={{ color: "#94a3b8" }}>
                {item[2]}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          id="teszt"
          style={{
            padding: 40,
            borderRadius: 30,
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(20,184,166,0.12))",
            border: "1px solid rgba(34,197,94,0.2)",
          }}
        >
          <h2
            style={{
              fontSize: 42,
              marginBottom: 16,
            }}
          >
            🔥 Ne csak elkezdd – csináld végig
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.8,
              marginBottom: 20,
            }}
          >
            A Homefit PRO segít abban, hogy ne csak
            elkezd, hanem végig is csináld.
          </p>

          <button
            onClick={buyPro}
            style={{
              padding: "18px 32px",
              borderRadius: 18,
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 18,
              color: "white",
              background:
                "linear-gradient(135deg,#22c55e,#14b8a6)",
            }}
          >
            🔥 Kérem a PRO programot – 2990 Ft
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    if (window.location.pathname === "/dashboard") {
      setShowDashboard(true);
    }
  }, []);

  if (showDashboard) {
    return <FitnessDashboard />;
  }

  return <LandingPage />;
}

export default App;