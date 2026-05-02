import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function FitnessDashboard() {
  const [water, setWater] = useState(0);
  const [calories, setCalories] = useState(0);

  const waterGoal = 2000;
  const calorieGoal = 1800;

  const waterPercent = Math.min((water / waterGoal) * 100, 100);
  const caloriePercent = Math.min((calories / calorieGoal) * 100, 100);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          padding: "30px",
          borderRadius: "20px",
          width: "360px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 style={{ marginBottom: 10 }}>💪 Fitness Dashboard</h2>

        <p>🔥 Streak: 3 nap</p>
        <p>🏆 Badge: Beginner</p>
        <p>⭐ Level: 1</p>

        <input
          type="number"
          placeholder="💧 Víz (ml)"
          onChange={(e) => setWater(Number(e.target.value) || 0)}
          style={inputStyle}
        />

        <input
          type="number"
          placeholder="🔥 Kalória"
          onChange={(e) => setCalories(Number(e.target.value) || 0)}
          style={inputStyle}
        />

        {/* Progress */}
        <div style={{ marginTop: 15 }}>
          <p>💧 Víz: {water} / {waterGoal}</p>
          <div style={barBg}>
            <div
              style={{
                ...barFill,
                width: `${waterPercent}%`,
                background: "#38bdf8",
              }}
            />
          </div>

          <p style={{ marginTop: 10 }}>
            🔥 Kalória: {calories} / {calorieGoal}
          </p>
          <div style={barBg}>
            <div
              style={{
                ...barFill,
                width: `${caloriePercent}%`,
                background: "#f97316",
              }}
            />
          </div>
        </div>

        <button style={saveBtn}>Mentés</button>

        <button style={logoutBtn} onClick={handleLogout}>
          Kilépés
        </button>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  borderRadius: "10px",
  border: "none",
};

const barBg = {
  width: "100%",
  height: "10px",
  background: "#1e293b",
  borderRadius: "10px",
};

const barFill = {
  height: "10px",
  borderRadius: "10px",
  transition: "width 0.3s",
};

const saveBtn = {
  width: "100%",
  padding: "10px",
  marginTop: "15px",
  background: "#22c55e",
  border: "none",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
};

const logoutBtn = {
  width: "100%",
  padding: "10px",
  marginTop: "10px",
  background: "#ef4444",
  border: "none",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
};