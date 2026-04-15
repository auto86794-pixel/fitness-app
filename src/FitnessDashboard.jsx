import { useEffect, useState } from "react";
import supabase from "./supabaseClient";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

// 🎯 GOAL
const WATER_GOAL = 2000;
const CALORIES_GOAL = 1800;

export default function FitnessDashboard() {
  const [water, setWater] = useState("");
  const [calories, setCalories] = useState("");
  const [message, setMessage] = useState("");
  const [chartData, setChartData] = useState([]);
  const [streak, setStreak] = useState(0);

  // 🏆 GAMIFICATION
  const [badge, setBadge] = useState("Beginner");
  const [level, setLevel] = useState(1);

  useEffect(() => {
    loadData();
    loadHistory();
  }, []);

  // 🔥 STREAK
  const calculateStreak = (data) => {
    if (!data || data.length === 0) return 0;

    const dates = data.map((d) => d.date).sort().reverse();

    let count = 0;
    let currentDate = new Date();

    for (let i = 0; i < dates.length; i++) {
      const d = new Date(dates[i]);
      const diff = Math.floor(
        (currentDate - d) / (1000 * 60 * 60 * 24)
      );

      if (diff === count) {
        count++;
      } else {
        break;
      }
    }

    return count;
  };

  // 🏆 BADGE + LEVEL
  const calculateGamification = (streak) => {
    let badge = "Beginner";
    let level = 1;

    if (streak >= 3) {
      badge = "Rising";
      level = 2;
    }
    if (streak >= 7) {
      badge = "Pro";
      level = 3;
    }
    if (streak >= 14) {
      badge = "Elite";
      level = 4;
    }
    if (streak >= 30) {
      badge = "Legend";
      level = 5;
    }

    return { badge, level };
  };

  const loadData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("daily_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    if (data) {
      setWater(data.water?.toString() || "");
      setCalories(data.calories?.toString() || "");
    }
  };

  const loadHistory = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("daily_stats")
      .select("date, water, calories")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    const safeData = data || [];

    setChartData(safeData);

    const s = calculateStreak(safeData);
    setStreak(s);

    const g = calculateGamification(s);
    setBadge(g.badge);
    setLevel(g.level);
  };

  const handleSave = async () => {
    setMessage("Mentés...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    await supabase.from("daily_stats").upsert(
      [
        {
          user_id: user.id,
          date: today,
          water: Number(water),
          calories: Number(calories),
        },
      ],
      { onConflict: "user_id,date" }
    );

    setMessage("Mentve! 💾");
    loadHistory();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // 🎯 PROGRESS
  const waterPercent = Math.min((Number(water) / WATER_GOAL) * 100, 100);
  const caloriesPercent = Math.min((Number(calories) / CALORIES_GOAL) * 100, 100);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: "400px",
          background: "#1e293b",
          padding: "30px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
        }}
      >
        <h1>💪 Fitness Dashboard</h1>

        <h2>🔥 Streak: {streak} nap</h2>

        <p>🏆 Badge: {badge}</p>
        <p>⭐ Level: {level}</p>

        <input
          type="number"
          placeholder="💧 Víz (ml)"
          value={water}
          onChange={(e) => setWater(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10, borderRadius: 10, border: "none" }}
        />

        <input
          type="number"
          placeholder="🔥 Kalória"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          style={{ width: "100%", padding: 10, marginTop: 10, borderRadius: 10, border: "none" }}
        />

        {/* 🎯 GOAL */}
        <h3 style={{ marginTop: 20 }}>🎯 Napi célok</h3>

        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>💧 Víz</span>
            <span>{water || 0} / {WATER_GOAL} ml</span>
          </div>
          <div style={{ height: 10, background: "#334155", borderRadius: 10 }}>
            <div style={{ width: `${waterPercent}%`, height: "100%", background: "#38bdf8", borderRadius: 10 }} />
          </div>
        </div>

        <div style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>🔥 Kalória</span>
            <span>{calories || 0} / {CALORIES_GOAL}</span>
          </div>
          <div style={{ height: 10, background: "#334155", borderRadius: 10 }}>
            <div style={{ width: `${caloriesPercent}%`, height: "100%", background: "#f97316", borderRadius: 10 }} />
          </div>
        </div>

        <button
          onClick={handleSave}
          style={{ width: "100%", padding: 12, marginTop: 15, borderRadius: 10, border: "none", background: "#22c55e", color: "white" }}
        >
          Mentés
        </button>

        <button
          onClick={handleLogout}
          style={{ width: "100%", padding: 10, marginTop: 10, borderRadius: 10, border: "none", background: "#ef4444", color: "white" }}
        >
          Kilépés
        </button>

        <p style={{ textAlign: "center" }}>{message}</p>

        {/* 📊 GRAFIKON */}
        <h3 style={{ marginTop: 20 }}>📊 Statisztika</h3>

        <LineChart width={320} height={200} data={chartData}>
          <CartesianGrid stroke="#334155" />
          <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} stroke="#cbd5f5" />
          <YAxis stroke="#cbd5f5" />
          <Tooltip />
          <Line type="monotone" dataKey="water" stroke="#38bdf8" />
          <Line type="monotone" dataKey="calories" stroke="#f97316" />
        </LineChart>

        {/* 📅 LISTA */}
        <h3 style={{ marginTop: 20 }}>📅 Előző napok</h3>

        {chartData.slice().reverse().map((item, i) => (
          <div
            key={i}
            style={{
              background: "#0f172a",
              padding: 10,
              borderRadius: 10,
              marginTop: 5,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{item.date.slice(5)}</span>
            <span>💧 {item.water || 0} | 🔥 {item.calories || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}