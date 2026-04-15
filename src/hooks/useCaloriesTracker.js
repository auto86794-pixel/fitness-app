import { useEffect, useState } from "react";

export default function useCaloriesTracker(user) {
  const dailyGoal = 2200;

  const getStorageKey = () => {
    return user?.uid ? `homefit_calories_${user.uid}` : null;
  };

  const [calories, setCalories] = useState(0);

  // 🔄 Betöltés
  useEffect(() => {
    const key = getStorageKey();
    if (!key) return;

    const saved = localStorage.getItem(key);
    setCalories(saved ? Number(saved) : 0);
  }, [user]);

  // 💾 Mentés
  useEffect(() => {
    const key = getStorageKey();
    if (!key) return;

    localStorage.setItem(key, calories);
  }, [calories, user]);

  // ➕ Funkciók
  const addCalories = (amount) => {
    setCalories((prev) => prev + amount);
  };

  const resetCalories = () => {
    setCalories(0);
  };

  // 📊 Progress
  const progress = Math.min((calories / dailyGoal) * 100, 100);

  return {
    calories,
    dailyGoal,
    progress,
    addCalories,
    resetCalories,
    setCalories
    };
}