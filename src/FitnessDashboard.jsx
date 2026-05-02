import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

export default function FitnessDashboard() {

  const [xp, setXp] = useState(0);

  const [coins, setCoins] =
    useState(120);

  const [level, setLevel] =
    useState(1);

  const [todayWorkout, setTodayWorkout] =
    useState(null);

  const [workoutLoading, setWorkoutLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const xpPercent = xp % 100;

  // =========================
  // GENERATE WORKOUT
  // =========================

  const generateWorkout = () => {
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
  };

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

        const generated =
          generateWorkout();

        setTodayWorkout({
          ...generated,
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

      // EXISTING WORKOUT

      if (data) {

        setTodayWorkout(data);

        setWorkoutLoading(false);

        return;
      }

      // CREATE NEW WORKOUT

      const generated =
        generateWorkout();

      const {
        data: insertedWorkout,
      } =
        await supabase
          .from("workouts")
          .insert({
            user_id: user.id,

            title: generated.title,

            exercises:
              generated.exercises,

            xp_reward:
              generated.xp_reward,

            coin_reward:
              generated.coin_reward,

            workout_date: today,
          })
          .select()
          .single();

      setTodayWorkout(insertedWorkout);

      setWorkoutLoading(false);
    };

    loadWorkout();

  }, []);

  // =========================
  // LEVEL
  // =========================

  useEffect(() => {

    setLevel(
      Math.floor(xp / 100) + 1
    );

  }, [xp]);

  // =========================
  // COMPLETE WORKOUT
  // =========================

  const completeWorkout = async () => {

    if (
      !todayWorkout ||
      todayWorkout.completed
    ) {
      return;
    }

    const gainedXp =
      todayWorkout.xp_reward || 40;

    const gainedCoins =
      todayWorkout.coin_reward || 20;

    // UPDATE UI

    setXp((prev) =>
      prev + gainedXp
    );

    setCoins((prev) =>
      prev + gainedCoins
    );

    setTodayWorkout({
      ...todayWorkout,
      completed: true,
    });

    setMessage(
      `🏆 +${gainedXp} XP és +${gainedCoins} coin`
    );

    // SAVE TO DATABASE

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (user) {

      await supabase
        .from("workouts")
        .update({
          completed: true,
        })
        .eq("id", todayWorkout.id);
    }
  };

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

        <div style={heroCard}>

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
                🪙 {coins} coin
              </div>

              {/* XP BAR */}

              <div
                style={{
                  marginTop: 14,
                }}
              >

                <div
                  style={{
                    display: "flex",

                    justifyContent:
                      "space-between",

                    marginBottom: 8,

                    fontSize: 13,

                    opacity: 0.8,
                  }}
                >
                  <span>
                    XP haladás
                  </span>

                  <span>
                    {xpPercent}/100
                  </span>
                </div>

                <div
                  style={{
                    width: "100%",

                    height: 12,

                    borderRadius: 999,

                    background:
                      "rgba(255,255,255,0.08)",

                    overflow: "hidden",
                  }}
                >

                  <div
                    style={{
                      width: `${xpPercent}%`,

                      height: "100%",

                      borderRadius: 999,

                      background:
                        "linear-gradient(90deg,#22c55e,#14b8a6)",

                      transition:
                        "all 0.5s ease",

                      boxShadow:
                        "0 0 20px rgba(34,197,94,0.5)",
                    }}
                  />

                </div>

              </div>

            </div>

          </div>

          <div style={avatar}>
            🧘
          </div>

        </div>

        {/* WORKOUT */}

        <div
          style={{
            marginTop: 24,
          }}
        >

          <h2>
            🔥 Mai edzés
          </h2>

          {workoutLoading ? (

            <div style={card}>
              Betöltés...
            </div>

          ) : todayWorkout ? (

            <div style={card}>

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

              {/* BUTTON */}

              <button
                onClick={
                  completeWorkout
                }
                disabled={
                  todayWorkout.completed
                }
                style={{
                  marginTop: 18,

                  width: "100%",

                  padding: 14,

                  borderRadius: 16,

                  border: "none",

                  cursor: "pointer",

                  fontWeight: "bold",

                  color: "white",

                  background:
                    todayWorkout.completed
                      ? "#334155"
                      : "linear-gradient(135deg,#22c55e,#14b8a6)",
                }}
              >
                {todayWorkout.completed
                  ? "✅ Teljesítve"
                  : "🏆 Edzés kész"}
              </button>

            </div>

          ) : null}

          {/* MESSAGE */}

          {message && (

            <div style={messageBox}>
              {message}
            </div>

          )}

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
    "radial-gradient(circle at top left, #07111f, #000)",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  padding: 20,

  fontFamily:
    "Inter, sans-serif",
};

const phoneFrame = {
  width: "100%",

  maxWidth: 390,

  padding: 20,

  borderRadius: 30,

  background:
    "rgba(255,255,255,0.05)",

  backdropFilter:
    "blur(16px)",

  color: "white",

  boxShadow:
    "0 0 50px rgba(0,0,0,0.4)",
};

const title = {
  fontSize: 28,

  margin: 0,
};

const heroCard = {
  marginTop: 10,

  padding: 20,

  borderRadius: 24,

  background:
    "linear-gradient(135deg,#22c55e22,#14b8a622)",

  display: "flex",

  justifyContent:
    "space-between",

  alignItems: "center",
};

const bigNumber = {
  fontSize: 32,

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

const card = {
  marginTop: 12,

  padding: 18,

  borderRadius: 22,

  background:
    "rgba(255,255,255,0.05)",

  border:
    "1px solid rgba(255,255,255,0.06)",
};

const exerciseItem = {
  padding: "10px 0",

  borderBottom:
    "1px solid rgba(255,255,255,0.05)",
};

const messageBox = {
  marginTop: 14,

  padding: 12,

  borderRadius: 14,

  background:
    "rgba(34,197,94,0.12)",

  color: "#bbf7d0",

  fontWeight: "bold",
};