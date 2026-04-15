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

export default function FitnessDashboard() {
  const [water, setWater] = useState("");
  const [calories, setCalories] = useState("");
  const [chartData, setChartData] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
    loadHistory();
  }, []);

  const loadUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadHistory = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("daily_stats")
      .select("*")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    setChartData(data || []);
  };

  const saveData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    await supabase.from("daily_stats").upsert({
      user_id: user.id,
      water: parseInt(water),
      calories: parseInt(calories),
      date: today,
    });

    setWater("");
    setCalories("");
    loadHistory();
  };

  const logout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          padding: "25px",
          width: "350px",
          color: "white",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>💪 Fitness Dashboard</h2>

        <input
          type="number"
          placeholder="💧 Víz (ml)"
          value={water}
          onChange={(e) => setWater(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            marginBottom: "10px",
            background: "#1e293b",
            color: "white",
          }}
        />

        <input
          type="number"
          placeholder="🔥 Kalória"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            marginBottom: "10px",
            background: "#1e293b",
            color: "white",
          }}
        />

        <button
          onClick={saveData}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#22c55e",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Mentés
        </button>

        <button
          onClick={logout}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#ef4444",
            color: "white",
            fontWeight: "bold",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          Kilépés
        </button>

        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "10px",
          }}
        >
          <h3>📊 Statisztika</h3>

          <LineChart width={300} height={200} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="date" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="water" stroke="#38bdf8" />
            <Line type="monotone" dataKey="calories" stroke="#f97316" />
          </LineChart>
        </div>
      </div>
    </div>
  );
}