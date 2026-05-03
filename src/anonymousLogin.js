import {
  signInAnonymously,
} from "firebase/auth";

import { auth } from "./firebase";

export async function anonymousLogin() {

  try {

    const result =
      await signInAnonymously(auth);

    console.log(
      "✅ Anonymous login:",
      result.user.uid
    );

  } catch (error) {

    console.error(
      "❌ Login error:",
      error
    );
  }
}