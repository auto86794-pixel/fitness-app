import { useEffect, useState } from "react";

export default function useWaterTracker(user) {
  const dailyGoal = 2; // liter

  const getStorageKey = () => {
    return user?.uid ? `homefit_water_${user.uid}` : null;
  };

  const [water, setWater] = useState(1.5);

  // 🔄 Betöltés user váltáskor
  useEffect(() => {
    const key = getStorageKey();
    if (!key) return;

    const saved = localStorage.getItem(key);
    setWater(saved ? Number(saved) : 1.5);
  }, [user]);

  // 💾 Mentés változáskor
  useEffect(() => {
    const key = getStorageKey();
    if (!key) return;

    localStorage.setItem(key, water);
  }, [water, user]);

  // ➕ Funkciók
  const addWater = () => {
    setWater((prev) => +(prev + 0.25).toFixed(2));
  };

  const resetWater = () => {
    setWater(0);
  };

  // 📊 Progress
  const progress = Math.min((water / dailyGoal) * 100, 100);

  return {
    water,
    dailyGoal,
    progress,
    addWater,
    resetWater,
    setWater, 
};
}