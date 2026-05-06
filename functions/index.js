const admin = require("firebase-admin");

const {
  onCall,
  HttpsError,
} = require("firebase-functions/v2/https");

admin.initializeApp();

const db = admin.firestore();

/* =======================================================
   🔥 GENERATE WORKOUT
======================================================= */

exports.generateWorkout = onCall(
  async (request) => {

    /* ======================
       🔐 AUTH CHECK
    ====================== */

    if (!request.auth) {

      throw new HttpsError(
        "unauthenticated",
        "Nincs bejelentkezett user"
      );

    }

    const uid = request.auth.uid;

    console.log(
      "🔥 generateWorkout user:",
      uid
    );

    const userRef =
      db.collection("users").doc(uid);

    const snap =
      await userRef.get();

    /* ======================
       👤 AUTO CREATE USER
    ====================== */

    if (!snap.exists) {

      console.log(
        "🔥 új user létrehozása:",
        uid
      );

      await userRef.set({
        xp: 0,
        level: 1,
        streak: 0,
        workoutCount: 0,
        badges: [],
        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

    }

    /* ======================
       🔄 FRISS SNAPSHOT
    ====================== */

    const freshSnap =
      await userRef.get();

    const user =
      freshSnap.data();

    console.log(
      "🔥 USER DATA:",
      user
    );

    const level =
      user.level || 1;

    const streak =
      user.streak || 0;

    const isBoss =
      level % 5 === 0;

    let exercises = [];

    /* ======================
       💀 BOSS WORKOUT
    ====================== */

    if (isBoss) {

      exercises = [
        "burpee - 15 ismétlés",
        "jump squat - 20 ismétlés",
        "mountain climber - 30 mp",
        "plank - 40 mp",
        "fekvőtámasz - 12 ismétlés",
        "kitörés - 20 ismétlés",
      ];

    }

    /* ======================
       🔀 NORMAL WORKOUT
    ====================== */

    else {

      const allExercises = [
        "fekvőtámasz",
        "guggolás",
        "jumping jack",
        "plank",
        "kitörés",
        "mountain climber",
        "hasprés",
        "falnál ülés",
      ];

      // 🔀 random keverés
      const shuffled =
        allExercises.sort(
          () => 0.5 - Math.random()
        );

      const selected =
        shuffled.slice(0, 3);

      exercises =
        selected.map((e) => {

          if (e === "plank") {

            return "plank - 30 mp";

          }

          if (
            e === "mountain climber"
          ) {

            return "mountain climber - 20 mp";

          }

          return `${e} - ${
            10 + level * 2
          } ismétlés`;

        });

    }

    /* ======================
       ✅ RESPONSE
    ====================== */

    const workout = {

      title: isBoss
        ? "💀 BOSS edzés"
        : "🔥 Napi edzés",

      exercises,

      xp_reward: isBoss
        ? 100
        : 20 + level * 2,

      coin_reward: isBoss
        ? 50
        : 15,

      level,

      streak,

      isBoss,

    };

    console.log(
      "🔥 WORKOUT RESPONSE:",
      workout
    );

    return workout;

  }
);

/* =======================================================
   🎉 COMPLETE WORKOUT
======================================================= */

exports.completeWorkout = onCall(
  async (request) => {

    /* ======================
       🔐 AUTH
    ====================== */

    if (!request.auth) {

      throw new HttpsError(
        "unauthenticated",
        "Nincs user"
      );

    }

    const uid =
      request.auth.uid;

    console.log(
      "🏆 completeWorkout:",
      uid
    );

    const {
      xp,
      isBoss,
    } = request.data;

    const ref =
      db.collection("users").doc(uid);

    const snap =
      await ref.get();

    /* ======================
       👤 USER CREATE
    ====================== */

    if (!snap.exists) {

      await ref.set({
        xp: 0,
        level: 1,
        streak: 0,
        workoutCount: 0,
        badges: [],
        createdAt:
          admin.firestore.FieldValue.serverTimestamp(),
      });

    }

    const freshSnap =
      await ref.get();

    const user =
      freshSnap.data();

    let newXp =
      (user.xp || 0) + xp;

    let level =
      user.level || 1;

    let streak =
      user.streak || 0;

    let workoutCount =
      user.workoutCount || 0;

    let badges =
      user.badges || [];

    /* ======================
       📈 LEVEL UP
    ====================== */

    const xpNeeded =
      level * 100;

    if (newXp >= xpNeeded) {

      newXp =
        newXp - xpNeeded;

      level++;

    }

    /* ======================
       🔥 STREAK
    ====================== */

    streak += 1;

    workoutCount += 1;

    /* ======================
       🏆 BADGES
    ====================== */

    const newBadges = [];

    if (
      streak >= 3 &&
      !badges.includes(
        "streak_3"
      )
    ) {

      badges.push(
        "streak_3"
      );

      newBadges.push(
        "🔥 3 napos streak"
      );

    }

    if (
      isBoss &&
      !badges.includes(
        "boss_1"
      )
    ) {

      badges.push(
        "boss_1"
      );

      newBadges.push(
        "💀 Első boss"
      );

    }

    if (
      workoutCount >= 5 &&
      !badges.includes(
        "workout_5"
      )
    ) {

      badges.push(
        "workout_5"
      );

      newBadges.push(
        "💪 5 edzés"
      );

    }

    /* ======================
       💾 SAVE
    ====================== */

    await ref.set(
      {
        xp: newXp,
        level,
        streak,
        workoutCount,
        badges,
        lastWorkout:
          admin.firestore.FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    console.log(
      "🏆 SAVE SUCCESS"
    );

    /* ======================
       ✅ RESPONSE
    ====================== */

    return {

      success: true,

      newBadges,

      level,

      xp: newXp,

      streak,

    };

  }
);