import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db, auth } from "./firebase/config";

export default function ProfileScreen() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  // 🏆 Badge mapping (ID → szép név)
  const badgeMap = {
    streak_3: "🔥 3 napos streak",
    boss_1: "💀 Első boss legyőzve",
    workout_5: "💪 5 edzés teljesítve",
  };

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setData(snap.data());
      }
    };

    load();
  }, []);

  if (!data) {
    return (
      <div style={{ color: "white", padding: "20px" }}>
        Betöltés...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        display: "flex",
        justifyContent: "center",
      }}
    >
      {/* 📱 CONTAINER */}
      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "16px",
          paddingBottom: "80px",
          color: "white",
        }}
      >
        {/* 🔝 HEADER */}
        <div
          style={{
            position: "sticky",
            top: 0,
            background: "#020617",
            paddingBottom: "10px",
            zIndex: 10,
          }}
        >
          <h1 style={{ margin: 0 }}>👤 Profil</h1>
        </div>

        {/* 👤 USER INFO */}
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "20px",
            background: "#1e293b",
          }}
        >
          <p>🆔 {auth.currentUser?.uid?.slice(0, 8)}</p>
          <p>📈 Level: {data.level || 1}</p>
          <p>⭐ XP: {data.xp || 0}</p>
          <p>🔥 Streak: {data.streak || 0}</p>
          <p>💪 Edzések: {data.workoutCount || 0}</p>
        </div>

        {/* 🏆 BADGES */}
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            borderRadius: "20px",
            background: "#1e293b",
          }}
        >
          <h3>🏆 Badge-ek</h3>

          {(data.badges || []).length === 0 && (
            <p style={{ opacity: 0.6 }}>
              Még nincs badge
            </p>
          )}

          {(data.badges || []).map((b, i) => (
            <div
              key={i}
              style={{
                padding: "10px 0",
              }}
            >
              {badgeMap[b] || b}
            </div>
          ))}
        </div>

        {/* 🔻 NAV GOMBOK */}
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            background:
              "linear-gradient(135deg,#22c55e,#16a34a)",
            color: "white",
            fontWeight: "bold",
          }}
        >
          ← Vissza az edzéshez
        </button>
      </div>

      {/* 🔻 BOTTOM NAV */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          maxWidth: "420px",
          background: "#020617",
          borderTop: "1px solid #1e293b",
          display: "flex",
          justifyContent: "space-around",
          padding: "12px 0",
        }}
      >
        <div onClick={() => navigate("/dashboard")}>
          🏠
        </div>

        <div onClick={() => navigate("/badges")}>
          🏆
        </div>

        <div>
          👤
        </div>
      </div>
    </div>
  );
}