import { useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";

export default function useLoadDailySummary({
  user,
  setWater,
  setCalories,
  setWorkedOutToday,
  setWeeklyCount,
}) {
  useEffect(() => {
    if (!user?.uid) return;

    const today = new Date().toISOString().slice(0, 10);

    const loadData = async () => {
      try {
        const ref = doc(db, "users", user.uid, "dailySummaries", today);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          const data = snap.data();

          if (data.water !== undefined) setWater(data.water);
          if (data.calories !== undefined) setCalories(data.calories);
          if (data.workedOutToday !== undefined)
            setWorkedOutToday(data.workedOutToday);
          if (data.weeklyCount !== undefined)
            setWeeklyCount(data.weeklyCount);
        }
      } catch (err) {
        console.error("Betöltési hiba:", err);
      }
    };

    loadData();
  }, [user]);
}