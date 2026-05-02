import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

export default function HomefitApp() {

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

  const [fitnessLevel, setFitnessLevel] =
    useState("Teljesen kezdő");

  const [weeklyDays, setWeeklyDays] =
    useState(3);

  const [workoutMinutes, setWorkoutMinutes] =
    useState(20);

  const [profileCompleted, setProfileCompleted] =
    useState(false);

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

  const [mood, setMood] =
    useState("😌 Nyugodt");

  const [message, setMessage] =
    useState("");

  const [badges, setBadges] =
    useState([]);

  const [dailyClaimed, setDailyClaimed] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("home");

  const [loading, setLoading] =
    useState(true);

  // =========================
  // WORKOUT
  // =========================

  const [todayWorkout, setTodayWorkout] =
    useState(null);

  const [workoutLoading, setWorkoutLoading] =
    useState(false);

  // =========================
  // GOALS
  // =========================

  const waterGoal = 2000;

  const calorieGoal = 1800;

  // =========================
  // BMI
  // =========================

  const bmi = (
    weight /
    ((height / 100) *
      (height / 100))
  ).toFixed(1);

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
        title: "🔥 Fogyás Edzés",

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
        title: "💪 Izomépítő Edzés",

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
      title: "🌿 Wellness Edzés",

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
  // LOAD PROFILE
  // =========================

  useEffect(() => {

    const loadProfile = async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

      if (profileData) {

        setGender(
          profileData.gender || "Férfi"
        );

        setAge(profileData.age || 16);

        setWeight(
          profileData.weight || 70
        );

        setHeight(
          profileData.height || 170
        );

        setGoal(
          profileData.goal || "Fogyás"
        );

        setFitnessLevel(
          profileData.level ||
            "Teljesen kezdő"
        );

        setWeeklyDays(
          profileData.weekly_days || 3
        );

        setWorkoutMinutes(
          profileData.workout_minutes || 20
        );

        setProfileCompleted(true);
      }

      setLoading(false);
    };

    loadProfile();

  }, []);

  // =========================
  // LOAD WORKOUT
  // =========================

  useEffect(() => {

    const loadWorkout = async () => {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setWorkoutLoading(true);

      // =========================
      // DEMO MODE
      // =========================

      if (!user) {

        const generatedWorkout =
          generateWorkout();

        setTodayWorkout({
          ...generatedWorkout,
          completed: false,
        });

        setWorkoutLoading(false);

        return;
      }

      // =========================
      // NORMAL USER MODE
      // =========================

      const today = new Date()
        .toISOString()
        .split("T")[0];

      const { data } =
        await supabase
          .from("workouts")
          .select("*")
          .eq("user_id", user.id)
          .eq("workout_date", today)
          .single();

      // =========================
      // EXISTING WORKOUT
      // =========================

      if (data) {

        setTodayWorkout(data);

        setWorkoutLoading(false);

        return;
      }

      // =========================
      // GENERATE NEW WORKOUT
      // =========================

      const generatedWorkout =
        generateWorkout();

      const {
        data: insertedWorkout,
        error,
      } =
        await supabase
          .from("workouts")
          .insert({
            user_id: user.id,

            title:
              generatedWorkout.title,

            exercises:
              generatedWorkout.exercises,

            xp_reward:
              generatedWorkout.xp_reward,

            coin_reward:
              generatedWorkout.coin_reward,

            workout_date: today,
          })
          .select()
          .single();

      console.log(error);

      // =========================
      // FALLBACK
      // =========================

      if (!insertedWorkout) {

        setTodayWorkout({
          ...generatedWorkout,
          completed: false,
        });

        setWorkoutLoading(false);

        return;
      }

      setTodayWorkout(insertedWorkout);

      setWorkoutLoading(false);
    };

    if (profileCompleted) {
      loadWorkout();
    }

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

  }, [water, calories, xp, coins]);

  // =========================
  // LOADING
  // =========================

  if (loading) {

    return (
      <div style={loadingStyle}>
        <h1>⏳ Betöltés...</h1>
      </div>
    );
  }

  // =========================
  // APP
  // =========================

  return (
    <div style={pageStyle}>

      <div style={phoneFrame}>

        <h1 style={title}>
          🔥 Homefit
        </h1>

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
                🪙 {coins} coin · ⚡ {energy}/100
              </div>
            </div>

          </div>

          <div style={avatar}>
            🧘
          </div>

        </div>

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

            </div>

          ) : null}

        </div>

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

  justifyContent: "center",

  alignItems: "center",

  padding: 20,

  fontFamily: "Inter, sans-serif",
};

const loadingStyle = {
  minHeight: "100vh",

  display: "flex",

  justifyContent: "center",

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

  backdropFilter: "blur(18px)",

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

  justifyContent: "space-between",

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