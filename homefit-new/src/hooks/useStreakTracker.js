import { useEffect, useState } from "react";

export default function useStreakTracker(user, workedOutToday) {
  const getKey = (type) =>
    user?.uid ? `homefit_${type}_${user.uid}` : null;

  const today = new Date().toDateString();

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user?.uid) return;

    const streakKey = getKey("streak");
    const lastDateKey = getKey("streak_last_date");

    const savedStreak = localStorage.getItem(streakKey);
    const lastDate = localStorage.getItem(lastDateKey);

    if (!lastDate) {
      setStreak(savedStreak ? Number(savedStreak) : 0);
      return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const isYesterday =
      new Date(lastDate).toDateString() === yesterday.toDateString();

    const isToday = new Date(lastDate).toDateString() === today;

    // ❌ ha kihagyott nap → reset
    if (!isYesterday && !isToday) {
      setStreak(0);
    } else {
      setStreak(savedStreak ? Number(savedStreak) : 0);
    }
  }, [user, today]);

  // 🔥 ha ma edzett → streak nő
  useEffect(() => {
    if (!user?.uid) return;
    if (!workedOutToday) return;

    const streakKey = getKey("streak");
    const lastDateKey = getKey("streak_last_date");

    const lastDate = localStorage.getItem(lastDateKey);

    const isSameDay =
      lastDate &&
      new Date(lastDate).toDateString() === today;

    if (isSameDay) return; // ne növeld többször

    setStreak((prev) => {
      const newStreak = prev + 1;

      localStorage.setItem(streakKey, newStreak);
      localStorage.setItem(lastDateKey, today);

      return newStreak;
    });
  }, [workedOutToday, user, today]);

  return { streak };
}