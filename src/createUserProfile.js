import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "./firebase/config";

export async function createUserProfile(
  user
) {
  if (!user) return;

  const userRef =
    doc(db, "users", user.uid);

  const snapshot =
    await getDoc(userRef);

  // HA NINCS USER DOC

  if (!snapshot.exists()) {

    await setDoc(userRef, {
      xp: 0,
      level: 1,
      coins: 120,
      streak: 1,
      water: 0,
      calories: 0,
      goal: "weight_loss",
      createdAt: Date.now(),
    });

    console.log(
      "✅ User profile created"
    );
  }
}