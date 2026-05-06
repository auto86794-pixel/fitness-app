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

  const [saving, setSaving] =
    useState(false);

  /* ======================
     📊 BMI
  ====================== */

  const bmi =
    weight /
    ((height / 100) *
      (height / 100));

  let bmiLabel = "";

  if (bmi < 18.5) {

    bmiLabel = "Sovány";

  } else if (bmi < 25) {

    bmiLabel = "Normál";

  } else if (bmi < 30) {

    bmiLabel = "Túlsúly";

  } else {

    bmiLabel = "Elhízás";
  }

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

    if (!user) {

      alert(
        "⏳ Betöltés folyamatban..."
      );

      return;
    }

    try {

      setSaving(true);

      console.log(
        "🔥 dashboard indítás"
      );

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

      navigate("/dashboard");

    } catch (err) {

      console.error(
        "❌ openDashboard hiba:",
        err
      );

      alert(
        "Hiba történt mentés közben"
      );

    } finally {

      setSaving(false);
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
        </GlassCard>

        {/* ======================
            HERO
        ====================== */}

        <GlassCard
          style={{
            padding:
              isMobile
                ? 24
                : 42,
            marginBottom: 30,
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

        </GlassCard>

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

            {/* NEM */}

            <div>
              <label>Nem</label>

              <select
                value={gender}
                onChange={(e) =>
                  setGender(
                    e.target.value
                  )
                }
                style={{
                  ...inputStyle,
                  color: "white",
                  background: "#0f172a",
                }}
              >
                <option value="Nő">
                  Nő
                </option>

                <option value="Férfi">
                  Férfi
                </option>
              </select>
            </div>

            {/* ÉLETKOR */}

            <div>
              <label>
                Életkor
              </label>

              <input
                type="number"
                value={age}
                onChange={(e) =>
                  setAge(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* TESTSÚLY */}

            <div>
              <label>
                Testsúly
              </label>

              <input
                type="number"
                value={weight}
                onChange={(e) =>
                  setWeight(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* MAGASSÁG */}

            <div>
              <label>
                Magasság
              </label>

              <input
                type="number"
                value={height}
                onChange={(e) =>
                  setHeight(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* CÉL */}

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

            {/* HETI NAPOK */}

            <div>
              <label>
                Heti napok
              </label>

              <input
                type="number"
                value={
                  weeklyDays
                }
                onChange={(e) =>
                  setWeeklyDays(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={inputStyle}
              />
            </div>

            {/* EDZÉSIDŐ */}

            <div>
              <label>
                Edzésidő
                (perc)
              </label>

              <input
                type="number"
                value={
                  workoutMinutes
                }
                onChange={(e) =>
                  setWorkoutMinutes(
                    Number(
                      e.target.value
                    )
                  )
                }
                style={inputStyle}
              />
            </div>

          </div>

          {/* BMI */}

          <div
            style={{
              marginTop: 24,
              padding: 24,
              borderRadius: 24,
              background:
                "rgba(255,255,255,0.03)",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >

            <div
              style={{
                fontSize: 18,
                color: "#94a3b8",
                marginBottom: 10,
              }}
            >
              BMI
            </div>

            <div
              style={{
                fontSize: 42,
                fontWeight: 900,
              }}
            >
              {bmi.toFixed(1)}
            </div>

            <div
              style={{
                fontSize: 18,
                color: "#94a3b8",
                marginTop: 8,
              }}
            >
              {bmiLabel}
            </div>

          </div>

          {/* BUTTON */}

          <button
            disabled={saving}
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
              opacity:
                saving ? 0.7 : 1,
              boxShadow:
                "0 10px 30px rgba(34,197,94,0.25)",
            }}
          >
            {
              saving
                ? "Mentés..."
                : "🔥 Edzésterv generálása"
            }
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