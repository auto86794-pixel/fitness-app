import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

export default function HomefitApp() {
  // =========================
  // PROFILE STATES
  // =========================

  const [gender, setGender] = useState("Férfi");
  const [age, setAge] = useState(16);

  const [weight, setWeight] = useState(110);
  const [height, setHeight] = useState(192);

  const [goal, setGoal] = useState("Fogyás");

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

  const [water, setWater] = useState(0);
  const [calories, setCalories] = useState(0);

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const [coins, setCoins] = useState(120);
  const [energy, setEnergy] = useState(80);

  const [mood, setMood] =
    useState("😌 Nyugodt");

  const [message, setMessage] = useState("");

  const [badges, setBadges] = useState([]);

  const [dailyClaimed, setDailyClaimed] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState("home");

  const [loading, setLoading] = useState(true);

  // =========================
  // WORKOUT STATES
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
    ((height / 100) * (height / 100))
  ).toFixed(1);

  // =========================
  // PROGRESS
  // =========================

  const waterPercent = Math.min(
    (water / waterGoal) * 100,
    100
  );

  const caloriePercent = Math.min(
    (calories / calorieGoal) * 100,
    100
  );

  const xpPercent = xp % 100;

  // =========================
  // WORKOUT GENERATOR
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
  // LOAD PROFILE + STATS
  // =========================

  useEffect(() => {
    const loadProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // PROFILE

      const { data: profileData } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

      if (profileData) {
        setGender(profileData.gender || "Férfi");

        setAge(profileData.age || 16);

        setWeight(profileData.weight || 70);

        setHeight(profileData.height || 170);

        setGoal(profileData.goal || "Fogyás");

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

      // STATS

      const { data: statsData } =
        await supabase
          .from("wellness_stats")
          .select("*")
          .eq("user_id", user.id)
          .single();

      if (statsData) {
        setWater(statsData.water || 0);

        setCalories(
          statsData.calories || 0
        );

        setXp(statsData.xp || 0);

        setLevel(statsData.level || 1);

        setCoins(statsData.coins || 0);

        setEnergy(statsData.energy || 100);

        setMood(
          statsData.mood ||
            "😌 Nyugodt"
        );
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  // =========================
  // DAILY WORKOUT LOAD
  // =========================

  useEffect(() => {
    const loadWorkout = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setWorkoutLoading(true);

      const today = new Date()
        .toISOString()
        .split("T")[0];

      const { data } = await supabase
        .from("workouts")
        .select("*")
        .eq("user_id", user.id)
        .eq("workout_date", today)
        .single();

      // VAN MAI EDZÉS

      if (data) {
        setTodayWorkout(data);

        setWorkoutLoading(false);

        return;
      }

      // GENERATE WORKOUT

      const generatedWorkout =
        generateWorkout();

      const {
        data: insertedWorkout,
      } = await supabase
        .from("workouts")
        .insert({
          user_id: user.id,

          title: generatedWorkout.title,

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

      setTodayWorkout(insertedWorkout);

      setWorkoutLoading(false);
    };

    if (profileCompleted) {
      loadWorkout();
    }
  }, [profileCompleted]);

  // =========================
  // DAILY REWARD
  // =========================

  useEffect(() => {
    const claimedDate =
      localStorage.getItem("dailyReward");

    const today =
      new Date().toDateString();

    if (claimedDate === today) {
      setDailyClaimed(true);
    }
  }, []);

  // =========================
  // LEVEL SYSTEM
  // =========================

  useEffect(() => {
    setLevel(Math.floor(xp / 100) + 1);
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
      newBadges.push("⭐ XP Újonc");
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
  // SAVE PROFILE
  // =========================

  const saveProfile = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setMessage(
        "❌ Nincs bejelentkezett user"
      );
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert(
        {
          user_id: user.id,

          gender,
          age,

          weight,
          height,

          goal,

          level: fitnessLevel,

          weekly_days: weeklyDays,

          workout_minutes:
            workoutMinutes,

          bmi,
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      console.error(error);

      setMessage(
        "❌ Hiba profil mentés közben"
      );

      return;
    }

    setProfileCompleted(true);

    setMessage(
      "✅ Profil sikeresen mentve!"
    );
  };

  // =========================
  // SAVE WELLNESS
  // =========================

  const handleSave = async () => {
    if (energy <= 0) {
      setMessage(
        "😴 Elfogyott az energiád."
      );

      return;
    }

    let gainedXp = 0;
    let gainedCoins = 0;

    if (water >= waterGoal) {
      gainedXp += 30;
      gainedCoins += 10;
    }

    if (
      calories > 0 &&
      calories <= calorieGoal
    ) {
      gainedXp += 20;
      gainedCoins += 10;
    }

    if (gainedXp === 0) {
      setMessage(
        "🌱 Minden kis lépés számít."
      );

      return;
    }

    const newXp = xp + gainedXp;

    const newLevel =
      Math.floor(newXp / 100) + 1;

    const newCoins =
      coins + gainedCoins;

    const newEnergy = Math.max(
      energy - 10,
      0
    );

    setXp(newXp);

    setLevel(newLevel);

    setCoins(newCoins);

    setEnergy(newEnergy);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("wellness_stats")
      .upsert(
        {
          user_id: user.id,

          water,
          calories,

          xp: newXp,
          level: newLevel,

          coins: newCoins,
          energy: newEnergy,

          mood,

          updated_at: new Date(),
        },
        {
          onConflict: "user_id",
        }
      );

    if (error) {
      console.error(error);

      setMessage(
        "❌ Hiba mentés közben"
      );

      return;
    }

    setMessage(
      `✨ +${gainedXp} XP és +${gainedCoins} coin`
    );
  };

  // =========================
  // COMPLETE WORKOUT
  // =========================

  const completeWorkout = async () => {
    if (!todayWorkout) return;

    if (todayWorkout.completed) {
      setMessage(
        "✅ A mai edzést már teljesítetted!"
      );

      return;
    }

    const gainedXp =
      todayWorkout.xp_reward;

    const gainedCoins =
      todayWorkout.coin_reward;

    const newXp = xp + gainedXp;

    const newCoins =
      coins + gainedCoins;

    setXp(newXp);

    setCoins(newCoins);

    // UPDATE WORKOUT

    await supabase
      .from("workouts")
      .update({
        completed: true,
      })
      .eq("id", todayWorkout.id);

    setTodayWorkout({
      ...todayWorkout,
      completed: true,
    });

    // UPDATE STATS

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      await supabase
        .from("wellness_stats")
        .upsert(
          {
            user_id: user.id,

            water,
            calories,

            xp: newXp,

            level:
              Math.floor(newXp / 100) + 1,

            coins: newCoins,

            energy,

            mood,
          },
          {
            onConflict: "user_id",
          }
        );
    }

    setMessage(
      `🏆 Edzés teljesítve! +${gainedXp} XP és +${gainedCoins} coin`
    );
  };

  // =========================
  // DAILY CLAIM
  // =========================

  const claimDailyReward = () => {
    if (dailyClaimed) {
      setMessage(
        "🎁 A napi jutalmat már felvetted."
      );

      return;
    }

    const rewardXp = 25;

    const rewardCoins = 50;

    setXp((prev) => prev + rewardXp);

    setCoins(
      (prev) => prev + rewardCoins
    );

    setEnergy((prev) =>
      Math.min(prev + 20, 100)
    );

    setDailyClaimed(true);

    localStorage.setItem(
      "dailyReward",
      new Date().toDateString()
    );

    setMessage(
      `🎉 +${rewardXp} XP és +${rewardCoins} coin`
    );
  };

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
  // PROFILE SCREEN
  // =========================

  if (!profileCompleted) {
    return (
      <div style={pageStyle}>
        <div style={phoneFrame}>
          <h1 style={title}>
            🔥 Homefit
          </h1>

          <p style={subtitle}>
            Kérdőív
          </p>

          <div style={section}>
            <select
              value={gender}
              onChange={(e) =>
                setGender(e.target.value)
              }
              style={inputStyle}
            >
              <option>Férfi</option>

              <option>Nő</option>
            </select>

            <input
              type="number"
              value={age}
              placeholder="Életkor"
              onChange={(e) =>
                setAge(
                  Number(e.target.value)
                )
              }
              style={inputStyle}
            />

            <input
              type="number"
              value={weight}
              placeholder="Testsúly"
              onChange={(e) =>
                setWeight(
                  Number(e.target.value)
                )
              }
              style={inputStyle}
            />

            <input
              type="number"
              value={height}
              placeholder="Magasság"
              onChange={(e) =>
                setHeight(
                  Number(e.target.value)
                )
              }
              style={inputStyle}
            />

            <select
              value={goal}
              onChange={(e) =>
                setGoal(e.target.value)
              }
              style={inputStyle}
            >
              <option>Fogyás</option>

              <option>
                Izomépítés
              </option>

              <option>
                Egészség
              </option>
            </select>

            <select
              value={fitnessLevel}
              onChange={(e) =>
                setFitnessLevel(
                  e.target.value
                )
              }
              style={inputStyle}
            >
              <option>
                Teljesen kezdő
              </option>

              <option>Kezdő</option>

              <option>Haladó</option>
            </select>

            <input
              type="number"
              value={weeklyDays}
              placeholder="Heti napok"
              onChange={(e) =>
                setWeeklyDays(
                  Number(e.target.value)
                )
              }
              style={inputStyle}
            />

            <input
              type="number"
              value={workoutMinutes}
              placeholder="Edzésidő"
              onChange={(e) =>
                setWorkoutMinutes(
                  Number(e.target.value)
                )
              }
              style={inputStyle}
            />

            <div style={questCard}>
              📊 BMI: {bmi}
            </div>

            <button
              style={saveBtn}
              onClick={saveProfile}
            >
              🚀 Profil mentése
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================
  // DASHBOARD
  // =========================

  return (
    <div style={pageStyle}>
      <div style={phoneFrame}>
        {/* NAV */}

        <div style={navStyle}>
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
            ➕
          </button>

          <button
            style={
              activeTab === "stats"
                ? activeNavBtn
                : navBtn
            }
            onClick={() =>
              setActiveTab("stats")
            }
          >
            📈
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
            <div style={heroCard}>
              <div>
                <h1 style={title}>
                  🔥 Homefit
                </h1>

                <p style={subtitle}>
                  {level}. szint
                </p>

                <p style={subtitle}>
                  🪙 {coins} coin
                </p>

                <p style={subtitle}>
                  ⚡ {energy}/100
                </p>
              </div>

              <div style={avatar}>🧘</div>
            </div>

            {/* XP */}

            <div style={xpCard}>
              <div style={spaceBetween}>
                <span>
                  ⭐ XP Haladás
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
                    background:
                      "linear-gradient(90deg,#a855f7,#ec4899)",
                  }}
                />
              </div>
            </div>

            {/* TODAY WORKOUT */}

            <div style={section}>
              <h2 style={sectionTitle}>
                🔥 Mai Edzés
              </h2>

              {workoutLoading ? (
                <div style={questCard}>
                  Betöltés...
                </div>
              ) : todayWorkout ? (
                <div style={questCard}>
                  <h3>
                    {todayWorkout.title}
                  </h3>

                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    {todayWorkout.exercises.map(
                      (exercise, i) => (
                        <p key={i}>
                          ✅ {exercise}
                        </p>
                      )
                    )}
                  </div>

                  <p>
                    ⭐ XP:{" "}
                    {
                      todayWorkout.xp_reward
                    }
                  </p>

                  <p>
                    🪙 Coin:{" "}
                    {
                      todayWorkout.coin_reward
                    }
                  </p>

                  <button
                    style={{
                      ...saveBtn,
                      marginTop: 10,
                      opacity:
                        todayWorkout.completed
                          ? 0.5
                          : 1,
                    }}
                    onClick={
                      completeWorkout
                    }
                  >
                    {todayWorkout.completed
                      ? "✅ Teljesítve"
                      : "🏆 Edzés kész"}
                  </button>
                </div>
              ) : null}
            </div>

            {/* DAILY REWARD */}

            <div style={section}>
              <button
                onClick={
                  claimDailyReward
                }
                style={{
                  ...saveBtn,
                  opacity:
                    dailyClaimed
                      ? 0.5
                      : 1,
                }}
              >
                {dailyClaimed
                  ? "✅ Felvéve"
                  : "🎁 Napi jutalom"}
              </button>
            </div>

            {/* BADGES */}

            <div style={section}>
              <h2 style={sectionTitle}>
                🏆 Jelvények
              </h2>

              <div style={badgeGrid}>
                {badges.map(
                  (badge, i) => (
                    <div
                      key={i}
                      style={badgeCard}
                    >
                      {badge}
                    </div>
                  )
                )}
              </div>
            </div>
          </>
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
    "radial-gradient(circle at top left, #1e3a8a, #020617 40%, #000000)",
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
    "rgba(255,255,255,0.08)",
  borderRadius: 30,
  padding: 20,
  backdropFilter: "blur(14px)",
  color: "white",
};

const navStyle = {
  display: "flex",
  justifyContent: "space-around",
  marginBottom: 20,
};

const navBtn = {
  background: "transparent",
  border: "none",
  color: "white",
  fontSize: 24,
};

const activeNavBtn = {
  background:
    "linear-gradient(135deg,#7c3aed,#ec4899)",
  border: "none",
  borderRadius: 14,
  color: "white",
  fontSize: 24,
  padding: "8px 14px",
};

const title = {
  margin: 0,
  fontSize: 28,
};

const subtitle = {
  opacity: 0.7,
};

const heroCard = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const avatar = {
  width: 70,
  height: 70,
  borderRadius: "50%",
  background:
    "linear-gradient(135deg,#22c55e,#06b6d4)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 32,
};

const section = {
  marginTop: 20,
};

const sectionTitle = {
  marginBottom: 10,
};

const questCard = {
  background:
    "rgba(255,255,255,0.05)",
  padding: 14,
  borderRadius: 14,
};

const inputStyle = {
  width: "100%",
  padding: 14,
  borderRadius: 14,
  border: "none",
  marginBottom: 12,
  background:
    "rgba(255,255,255,0.12)",
  color: "white",
  fontSize: 16,
  boxSizing: "border-box",
};

const xpCard = {
  background:
    "rgba(255,255,255,0.05)",
  padding: 15,
  borderRadius: 18,
  marginTop: 20,
};

const barBg = {
  width: "100%",
  height: 12,
  background: "#1e293b",
  borderRadius: 999,
  overflow: "hidden",
};

const barFill = {
  height: 12,
  borderRadius: 999,
};

const saveBtn = {
  width: "100%",
  padding: 14,
  borderRadius: 14,
  border: "none",
  background:
    "linear-gradient(135deg,#7c3aed,#ec4899,#f97316)",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
};

const badgeGrid = {
  display: "flex",
  flexWrap: "wrap",
  gap: 10,
};

const badgeCard = {
  background:
    "rgba(255,255,255,0.08)",
  padding: "10px 14px",
  borderRadius: 999,
};

const spaceBetween = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: 10,
};