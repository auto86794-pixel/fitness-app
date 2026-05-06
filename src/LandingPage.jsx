import { useEffect, useState } from "react";

console.log("🔥 MODERN LANDING FUT");

import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import FitnessDashboard from "./FitnessDashboard";
import BadgeScreen from "./BadgeScreen";

// FIREBASE AUTH
import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./firebase/config";

// PROFILE CREATE
import {
  createUserProfile,
} from "./createUserProfile";

// ANONYMOUS LOGIN
import {
  anonymousLogin,
} from "./anonymousLogin";

// SAVE QUESTIONNAIRE
import {
  saveQuestionnaire,
} from "./saveQuestionnaire";

/* =======================================================
   🧊 GLASS CARD
======================================================= */

function GlassCard({
  children,
  style,
  id,
}) {
  return (
    <div
      id={id}
      style={{
        background:
          "rgba(255,255,255,0.03)",
        border:
          "1px solid rgba(255,255,255,0.08)",
        borderRadius: 28,
        backdropFilter:
          "blur(12px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/* =======================================================
   🏠 LANDING PAGE
======================================================= */

function LandingPage({ user }) {

  const navigate = useNavigate();

  const [width, setWidth] =
    useState(window.innerWidth);

  const [gender, setGender] =
    useState("Nő");

  const [age, setAge] =
    useState(29);

  const [weight, setWeight] =
    useState(78);

  const [height, setHeight] =
    useState(168);

  const [goal, setGoal] =
    useState("Fogyás");

  const [weeklyDays, setWeeklyDays] =
    useState(3);

  const [workoutMinutes, setWorkoutMinutes] =
    useState(20);

  /* ======================
     📱 RESIZE
  ====================== */

  useEffect(() => {

    const onResize = () =>
      setWidth(window.innerWidth);

    window.addEventListener(
      "resize",
      onResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        onResize
      );

  }, []);

  const isMobile = width < 900;

  /* ======================
     🚀 OPEN DASHBOARD
  ====================== */

  async function openDashboard() {

    try {

      console.log("🔥 dashboard indítás");

      if (user) {

        await saveQuestionnaire({
          goal,
          level: "Kezdő",
          duration: workoutMinutes,
          days: weeklyDays,
          gender,
          age,
          weight,
          height,
        });

        console.log(
          "✅ questionnaire mentve"
        );

      }

      navigate("/dashboard");

    } catch (err) {

      console.error(
        "❌ openDashboard hiba:",
        err
      );

      navigate("/dashboard");

    }

  }

  /* ======================
     🎨 UI
  ====================== */

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, #030712 0%, #07111f 38%, #08121e 100%)",
        color: "white",
        padding:
          isMobile ? 16 : 24,
        fontFamily:
          "Inter, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
        }}
      >

        {/* ======================
            TOPBAR
        ====================== */}

        <GlassCard
          style={{
            padding:
              "16px 24px",
            marginBottom: 30,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontWeight: 800,
              fontSize: 24,
            }}
          >
            ⚡ Homefit
          </div>

          {!isMobile && (
            <div
              style={{
                display: "flex",
                gap: 24,
                color: "#94a3b8",
                fontWeight: 600,
              }}
            >
              <span>
                Miért működik
              </span>

              <span>
                Edzésterv
              </span>

              <span>
                Tesztelés
              </span>
            </div>
          )}
        </GlassCard>

        {/* ======================
            HERO GRID
        ====================== */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "1.1fr 0.9fr",
            gap: 24,
            marginBottom: 40,
          }}
        >

          {/* ======================
              LEFT HERO
          ====================== */}

          <GlassCard
            style={{
              padding:
                isMobile
                  ? 28
                  : 42,
            }}
          >

            <div
              style={{
                display:
                  "inline-block",
                padding:
                  "10px 18px",
                borderRadius: 999,
                background:
                  "rgba(34,197,94,0.15)",
                color: "#bbf7d0",
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              🏠 Otthoni edzés ·
              kezdőknek ·
              fogyáshoz
            </div>

            <h1
              style={{
                fontSize:
                  isMobile
                    ? 54
                    : 82,
                lineHeight: 0.95,
                margin:
                  "0 0 28px 0",
                fontWeight: 900,
                letterSpacing:
                  "-4px",
              }}
            >
              Személyre
              szabott
              <br />
              otthoni
              <br />
              edzésterv
            </h1>

            <p
              style={{
                color: "#94a3b8",
                fontSize: 22,
                lineHeight: 1.7,
                maxWidth: 650,
              }}
            >
              Add meg az
              alapadataid,
              és kapsz egy
              egyszerű,
              követhető
              heti tervet,
              amit valóban
              végig tudsz
              csinálni
              otthon.
            </p>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: 16,
                marginTop: 34,
                flexWrap: "wrap",
              }}
            >

              <button
                onClick={
                  openDashboard
                }
                style={{
                  padding:
                    "18px 28px",
                  borderRadius: 18,
                  border: "none",
                  background:
                    "linear-gradient(135deg,#22c55e,#14b8a6)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 18,
                  cursor: "pointer",
                  boxShadow:
                    "0 10px 30px rgba(34,197,94,0.25)",
                }}
              >
                🔥 Edzésterv
                készítése
              </button>

              <button
                style={{
                  padding:
                    "18px 28px",
                  borderRadius: 18,
                  border:
                    "1px solid rgba(255,255,255,0.08)",
                  background:
                    "rgba(255,255,255,0.03)",
                  color: "white",
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: "pointer",
                }}
              >
                Demó
                kipróbálása
              </button>

            </div>

            {/* STATS */}

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  isMobile
                    ? "1fr"
                    : "repeat(3,1fr)",
                gap: 16,
                marginTop: 40,
              }}
            >
              {[
                [
                  "1 perc",
                  "ennyi idő alatt elkészül"
                ],
                [
                  "15–30 perc",
                  "rövid blokkok"
                ],
                [
                  "2–5 nap",
                  "rugalmas rendszer"
                ],
              ].map(
                (item, i) => (
                  <div
                    key={i}
                    style={{
                      background:
                        "rgba(255,255,255,0.03)",
                      border:
                        "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 24,
                      padding: 24,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 36,
                        fontWeight: 900,
                        marginBottom: 10,
                      }}
                    >
                      {item[0]}
                    </div>

                    <div
                      style={{
                        color:
                          "#94a3b8",
                        lineHeight: 1.6,
                      }}
                    >
                      {item[1]}
                    </div>
                  </div>
                )
              )}
            </div>

          </GlassCard>

          {/* ======================
              RIGHT PREVIEW
          ====================== */}

          <GlassCard
            style={{
              padding: 28,
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  color:
                    "#94a3b8",
                }}
              >
                App előnézet
              </div>

              <div
                style={{
                  padding:
                    "8px 14px",
                  borderRadius: 999,
                  background:
                    "rgba(34,197,94,0.15)",
                  color:
                    "#bbf7d0",
                  fontSize: 13,
                  fontWeight: 700,
                }}
              >
                Kezdőbarát
              </div>
            </div>

            {[
              {
                title:
                  "1. nap • teljes test",
                list: [
                  "Guggolás",
                  "Térdelő fekvőtámasz",
                  "Plank",
                ],
              },
              {
                title:
                  "2. nap • teljes test",
                list: [
                  "Glute bridge",
                  "Helyben járás",
                  "Bird-dog",
                ],
              },
              {
                title:
                  "3. nap • teljes test",
                list: [
                  "Falnál ülés",
                  "Hasprés",
                  "Térdemelés helyben",
                ],
              },
            ].map(
              (day, i) => (
                <div
                  key={i}
                  style={{
                    background:
                      "rgba(255,255,255,0.03)",
                    border:
                      "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 24,
                    padding: 24,
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 800,
                      marginBottom: 18,
                    }}
                  >
                    {day.title}
                  </div>

                  <ul
                    style={{
                      color:
                        "#94a3b8",
                      lineHeight: 2,
                      paddingLeft: 20,
                      fontSize: 18,
                    }}
                  >
                    {day.list.map(
                      (
                        item,
                        idx
                      ) => (
                        <li
                          key={
                            idx
                          }
                        >
                          {item}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )
            )}

          </GlassCard>

        </div>

        {/* ======================
            QUESTIONNAIRE
        ====================== */}

        <GlassCard
          style={{
            padding:
              isMobile
                ? 24
                : 40,
            marginBottom: 40,
          }}
        >

          <h2
            style={{
              fontSize:
                isMobile
                  ? 48
                  : 72,
              marginBottom: 20,
            }}
          >
            Kérdőív
          </h2>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: 1.8,
              marginBottom: 30,
              fontSize: 18,
            }}
          >
            Add meg az
            alapadataid,
            és elkészítjük
            a személyre
            szabott heti
            terved.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                isMobile
                  ? "1fr"
                  : "1fr 1fr",
              gap: 20,
            }}
          >

            <div>
              <label>Nem</label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option>
                  Nő
                </option>

                <option>
                  Férfi
                </option>
              </select>
            </div>

            <div>
              <label>
                Életkor
              </label>

              <input
                value={age}
                onChange={(e) =>
                  setAge(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label>
                Testsúly
              </label>

              <input
                value={weight}
                onChange={(e) =>
                  setWeight(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label>
                Magasság
              </label>

              <input
                value={height}
                onChange={(e) =>
                  setHeight(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

            <div>
              <label>Cél</label>

              <select
                value={goal}
                onChange={(e) =>
                  setGoal(
                    e.target.value
                  )
                }
                style={inputStyle}
              >
                <option>
                  Fogyás
                </option>

                <option>
                  Erősödés
                </option>

                <option>
                  Állóképesség
                </option>
              </select>
            </div>

            <div>
              <label>
                Heti napok
              </label>

              <input
                value={
                  weeklyDays
                }
                onChange={(e) =>
                  setWeeklyDays(
                    e.target.value
                  )
                }
                style={inputStyle}
              />
            </div>

          </div>

          <button
            onClick={
              openDashboard
            }
            style={{
              marginTop: 30,
              width: "100%",
              padding:
                "20px",
              borderRadius: 22,
              border: "none",
              background:
                "linear-gradient(135deg,#22c55e,#14b8a6)",
              color: "white",
              fontWeight: 900,
              fontSize: 20,
              cursor: "pointer",
              boxShadow:
                "0 10px 30px rgba(34,197,94,0.25)",
            }}
          >
            🔥 Edzésterv
            generálása
          </button>

        </GlassCard>

      </div>
    </div>
  );
}

/* =======================================================
   🎨 INPUT STYLE
======================================================= */

const inputStyle = {
  width: "100%",
  padding: "18px",
  marginTop: 8,
  borderRadius: 18,
  border:
    "1px solid rgba(255,255,255,0.08)",
  background:
    "rgba(255,255,255,0.03)",
  color: "white",
  fontSize: 16,
  outline: "none",
  boxSizing: "border-box",
};

/* =======================================================
   🚀 APP
======================================================= */

function App() {

  const [user, setUser] =
    useState(null);

  /* ======================
     🔐 ANON LOGIN
  ====================== */

  useEffect(() => {

    anonymousLogin();

  }, []);

  /* ======================
     👤 AUTH
  ====================== */

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (
          currentUser
        ) => {

          console.log(
            "🔥 AUTH USER:",
            currentUser
          );

          setUser(
            currentUser
          );

          if (
            currentUser
          ) {

            try {

              await createUserProfile(
                currentUser
              );

              console.log(
                "✅ profile kész"
              );

            } catch (
              err
            ) {

              console.error(
                "❌ profile hiba:",
                err
              );

            }

          }

        }
      );

    return () =>
      unsubscribe();

  }, []);

  /* ======================
     🛣️ ROUTES
  ====================== */

  return (
    <Routes>

      <Route
        path="/"
        element={
          <LandingPage
            user={user}
          />
        }
      />

      <Route
        path="/dashboard"
        element={
          <FitnessDashboard
            user={user}
          />
        }
      />

      <Route
        path="/badges"
        element={
          <BadgeScreen />
        }
      />

    </Routes>
  );
}

export default App;