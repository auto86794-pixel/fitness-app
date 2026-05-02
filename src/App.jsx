import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import FitnessDashboard from "./FitnessDashboard";

function GlassCard({ children, style, id }) {
  return (
    <div
      id={id}
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 28,
        backdropFilter: "blur(12px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function LandingPage() {
  const navigate = useNavigate();

  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", onResize);

    return () =>
      window.removeEventListener("resize", onResize);
  }, []);

  const isMobile = width < 700;
  const isTablet = width < 900;

  function buyPro() {
    window.open(
      "https://buy.stripe.com/test_00w4gt0vP35P4b77Ce6c001",
      "_blank"
    );
  }

  function openDashboard() {
    navigate("/dashboard");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #030712 0%, #07111f 38%, #08121e 100%)",
        color: "white",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: isMobile ? 16 : 24,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* TOPBAR */}
        <GlassCard
          style={{
            padding: isMobile ? 16 : 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: isMobile ? 24 : 30,
              }}
            >
              ⚡ Homefit
            </h2>

            {!isMobile && (
              <div
                style={{
                  display: "flex",
                  gap: 24,
                }}
              >
                <a
                  href="#miert"
                  style={{
                    color: "#cbd5e1",
                    textDecoration: "none",
                  }}
                >
                  Miért működik
                </a>

                <a
                  href="#terv"
                  style={{
                    color: "#cbd5e1",
                    textDecoration: "none",
                  }}
                >
                  Edzésterv
                </a>

                <a
                  href="#teszt"
                  style={{
                    color: "#cbd5e1",
                    textDecoration: "none",
                  }}
                >
                  Tesztelés
                </a>
              </div>
            )}
          </div>
        </GlassCard>

        {/* HERO */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isTablet
              ? "1fr"
              : "1.1fr 0.9fr",
            gap: 30,
            marginBottom: 50,
          }}
        >
          {/* LEFT */}
          <GlassCard
            style={{
              padding: isMobile ? 24 : 42,
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
                fontSize: isMobile ? 12 : 14,
                fontWeight: 600,
              }}
            >
              🏠 Otthoni edzés · kezdőknek · fogyáshoz
            </div>

            <h1
              style={{
                fontSize: isMobile ? 42 : 74,
                lineHeight: 0.95,
                marginBottom: 24,
                marginTop: 0,
                letterSpacing: -2,
              }}
            >
              Személyre szabott
              <br />
              otthoni edzésterv
            </h1>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: 1.8,
                fontSize: isMobile ? 16 : 18,
                marginBottom: 32,
                maxWidth: 580,
              }}
            >
              Add meg az alapadataid, és kapsz egy egyszerű,
              követhető heti tervet, amit valóban végig tudsz
              csinálni otthon.
            </p>

            {/* TRUST */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "1fr 1fr",
                gap: 12,
                marginBottom: 32,
              }}
            >
              {[
                "✔ napi 15 perc",
                "✔ nincs szükség eszközre",
                "✔ teljesen kezdőknek",
                "✔ otthon végezhető",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    color: "#d1fae5",
                    fontSize: 15,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: 16,
                flexDirection: isMobile
                  ? "column"
                  : "row",
              }}
            >
              <button
                onClick={openDashboard}
                style={{
                  padding: "18px 30px",
                  borderRadius: 18,
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 16,
                  color: "white",
                  width: isMobile ? "100%" : "auto",
                  background:
                    "linear-gradient(135deg,#22c55e,#14b8a6)",
                  boxShadow:
                    "0 10px 30px rgba(16,185,129,0.25)",
                }}
              >
                🔥 Edzésterv készítése
              </button>

              <button
                onClick={openDashboard}
                style={{
                  padding: "18px 30px",
                  borderRadius: 18,
                  border:
                    "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: 16,
                  width: isMobile ? "100%" : "auto",
                  color: "white",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                Demó kipróbálása
              </button>
            </div>
          </GlassCard>

          {/* RIGHT */}
          <div
            style={{
              display: "grid",
              gap: 20,
            }}
          >
            <GlassCard
              style={{
                padding: isMobile ? 22 : 30,
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 20,
                }}
              >
                ⚡ Gyors beállítás
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: 14,
                }}
              >
                {[
                  "🎯 Cél: fogyás",
                  "📅 Heti 3 edzés",
                  "🏠 Otthoni edzés",
                  "⏱ 15–20 perc / nap",
                ].map((item) => (
                  <div
                    key={item}
                    style={{
                      padding: 14,
                      borderRadius: 16,
                      background:
                        "rgba(255,255,255,0.03)",
                      color: "#dbeafe",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard
              id="terv"
              style={{
                padding: isMobile ? 22 : 30,
              }}
            >
              <h3
                style={{
                  marginTop: 0,
                  marginBottom: 20,
                }}
              >
                📋 Heti edzésterv
              </h3>

              <div
                style={{
                  display: "grid",
                  gap: 16,
                }}
              >
                {[
                  [
                    "1. nap",
                    [
                      "Guggolás",
                      "Plank",
                      "Jumping Jack",
                    ],
                  ],
                  [
                    "2. nap",
                    [
                      "Glute bridge",
                      "Bird-dog",
                      "Hasprés",
                    ],
                  ],
                  [
                    "3. nap",
                    [
                      "Falnál ülés",
                      "Kitörés",
                      "Plank",
                    ],
                  ],
                ].map((day) => (
                  <div
                    key={day[0]}
                    style={{
                      padding: 20,
                      borderRadius: 20,
                      background:
                        "rgba(255,255,255,0.03)",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <strong
                      style={{
                        fontSize: 17,
                      }}
                    >
                      {day[0]}
                    </strong>

                    <ul
                      style={{
                        color: "#94a3b8",
                        marginBottom: 0,
                      }}
                    >
                      {day[1].map((ex) => (
                        <li key={ex}>{ex}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* FEATURES */}
        <div
          id="miert"
          style={{
            display: "grid",
            gridTemplateColumns: isTablet
              ? "1fr"
              : "1fr 1fr 1fr",
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
              "Azonnal használható",
              "Nincs bonyolult setup.",
            ],
          ].map((item) => (
            <GlassCard
              key={item[1]}
              style={{
                padding: 30,
              }}
            >
              <div
                style={{
                  fontSize: 42,
                  marginBottom: 10,
                }}
              >
                {item[0]}
              </div>

              <h3>{item[1]}</h3>

              <p
                style={{
                  color: "#94a3b8",
                  lineHeight: 1.7,
                }}
              >
                {item[2]}
              </p>
            </GlassCard>
          ))}
        </div>

        {/* CTA */}
        <GlassCard
          id="teszt"
          style={{
            padding: isMobile ? 26 : 46,
            background:
              "linear-gradient(135deg, rgba(34,197,94,0.15), rgba(20,184,166,0.12))",
            border: "1px solid rgba(34,197,94,0.2)",
            marginBottom: 40,
          }}
        >
          <h2
            style={{
              fontSize: isMobile ? 30 : 48,
              marginTop: 0,
              marginBottom: 18,
              lineHeight: 1.1,
            }}
          >
            🔥 Ne csak elkezdd —
            <br />
            csináld végig
          </h2>

          <p
            style={{
              color: "#cbd5e1",
              lineHeight: 1.8,
              marginBottom: 28,
              maxWidth: 700,
            }}
          >
            A Homefit PRO segít rendszeresen edzeni,
            fejlődni és végigvinni a programot anélkül,
            hogy túlterhelnéd magad.
          </p>

          <button
            onClick={buyPro}
            style={{
              padding: "18px 34px",
              borderRadius: 18,
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 18,
              width: isMobile ? "100%" : "auto",
              color: "white",
              background:
                "linear-gradient(135deg,#22c55e,#14b8a6)",
              boxShadow:
                "0 10px 30px rgba(16,185,129,0.25)",
            }}
          >
            🔥 Kérem a PRO programot – 2990 Ft
          </button>
        </GlassCard>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage />}
      />

      <Route
        path="/dashboard"
        element={<FitnessDashboard />}
      />
    </Routes>
  );
}

export default App;