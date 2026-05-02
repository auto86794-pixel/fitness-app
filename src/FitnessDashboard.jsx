import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

export default function FitnessDashboard() {

  // =========================
  // STATES
  // =========================

  const [xp, setXp] = useState(0);

  const [coins, setCoins] =
    useState(120);

  const [level, setLevel] =
    useState(1);

  const [streak, setStreak] =
    useState(1);

  const [water, setWater] =
    useState(0);

  const [calories, setCalories] =
    useState(0);

  const [activeTab, setActiveTab] =
    useState("home");

  const [todayWorkout, setTodayWorkout] =
    useState(null);

  const [workoutLoading, setWorkoutLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [badges, setBadges] =
    useState([]);

  // =========================
  // QUESTS
  // =========================

  const [quests, setQuests] =
    useState([
      {
        id: 1,
        title: "💧 Igyál 2L vizet",
        completed: false,
        reward: 20,
      },

      {
        id: 2,
        title:
          "🔥 Maradj 1800 kcal alatt",
        completed: false,
        reward: 25,
      },

      {
        id: 3,
        title:
          "🏆 Teljesítsd az edzést",
        completed: false,
        reward: 40,
      },
    ]);

  const xpPercent = xp % 100;

  const waterGoal = 2000;

  const calorieGoal = 1800;

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
  // LOAD STREAK
  // =========================

  useEffect(() => {

    const savedStreak =
      localStorage.getItem("streak");

    if (savedStreak) {
      setStreak(Number(savedStreak));
    }

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

      // DEMO MODE

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

      // USER MODE

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

      // CREATE WORKOUT

      const generated =
        generateWorkout();

      const {
        data: inserted,
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

      if (!inserted) {

        setTodayWorkout({
          ...generated,
          completed: false,
        });

        setWorkoutLoading(false);

        return;
      }

      setTodayWorkout(inserted);

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
  // BADGES
  // =========================

  useEffect(() => {

    const newBadges = [];

    if (xp >= 100) {
      newBadges.push(
        "⭐ XP Újonc"
      );
    }

    if (streak >= 3) {
      newBadges.push(
        "🔥 3 Napos Streak"
      );
    }

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
        "🥗 Kalória Mester"
      );
    }

    setBadges(newBadges);

  }, [
    xp,
    streak,
    water,
    calories,
  ]);

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

    setXp(
      (prev) => prev + gainedXp
    );

    setCoins(
      (prev) => prev + gainedCoins
    );

    // STREAK

    const lastWorkout =
      localStorage.getItem(
        "lastWorkoutDate"
      );

    const today =
      new Date().toDateString();

    if (lastWorkout !== today) {

      const newStreak =
        streak + 1;

      setStreak(newStreak);

      localStorage.setItem(
        "streak",
        String(newStreak)
      );

      localStorage.setItem(
        "lastWorkoutDate",
        today
      );
    }

    // QUEST COMPLETE

    setQuests((prev) =>
      prev.map((quest) =>
        quest.id === 3
          ? {
              ...quest,
              completed: true,
            }
          : quest
      )
    );

    setTodayWorkout({
      ...todayWorkout,
      completed: true,
    });

    setMessage(
      `🏆 +${gainedXp} XP és +${gainedCoins} coin`
    );

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
  // COMPLETE QUEST
  // =========================

  const completeQuest = (id) => {

    const updated =
      quests.map((quest) => {

        if (
          quest.id === id &&
          !quest.completed
        ) {

          setXp(
            (prev) =>
              prev + quest.reward
          );

          setCoins(
            (prev) =>
              prev + 10
          );

          setMessage(
            `✨ Quest teljesítve! +${quest.reward} XP`
          );

          return {
            ...quest,
            completed: true,
          };
        }

        return quest;
      });

    setQuests(updated);
  };

  // =========================
  // UI
  // =========================

  return (

    <div style={pageStyle}>

      <div style={phoneFrame}>

        {/* NAVIGATION */}

        <div style={navBar}>

          <button
            style={
              activeTab === "home"
                ? activeNavBtn
                : navBtn
            }
            onClick={() =>
              setActiveTab("home")
            }
          >
            🏠
          </button>

          <button
            style={
              activeTab === "tracker"
                ? activeNavBtn
                : navBtn
            }
            onClick={() =>
              setActiveTab("tracker")
            }
          >
            📊
          </button>

          <button
            style={
              activeTab === "badges"
                ? activeNavBtn
                : navBtn
            }
            onClick={() =>
              setActiveTab("badges")
            }
          >
            🏆
          </button>

          <button
            style={
              activeTab === "profile"
                ? activeNavBtn
                : navBtn
            }
            onClick={() =>
              setActiveTab("profile")
            }
          >
            👤
          </button>

        </div>

        {/* HOME */}

        {activeTab === "home" && (
          <>

            <h1 style={title}>
              🔥 Homefit
            </h1>

            {/* HERO */}

            <div style={heroCard}>

              <div>

                <div style={muted}>
                  🔥 Aktív streak
                </div>

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 14,
                    color: "#facc15",
                    fontWeight: "bold",
                  }}
                >
                  🔥 {streak} napos streak
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
                    {xpPercent}/100
                  </div>

                </div>

              </div>

              <div style={avatar}>
                🧘
              </div>

            </div>

            {/* XP BAR */}

            <div style={xpCard}>

              <div style={spaceBetween}>

                <span>
                  XP Haladás
                </span>

                <span>
                  {xpPercent}/100
                </span>

              </div>

              <div style={barBg}>

                <div
                  style={{
                    ...barFill,
                    width: `${xpPercent}%`,
                  }}
                />

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

                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginTop: 18,
                      marginBottom: 18,
                    }}
                  >

                    <span>
                      ⭐{" "}
                      {
                        todayWorkout.xp_reward
                      }{" "}
                      XP
                    </span>

                    <span>
                      🪙{" "}
                      {
                        todayWorkout.coin_reward
                      }
                    </span>

                  </div>

                  <button
                    onClick={
                      completeWorkout
                    }
                    disabled={
                      todayWorkout.completed
                    }
                    style={{
                      marginTop: 10,
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

            {/* DAILY QUESTS */}

            <div style={{ marginTop: 24 }}>

              <h2>
                ⚡ Napi küldetések
              </h2>

              <div style={questGrid}>

                {quests.map((quest) => (

                  <div
                    key={quest.id}
                    style={{
                      ...questCard,

                      border:
                        quest.completed
                          ? "1px solid rgba(34,197,94,0.4)"
                          : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >

                    <div>

                      <div
                        style={{
                          fontWeight: "bold",
                          marginBottom: 8,
                        }}
                      >
                        {quest.title}
                      </div>

                      <div
                        style={{
                          opacity: 0.7,
                          fontSize: 13,
                        }}
                      >
                        ⭐ {quest.reward} XP
                      </div>

                    </div>

                    <button
                      onClick={() =>
                        completeQuest(
                          quest.id
                        )
                      }
                      disabled={
                        quest.completed
                      }
                      style={{
                        ...questBtn,

                        background:
                          quest.completed
                            ? "#166534"
                            : "linear-gradient(135deg,#22c55e,#14b8a6)",
                      }}
                    >
                      {quest.completed
                        ? "✅"
                        : "GO"}
                    </button>

                  </div>
                ))}

              </div>

            </div>

          </>
        )}

        {/* TRACKER */}

        {activeTab === "tracker" && (

          <div style={{ marginTop: 20 }}>

            <h2>
              📊 Trackerek
            </h2>

            <div style={trackerGrid}>

              {/* WATER */}

              <div style={trackerCard}>

                <div style={trackerTitle}>
                  💧 Víz
                </div>

                <div style={trackerValue}>
                  {water} ml
                </div>

                <button
                  style={smallBtn}
                  onClick={() =>
                    setWater(
                      water + 250
                    )
                  }
                >
                  +250 ml
                </button>

              </div>

              {/* CALORIES */}

              <div style={trackerCard}>

                <div style={trackerTitle}>
                  🔥 Kalória
                </div>

                <div style={trackerValue}>
                  {calories}
                </div>

                <button
                  style={smallBtn}
                  onClick={() =>
                    setCalories(
                      calories + 200
                    )
                  }
                >
                  +200 kcal
                </button>

              </div>

            </div>

          </div>
        )}

        {/* BADGES */}

        {activeTab === "badges" && (

          <div style={{ marginTop: 20 }}>

            <h2>
              🏆 Jelvények
            </h2>

            <div style={badgeGrid}>

              {badges.map(
                (badgeItem, i) => (

                  <div
                    key={i}
                    style={badgeStyle}
                  >
                    {badgeItem}
                  </div>

                )
              )}

            </div>

          </div>
        )}

        {/* PROFILE */}

        {activeTab === "profile" && (

          <div style={{ marginTop: 20 }}>

            <h2>
              👤 Profil
            </h2>

            <div style={card}>

              <div style={exerciseItem}>
                ⭐ XP: {xp}
              </div>

              <div style={exerciseItem}>
                🪙 Coin: {coins}
              </div>

              <div style={exerciseItem}>
                🔥 Streak: {streak}
              </div>

              <div style={exerciseItem}>
                💧 Víz: {water}
              </div>

              <div style={exerciseItem}>
                🔥 Kalória: {calories}
              </div>

            </div>

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
    "radial-gradient(circle at top left, #07111f, #000)",

  display: "flex",

  justifyContent: "center",

  alignItems: "center",

  padding: 20,
};

const phoneFrame = {
  width: "100%",

  maxWidth: 390,

  padding: 20,

  borderRadius: 30,

  background:
    "rgba(255,255,255,0.05)",

  color: "white",

  backdropFilter:
    "blur(18px)",
};

const navBar = {
  display: "flex",

  justifyContent:
    "space-around",

  marginBottom: 20,

  background:
    "rgba(255,255,255,0.05)",

  padding: 12,

  borderRadius: 20,
};

const navBtn = {
  background: "transparent",

  border: "none",

  color:
    "rgba(255,255,255,0.5)",

  fontSize: 24,

  cursor: "pointer",
};

const activeNavBtn = {
  background:
    "linear-gradient(135deg,#22c55e,#14b8a6)",

  border: "none",

  borderRadius: 14,

  color: "white",

  padding: "10px 14px",

  fontSize: 24,

  cursor: "pointer",
};

const title = {
  fontSize: 28,

  margin: 0,
};

const heroCard = {
  marginTop: 10,

  padding: 20,

  borderRadius: 20,

  background:
    "linear-gradient(135deg,#22c55e22,#14b8a622)",

  display: "flex",

  justifyContent:
    "space-between",
};

const bigNumber = {
  fontSize: 30,

  fontWeight: "bold",
};

const xpText = {
  fontSize: 18,
};

const muted = {
  opacity: 0.6,
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

const xpCard = {
  marginTop: 20,

  padding: 18,

  borderRadius: 20,

  background:
    "rgba(255,255,255,0.05)",
};

const spaceBetween = {
  display: "flex",

  justifyContent:
    "space-between",

  marginBottom: 10,
};

const barBg = {
  width: "100%",

  height: 12,

  borderRadius: 999,

  background: "#1e293b",

  overflow: "hidden",
};

const barFill = {
  height: 12,

  borderRadius: 999,

  background:
    "linear-gradient(90deg,#22c55e,#14b8a6)",

  transition:
    "all 0.4s ease",
};

const card = {
  marginTop: 10,

  padding: 18,

  borderRadius: 20,

  background:
    "rgba(255,255,255,0.05)",
};

const exerciseItem = {
  padding: "8px 0",

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
};

const trackerGrid = {
  display: "grid",

  gridTemplateColumns:
    "1fr 1fr",

  gap: 14,

  marginTop: 14,
};

const trackerCard = {
  padding: 16,

  borderRadius: 20,

  background:
    "rgba(255,255,255,0.05)",
};

const trackerTitle = {
  opacity: 0.7,

  marginBottom: 10,
};

const trackerValue = {
  fontSize: 24,

  fontWeight: "bold",

  marginBottom: 14,
};

const smallBtn = {
  width: "100%",

  padding: 10,

  borderRadius: 14,

  border: "none",

  background:
    "linear-gradient(135deg,#22c55e,#14b8a6)",

  color: "white",

  fontWeight: "bold",

  cursor: "pointer",
};

const badgeGrid = {
  display: "flex",

  flexWrap: "wrap",

  gap: 10,

  marginTop: 14,
};

const badgeStyle = {
  padding: "10px 14px",

  borderRadius: 999,

  background:
    "rgba(34,197,94,0.12)",

  color: "#bbf7d0",

  fontSize: 13,
};

const questGrid = {
  display: "grid",

  gap: 14,

  marginTop: 14,
};

const questCard = {
  padding: 18,

  borderRadius: 22,

  background:
    "rgba(255,255,255,0.05)",

  display: "flex",

  justifyContent:
    "space-between",

  alignItems: "center",
};

const questBtn = {
  border: "none",

  color: "white",

  width: 54,

  height: 54,

  borderRadius: 16,

  fontWeight: "bold",

  cursor: "pointer",
};