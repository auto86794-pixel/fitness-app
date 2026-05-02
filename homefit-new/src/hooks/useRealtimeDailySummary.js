import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";

export default function useRealtimeDailySummary({
  user,
  setWater,
  setCalories,
  setWorkedOutToday,
  setWeeklyCount,
}) {
  useEffect(() => {
    if (!user?.uid) return;

    const today = new Date().toISOString().slice(0, 10);
    const ref = doc(db, "users", user.uid, "dailySummaries", today);

    const unsubscribe = onSnapshot(
      ref,
      (snap) => {
        if (!snap.exists()) return;

        const data = snap.data();

        if (data.water !== undefined) setWater(data.water);
        if (data.calories !== undefined) setCalories(data.calories);
        if (data.workedOutToday !== undefined) {
          setWorkedOutToday(data.workedOutToday);
        }
        if (data.weeklyCount !== undefined) {
          setWeeklyCount(data.weeklyCount);
        }
      },
      (error) => {
        console.error("Real-time sync hiba:", error);
      }
    );

    return () => unsubscribe();
  }, [user, setWater, setCalories, setWorkedOutToday, setWeeklyCount]);
}