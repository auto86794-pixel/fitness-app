import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "./firebase";

export async function saveQuestionnaire(
  uid,
  data
) {

  try {

    const userRef =
      doc(db, "users", uid);

    await updateDoc(
      userRef,
      data
    );

    console.log(
      "✅ Questionnaire saved"
    );

  } catch (error) {

    console.error(
      "❌ Save error:",
      error
    );
  }
}