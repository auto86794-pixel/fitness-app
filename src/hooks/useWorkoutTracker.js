import { useEffect, useState } from "react";

export default function useWorkoutTracker(user) {
  const getKey = (type) =>
    user?.uid ? `homefit_${type}_${user.uid}` : null;

  const today = new Date().toDateString();

  const [workedOutToday, setWorkedOutToday] = useState(false);
  const [weeklyCount, setWeeklyCount] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;

    const todayKey = getKey("workout_today");
    const weekKey = getKey("workout_week");
    const dateKey = getKey("workout_date");

    const savedToday = localStorage.getItem(todayKey);
    const savedWeek = localStorage.getItem(weekKey);
    const savedDate = localStorage.getItem(dateKey);

    if (savedDate !== today) {
      localStorage.setItem(todayKey, "false");
      localStorage.setItem(dateKey, today);
      setWorkedOutToday(false);
    } else {
      setWorkedOutToday(savedToday === "true");
    }

    setWeeklyCount(savedWeek ? Number(savedWeek) : 0);
  }, [user, today]);

  useEffect(() => {
    if (!user?.uid) return;

    localStorage.setItem(getKey("workout_today"), workedOutToday);
    localStorage.setItem(getKey("workout_week"), weeklyCount);
  }, [workedOutToday, weeklyCount, user]);

  const toggleWorkout = () => {
    setWorkedOutToday((prev) => {
      const newValue = !prev;

      if (newValue) {
        setWeeklyCount((w) => w + 1);
      } else {
        setWeeklyCount((w) => Math.max(w - 1, 0));
      }

      return newValue;
    });
  };

  return {
    workedOutToday,
    weeklyCount,
    toggleWorkout,
    setWorkedOutToday,
    setWeeklyCount,
};
}