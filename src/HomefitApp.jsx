```jsx
import { useEffect, useState } from "react";

// FIREBASE
import {
  subscribeToProfile,
  updateProfile,
} from "./profileService";

export default function HomefitApp({
  user,
}) {

  // =========================
  // PROFILE STATES
  // =========================

  const [gender, setGender] =
    useState("Férfi");

  const [age, setAge] =
    useState(16);

  const [weight, setWeight] =
    useState(110);

  const [height, setHeight] =
    useState(192);

  const [goal, setGoal] =
    useState("Fogyás");

  const [
    fitnessLevel,
    setFitnessLevel,
  ] = useState(
    "Teljesen kezdő"
  );

  const [
    weeklyDays,
    setWeeklyDays,
  ] = useState(3);

  const [
    workoutMinutes,
    setWorkoutMinutes,
  ] = useState(20);

  const [
    profileCompleted,
    setProfileCompleted,
  ] = useState(false);

  // =========================
  // DASHBOARD STATES
  // =========================

  const [water, setWater] =
    useState(0);

  const [calories, setCalories] =
    useState(0);

  const [xp, setXp] =
    useState(0);

  const [level, setLevel] =
    useState(1);

  const [coins, setCoins] =
    useState(120);

  const [energy, setEnergy] =
    useState(80);

  const [message, setMessage] =
    useState("");

  const [badges, setBadges] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // WORKOUT
  // =========================

  const [
    todayWorkout,
    setTodayWorkout,
  ] = useState(null);

  const [
    workoutLoading,
    setWorkoutLoading,
  ] = useState(false);

  // =========================
  // GOALS
  // =========================

  const waterGoal = 2000;

  const calorieGoal = 1800;

  // =========================
  // XP
  // =========================

  const xpPercent = xp % 100;

  // =========================
  // GENERATE WORKOUT
  // =========================

  const generateWorkout = () => {

    if (goal === "Fogyás") {

      return {
        title:
          "🔥 Fogyás Edzés",

        exercises: [
          "20 perc séta",
          "3x15 guggolás",
          "3x20 jumping jack",
          "2x30 mp plank",
        ],

        xp_reward: 40,

        coin_reward: 20,
      };
    }

    if (goal === "Izomépítés") {

      return {
        title:
          "💪 Izomépítő Edzés",

        exercises: [
          "3x10 fekvőtámasz",
          "3x15 guggolás",
          "3x12 kitörés",
          "3x20 mp plank",
        ],

        xp_reward: 50,

        coin_reward: 25,
      };
    }

    return {
      title:
        "🌿 Wellness Edzés",

      exercises: [
        "15 perc séta",
        "jóga nyújtás",
        "2x15 guggolás",
        "légzőgyakorlat",
      ],

      xp_reward: 30,

      coin_reward: 15,
    };
  };

  // =========================
  // REALTIME FIREBASE PROFILE
  // =========================

  useEffect(() => {

    if (!user) {

      setLoading(false);

      return;
    }

    const unsubscribe =
      subscribeToProfile(
        user.uid,
        (profileData) => {

          if (!profileData) {
            return;
          }

          console.log(
            "🔥 REALTIME PROFILE:",
            profileData
          );

          setGender(
            profileData.gender ||
              "Férfi"
          );

          setAge(
            profileData.age || 16
          );

          setWeight(
            profileData.weight || 70
          );

          setHeight(
            profileData.height || 170
          );

          setGoal(
            profileData.goal ||
              "Fogyás"
          );

          setFitnessLevel(
            profileData.fitnessLevel ||
              "Teljesen kezdő"
          );

          setWeeklyDays(
            profileData.weeklyDays ||
              3
          );

          setWorkoutMinutes(
            profileData.workoutMinutes ||
              20
          );

          setXp(
            profileData.xp || 0
          );

          setCoins(
            profileData.coins ||
              120
          );

          setWater(
            profileData.water || 0
          );

          setCalories(
            profileData.calories ||
              0
          );

          setProfileCompleted(
            true
          );

          setLoading(false);
        }
      );

    return () =>
      unsubscribe();

  }, [user]);

  // =========================
  // LOAD WORKOUT
  // =========================

  useEffect(() => {

    if (!profileCompleted)
      return;

    setWorkoutLoading(true);

    const generatedWorkout =
      generateWorkout();

    setTodayWorkout(
      generatedWorkout
    );

    setWorkoutLoading(false);

  }, [profileCompleted]);

  // =========================
  // LEVEL
  // =========================

  useEffect(() => {

    setLevel(
      Math.floor(xp / 100) + 1
    );

  }, [xp]);

  // =========================
  // BADGES
  // =========================

  useEffect(() => {

    const newBadges = [];

    if (water >= waterGoal) {

      newBadges.push(
        "💧 Hidratálás Hőse"
      );
    }

    if (
      calories > 0 &&
      calories <= calorieGoal
    ) {

      newBadges.push(
        "🔥 Egyensúly Mester"
      );
    }

    if (xp >= 100) {

      newBadges.push(
        "⭐ XP Újonc"
      );
    }

    if (xp >= 250) {

      newBadges.push(
        "🌿 Wellness Harcos"
      );
    }

    if (coins >= 200) {

      newBadges.push(
        "🪙 Coin Gyűjtő"
      );
    }

    setBadges(newBadges);

  }, [
    water,
    calories,
    xp,
    coins,
  ]);

  // =========================
  // COMPLETE WORKOUT
  // =========================

  ;

      // FIRESTORE UPDATE

      await updateProfile(
        user.uid,
        {
          xp: newXP,
          coins: newCoins,
        }
      );
    };

  // =========================
  // WATER TRACKER
  // =========================

  const addWater =
    async () => {

      if (!user) {
        return;
      }

      const newWater =
        water + 250;

      setWater(newWater);

      await updateProfile(
        user.uid,
        {
          water: newWater,
        }
      );
    };

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div style={loadingStyle}>
        <h1>
          ⏳ Betöltés...
        </h1>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div style={pageStyle}>

      <div style={phoneFrame}>

        <h1 style={title}>
          🔥 Homefit
        </h1>

        {/* HERO */}

        <div style={heroCardNew}>

          <div>

            <div style={muted}>
              🔥 Aktív streak
            </div>

            <div style={bigNumber}>
              {level}. szint
            </div>

            <div
              style={{
                marginTop: 12,
              }}
            >

              <div style={xpText}>
                ⭐ {xp} XP
              </div>

              <div style={muted}>
                🪙 {coins} coin • ⚡{" "}
                {energy}/100
              </div>

            </div>

          </div>

          <div style={avatar}>
            🧘
          </div>

        </div>

        {/* WORKOUT */}

        <div style={section}>

          <h2 style={sectionTitle}>
            🔥 Mai edzés
          </h2>

          {workoutLoading ? (

            <div style={workoutCardNew}>
              Betöltés...
            </div>

          ) : todayWorkout ? (

            <div style={workoutCardNew}>

              <h3>
                {todayWorkout.title}
              </h3>

              <div
                style={{
                  marginTop: 14,
                }}
              >

                {todayWorkout.exercises.map(
                  (exercise, i) => (

                    <div
                      key={i}
                      style={exerciseItem}
                    >
                      ✅ {exercise}
                    </div>

                  )
                )}

              </div>

              <button
                onClick={
                  completeWorkout
                }
                style={actionBtn}
              >
                🏆 Edzés kész
              </button>

            </div>

          ) : null}

        </div>

        {/* WATER */}

        <div style={section}>

          <h2 style={sectionTitle}>
            💧 Víz tracker
          </h2>

          <div style={workoutCardNew}>

            <div
              style={{
                marginBottom: 12,
              }}
            >
              {water} / {waterGoal} ml
            </div>

            <button
              onClick={addWater}
              style={actionBtn}
            >
              +250 ml
            </button>

          </div>

        </div>

        {/* MESSAGE */}

        {message && (

          <div style={messageBox}>
            {message}
          </div>

        )}

      </div>

    </div>
  );
}

// =========================
// STYLES
// =========================

const pageStyle = {
  minHeight: "100vh",

  background:
    "radial-gradient(circle at top left, #07111f, #020617 40%, #000000)",

  display: "flex",

  justifyContent:
    "center",

  alignItems: "center",

  padding: 20,

  fontFamily:
    "Inter, sans-serif",
};

const loadingStyle = {
  minHeight: "100vh",

  display: "flex",

  justifyContent:
    "center",

  alignItems: "center",

  background: "#020617",

  color: "white",
};

const phoneFrame = {
  width: "100%",

  maxWidth: 390,

  background:
    "rgba(255,255,255,0.06)",

  borderRadius: 34,

  padding: 20,

  backdropFilter:
    "blur(18px)",

  color: "white",

  boxShadow:
    "0 0 50px rgba(0,0,0,0.4)",
};

const title = {
  margin: 0,

  fontSize: 28,
};

const heroCardNew = {
  background:
    "linear-gradient(135deg, rgba(34,197,94,0.14), rgba(20,184,166,0.10))",

  borderRadius: 26,

  padding: 22,

  display: "flex",

  justifyContent:
    "space-between",

  alignItems: "center",

  marginTop: 10,
};

const bigNumber = {
  fontSize: 34,

  fontWeight: "bold",
};

const xpText = {
  fontSize: 18,

  fontWeight: 600,
};

const muted = {
  opacity: 0.65,

  fontSize: 13,
};

const avatar = {
  width: 72,

  height: 72,

  borderRadius: "50%",

  background:
    "linear-gradient(135deg,#22c55e,#06b6d4)",

  display: "flex",

  alignItems: "center",

  justifyContent: "center",

  fontSize: 32,
};

const section = {
  marginTop: 22,
};

const sectionTitle = {
  marginBottom: 12,
};

const workoutCardNew = {
  background:
    "rgba(255,255,255,0.05)",

  padding: 18,

  borderRadius: 22,
};

const exerciseItem = {
  padding: "8px 0",

  borderBottom:
    "1px solid rgba(255,255,255,0.05)",
};

const actionBtn = {
  marginTop: 18,

  width: "100%",

  padding: 14,

  borderRadius: 16,

  border: "none",

  cursor: "pointer",

  fontWeight: "bold",

  color: "white",

  background:
    "linear-gradient(135deg,#22c55e,#14b8a6)",
};

const messageBox = {
  marginTop: 18,

  padding: 14,

  borderRadius: 18,

  background:
    "rgba(34,197,94,0.12)",

  color: "#bbf7d0",
};
```
