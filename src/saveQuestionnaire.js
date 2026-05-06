import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase/config";

/**
 * data várható mezők:
 * {
 *   goal: "Fogyás" | "Izomépítés",
 *   level: "Kezdő" | "Haladó",
 *   duration: number | string,
 *   days?: number | string,
 *   gender?: string,
 *   age?: number | string,
 *   weight?: number | string,
 *   height?: number | string
 * }
 */
export async function saveQuestionnaire(data) {
  try {
    const user = auth.currentUser;

    if (!user) {
      console.warn("⚠️ Nincs bejelentkezett user");
      return { ok: false, error: "no-user" };
    }

    // 🔧 Normalizálás (típusok + alapértékek)
    const normalized = {
      goal: (data.goal || "").toString(),              // pl. "Fogyás"
      level: (data.level || "").toString(),            // pl. "Kezdő"
      duration: Number(data.duration) || 20,           // perc
      days: data.days != null ? Number(data.days) : null,
      gender: data.gender ?? null,
      age: data.age != null ? Number(data.age) : null,
      weight: data.weight != null ? Number(data.weight) : null,
      height: data.height != null ? Number(data.height) : null,
      updatedAt: serverTimestamp(),
    };

    // 🛑 Alap validáció
    if (!normalized.goal || !normalized.level) {
      console.error("❌ Hiányzó kötelező mezők (goal, level)");
      return { ok: false, error: "invalid-data" };
    }

    // 🔥 Helyes path: users/{uid}/profile/data
    const ref = doc(db, "users", user.uid, "profile", "data");

    await setDoc(ref, normalized, { merge: true });

    console.log("✅ Kérdőív mentve:", normalized);
    return { ok: true };
  } catch (err) {
    console.error("❌ Mentési hiba:", err);
    return { ok: false, error: "save-failed" };
  }
}