import { useEffect, useState } from "react";

import {
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

import FitnessDashboard from "./FitnessDashboard";

// FIREBASE AUTH
import {
  onAuthStateChanged,
} from "firebase/auth";

import { auth } from "./firebase";

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

function LandingPage({
  user,
}) {

  const navigate =
    useNavigate();

  const [width, setWidth] =
    useState(window.innerWidth);

  // =========================
  // QUESTIONNAIRE STATES
  // =========================

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

  const isMobile =
    width < 700;

  const isTablet =
    width < 900;

  // =========================
  // SAVE + OPEN DASHBOARD
  // =========================

  async function openDashboard() {

    if (user) {

      await saveQuestionnaire(
        user.uid,
        {
          gender,

          age:
            Number(age),

          weight:
            Number(weight),

          height:
            Number(height),

          goal,

          weeklyDays:
            Number(weeklyDays),

          workoutMinutes:
            Number(workoutMinutes),
        }
      );
    }

    navigate("/dashboard");
  }

  return (
    <div
      style={{
        minHeight: "100vh",

        background:
          "linear-gradient(180deg, #030712 0%, #07111f 38%, #08121e 100%)",

        color: "white",

        fontFamily:
          "Inter, system-ui, sans-serif",

        padding:
          isMobile ? 16 : 24,
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
            padding:
              isMobile ? 16 : 20,

            marginBottom: 40,
          }}
        >
          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              alignItems: "center",

              gap: 20,
            }}
          >
            <h2
              style={{
                margin: 0,

                fontSize:
                  isMobile
                    ? 24
                    : 30,
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

                    textDecoration:
                      "none",
                  }}
                >
                  Miért működik
                </a>

                <a
                  href="#terv"
                  style={{
                    color: "#cbd5e1",

                    textDecoration:
                      "none",
                  }}
                >
                  Edzésterv
                </a>

                <a
                  href="#teszt"
                  style={{
                    color: "#cbd5e1",

                    textDecoration:
                      "none",
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

            gridTemplateColumns:
              isTablet
                ? "1fr"
                : "1.1fr 0.9fr",

            gap: 30,

            marginBottom: 50,
          }}
        >

          {/* LEFT */}

          <GlassCard
            style={{
              padding:
                isMobile
                  ? 24
                  : 42,
            }}
          >
            <div
              style={{
                background:
                  "rgba(34,197,94,0.12)",

                padding:
                  "10px 16px",

                borderRadius: 999,

                display:
                  "inline-block",

                marginBottom: 20,

                color: "#bbf7d0",

                fontSize:
                  isMobile
                    ? 12
                    : 14,

                fontWeight: 600,
              }}
            >
              🏠 Otthoni edzés · kezdőknek · fogyáshoz
            </div>

            <h1
              style={{
                fontSize:
                  isMobile
                    ? 42
                    : 74,

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

                fontSize:
                  isMobile
                    ? 16
                    : 18,

                marginBottom: 32,

                maxWidth: 580,
              }}
            >
              Add meg az alapadataid,
              és kapsz egy egyszerű,
              követhető heti tervet,
              amit valóban végig tudsz
              csinálni otthon.
            </p>

            <button
              onClick={
                openDashboard
              }
              style={{
                padding:
                  "18px 30px",

                borderRadius: 18,

                border: "none",

                cursor: "pointer",

                fontWeight: "bold",

                fontSize: 16,

                color: "white",

                background:
                  "linear-gradient(135deg,#22c55e,#14b8a6)",

                boxShadow:
                  "0 10px 30px rgba(16,185,129,0.25)",
              }}
            >
              🔥 Edzésterv készítése
            </button>
          </GlassCard>

          {/* RIGHT */}

          <GlassCard
            style={{
              padding: 24,
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
                  color: "#94a3b8",
                }}
              >
                App előnézet
              </div>

              <div
                style={{
                  background:
                    "rgba(34,197,94,0.15)",

                  color: "#bbf7d0",

                  padding:
                    "8px 14px",

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
            ].map((day, i) => (

              <div
                key={i}
                style={{
                  background:
                    "rgba(255,255,255,0.03)",

                  border:
                    "1px solid rgba(255,255,255,0.06)",

                  borderRadius: 24,

                  padding: 22,

                  marginBottom: 18,
                }}
              >
                <h3
                  style={{
                    marginTop: 0,
                  }}
                >
                  {day.title}
                </h3>

                <ul
                  style={{
                    color: "#94a3b8",

                    lineHeight: 2,

                    paddingLeft: 20,
                  }}
                >
                  {day.list.map(
                    (item, idx) => (
                      <li key={idx}>
                        {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            ))}
          </GlassCard>
        </div>

        {/* QUESTIONNAIRE */}

        <GlassCard
  style={{
    padding:
      isMobile
        ? 24
        : 42,

    marginBottom: 50,
  }}
>
  <div
    style={{
      marginBottom: 34,
    }}
  >
    <h2
      style={{
        margin: 0,

        fontSize:
          isMobile
            ? 44
            : 62,

        lineHeight: 1,

        marginBottom: 18,
      }}
    >
      Kérdőív
    </h2>

    <p
      style={{
        color: "#94a3b8",

        lineHeight: 1.8,

        fontSize:
          isMobile
            ? 15
            : 18,

        maxWidth: 700,
      }}
    >
      Add meg az alapadataid,
      és elkészítjük a
      személyre szabott heti
      terved. Ez az MVP
      jelenleg szabályalapú
      logikával működik.
    </p>
  </div>

  <div
    style={{
      display: "grid",

      gridTemplateColumns:
        isMobile
          ? "1fr"
          : "1fr 1fr",

      gap: 22,
    }}
  >

    {/* GENDER */}

    <div>
      <div style={labelStyle}>
        Nem
      </div>

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

    {/* AGE */}

    <div>
      <div style={labelStyle}>
        Életkor
      </div>

      <input
        type="number"
        value={age}
        onChange={(e) =>
          setAge(
            e.target.value
          )
        }
        style={inputStyle}
      />
    </div>

    {/* WEIGHT */}

    <div>
      <div style={labelStyle}>
        Testsúly (kg)
      </div>

      <input
        type="number"
        value={weight}
        onChange={(e) =>
          setWeight(
            e.target.value
          )
        }
        style={inputStyle}
      />
    </div>

    {/* HEIGHT */}

    <div>
      <div style={labelStyle}>
        Magasság (cm)
      </div>

      <input
        type="number"
        value={height}
        onChange={(e) =>
          setHeight(
            e.target.value
          )
        }
        style={inputStyle}
      />
    </div>

    {/* GOAL */}

    <div>
      <div style={labelStyle}>
        Cél
      </div>

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
          Izomépítés
        </option>

        <option>
          Wellness
        </option>
      </select>
    </div>

    {/* DAYS */}

    <div>
      <div style={labelStyle}>
        Heti edzésnap
      </div>

      <input
        type="number"
        value={weeklyDays}
        onChange={(e) =>
          setWeeklyDays(
            e.target.value
          )
        }
        style={inputStyle}
      />
    </div>

    {/* MINUTES */}

    <div>
      <div style={labelStyle}>
        Edzésidő (perc)
      </div>

      <input
        type="number"
        value={
          workoutMinutes
        }
        onChange={(e) =>
          setWorkoutMinutes(
            e.target.value
          )
        }
        style={inputStyle}
      />
    </div>

  </div>

  {/* BUTTON */}

  <button
    onClick={
      openDashboard
    }
    style={{
      marginTop: 34,

      width: "100%",

      padding:
        "22px 24px",

      borderRadius: 22,

      border: "none",

      cursor: "pointer",

      fontWeight: "bold",

      fontSize: 20,

      color: "white",

      background:
        "linear-gradient(135deg,#22c55e,#14b8a6)",

      boxShadow:
        "0 15px 40px rgba(16,185,129,0.30)",
            }}
          >
            🔥 Edzésterv generálása
          </button>
        </GlassCard>

      </div>
    </div>
  );
}

function App() {

  const [user, setUser] =
    useState(null);

  // AUTO LOGIN

  useEffect(() => {

    anonymousLogin();

  }, []);

  // AUTH LISTENER

  useEffect(() => {

    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {

          setUser(currentUser);

          if (currentUser) {

            await createUserProfile(
              currentUser
            );

            console.log(
              "✅ Logged in:",
              currentUser.uid
            );

          } else {

            console.log(
              "❌ No user"
            );
          }
        }
      );

    return () =>
      unsubscribe();

  }, []);

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

    </Routes>
  );
}

const inputStyle = {
  width: "100%",

  padding: "18px 18px",

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
const labelStyle = {
  marginBottom: 10,
  color: "#cbd5e1",
  fontSize: 14,
  fontWeight: 600,
  };

export default App;