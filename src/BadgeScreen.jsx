import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "./firebase/config";

export default function BadgeScreen() {
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setBadges(snap.data().badges || []);
      }
    };

    load();
  }, []);

  const allBadges = [
    { id: "streak_3", title: "🔥 3 nap streak" },
    { id: "boss_1", title: "💀 első boss" },
    { id: "workout_5", title: "💪 5 edzés" },
  ];

  return (
    <div style={{ padding: "20px", background: "#020617", minHeight: "100vh", color: "white" }}>
      <h1>🏆 Badge-ek</h1>

      {allBadges.map((b) => {
        const unlocked = badges.includes(b.id);

        return (
          <div
            key={b.id}
            style={{
              marginTop: "10px",
              padding: "15px",
              borderRadius: "10px",
              background: unlocked ? "green" : "#1e293b",
              opacity: unlocked ? 1 : 0.4,
            }}
          >
            {b.title} {!unlocked && "🔒"}
          </div>
        );
      })}
    </div>
  );
}