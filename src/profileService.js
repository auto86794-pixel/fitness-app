import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

// =========================
// GET PROFILE
// =========================

export async function getProfile(uid) {
  try {
    const userRef = doc(db, "users", uid);

    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
      console.log("❌ No profile");
      return null;
    }

    return snapshot.data();
  } catch (error) {
    console.error("Profile load error:", error);
    return null;
  }
}

// =========================
// UPDATE PROFILE (GENERAL)
// =========================

export async function updateProfile(uid, data) {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, data);

    console.log("✅ Profile updated");
  } catch (error) {
    console.error("❌ Update error:", error);
  }
}

// =========================
// SAVE WORKOUT PROGRESS
// =========================

export async function saveWorkoutProgress(uid, data) {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      xp: data.xp,
      coins: data.coins,
      streak: data.streak,
      lastWorkoutDate: data.lastWorkoutDate,
    });

    console.log("🔥 Workout progress saved");
  } catch (error) {
    console.error("❌ Save workout error:", error);
  }
}

// =========================
// CLAIM DAILY REWARD
// =========================

export async function claimDailyReward(uid, data) {
  try {
    const userRef = doc(db, "users", uid);

    await updateDoc(userRef, {
      xp: data.xp,
      coins: data.coins,
      lastClaimDate: data.lastClaimDate,
    });

    console.log("🎁 Reward claimed");
  } catch (error) {
    console.error("❌ Reward error:", error);
  }
}