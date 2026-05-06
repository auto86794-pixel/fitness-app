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
}) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,0.03)",
        border:
          "1px solid rgba(255,255,255,0.08)",
        borderRadius: 32,
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
          "linear-gradient(180deg,#020617 0%,#07111f 40%,#08121e 100%)",
        color: "white",
        padding:
          isMobile ? 16 : 28,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          maxWidth: 1350,
          margin: "0 auto",
        }}
      >

        {/* TOPBAR */}

        <GlassCard
          style={{
            padding:
              "18px 24px",
            marginBottom: 34,
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
                gap: 28,
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
                Kezdőknek
              </span>
            </div>
          )}

        </GlassCard>

        {/* HERO */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              isMobile
                ? "1fr"
                : "1.1fr 0.9fr",
            gap: 24,
          }}
        >

          {/* LEFT SIDE */}

          <GlassCard
            style={{
              padding:
                isMobile
                  ? 28
                  : 42,
              position: "relative",
              overflow: "hidden",
            }}
          >

            {/* GLOW */}

            <div
              style={{
                position: "absolute",
                width: 320,
                height: 320,
                borderRadius: "50%",
                background:
                  "rgba(34,197,94,0.12)",
                filter:
                  "blur(90px)",
                top: -100,
                left: -100,
              }}
            />

            {/* BADGE */}

            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                padding:
                  "10px 18px",
                borderRadius: 999,
                background:
                  "rgba(34,197,94,0.12)",
                border:
                  "1px solid rgba(34,197,94,0.2)",
                color: "#bbf7d0",
                fontWeight: 700,
                marginBottom: 30,
                position: "relative",
                zIndex: 2,
              }}
            >
              🏠 Otthoni edzés ·
              kezdőknek · fogyáshoz
            </div>

            {/* TITLE */}

            <h1
              style={{
                fontSize:
                  isMobile
                    ? 54
                    : 92,
                lineHeight: 0.95,
                letterSpacing:
                  "-4px",
                fontWeight: 900,
                marginBottom: 28,
                maxWidth: 760,
                position: "relative",
                zIndex: 2,
              }}
            >
              Személyre
              szabott
              <br />
              otthoni
              <br />
              edzésterv
            </h1>

            {/* TEXT */}

            <p
              style={{
                fontSize: 21,
                lineHeight: 1.8,
                color: "#94a3b8",
                maxWidth: 720,
                marginBottom: 34,
                position: "relative",
                zIndex: 2,
              }}
            >
              Add meg az
              alapadataid,
              és kapsz egy
              egyszerű,
              követhető heti
              tervet,
              amit valóban
              végig tudsz
              csinálni otthon.
            </p>

            {/* BUTTONS */}

            <div
              style={{
                display: "flex",
                gap: 16,
                flexWrap: "wrap",
                marginBottom: 36,
                position: "relative",
                zIndex: 2,
              }}
            >

              <button
                onClick={
                  openDashboard
                }
                style={{
                  padding:
                    "18px 28px",
                  borderRadius: 20,
                  border: "none",
                  background:
                    "linear-gradient(135deg,#22c55e,#14b8a6)",
                  color: "white",
                  fontWeight: 800,
                  fontSize: 18,
                  cursor: "pointer",
                  boxShadow:
                    "0 0 40px rgba(34,197,94,0.25)",
                }}
              >
                🔥 Edzésterv
                készítése
              </button>

              <button
                style={{
                  padding:
                    "18px 28px",
                  borderRadius: 20,
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
                position: "relative",
                zIndex: 2,
              }}
            >

              {[
                [
                  "1 perc",
                  "ennyi idő a kitöltés"
                ],

                [
                  "15–30 perc",
                  "rövid edzésblokkok"
                ],

                [
                  "2–5 nap",
                  "rugalmas heti terv"
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
                      padding: 22,
                    }}
                  >

                    <div
                      style={{
                        fontSize: 34,
                        fontWeight: 900,
                        marginBottom: 8,
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

          {/* RIGHT SIDE */}

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
                marginBottom: 24,
              }}
            >

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
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
                    "rgba(34,197,94,0.12)",
                  color: "#bbf7d0",
                  fontWeight: 700,
                  fontSize: 13,
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
                    borderRadius: 28,
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
                      lineHeight: 2.2,
                      paddingLeft: 20,
                      fontSize: 17,
                    }}
                  >
                    {day.list.map(
                      (
                        item,
                        idx
                      ) => (
                        <li key={idx}>
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

      </div>
    </div>
  );
}

/* =======================================================
   🚀 APP
======================================================= */

function App() {

  const [user, setUser] =
    useState(null);

  /* ======================
     🔐 LOGIN
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

            } catch (err) {

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