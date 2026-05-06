import { useEffect, useState } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { httpsCallable } from "firebase/functions";
import { useNavigate } from "react-router-dom";

import {
  auth,
  functions,
} from "./firebase/config";

console.log("🔥 MODERN DASHBOARD FUT");

export default function FitnessDashboard() {

  console.log("🔥 EZ AZ ÚJ DASHBOARD");

  const [user, setUser] =
    useState(null);

  const [authReady, setAuthReady] =
    useState(false);

  const [workout, setWorkout] =
    useState(null);

  const [completed, setCompleted] =
    useState([]);

  const [finished, setFinished] =
    useState(false);

  const [newBadges, setNewBadges] =
    useState([]);

  const navigate = useNavigate();

  /* =======================================================
     🔐 AUTH LISTENER
  ======================================================= */

  useEffect(() => {

    const unsub =
      onIdTokenChanged(
        auth,
        async (u) => {

          console.log(
            "AUTH CHANGE:",
            u
          );

          if (!u) {

            setUser(null);

            setAuthReady(true);

            return;

          }

          try {

            console.log(
              "✅ user megvan"
            );

            await u.getIdToken(true);

            console.log(
              "🔥 token kész"
            );

            await new Promise((r) =>
              setTimeout(r, 1200)
            );

            setUser(u);

            setAuthReady(true);

          } catch (err) {

            console.error(
              "❌ TOKEN HIBA:",
              err
            );

          }

        }
      );

    return () => unsub();

  }, []);

  /* =======================================================
     🔥 FETCH WORKOUT
  ======================================================= */

  const fetchWorkout = async () => {

    try {

      const currentUser =
        auth.currentUser;

      if (!currentUser) {

        console.log(
          "❌ nincs currentUser"
        );

        return;

      }

      console.log(
        "✅ currentUser OK"
      );

      await currentUser.getIdToken(
        true
      );

      console.log(
        "🔥 token refresh kész"
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      console.log(
        "📡 workout hívás..."
      );

      const fn =
        httpsCallable(
          functions,
          "generateWorkout"
        );

      const res =
        await fn({});

      console.log(
        "🔥 Workout:",
        res.data
      );

      setWorkout({
        ...res.data,
      });

      setCompleted([]);

      setFinished(false);

      setNewBadges([]);

    } catch (err) {

      console.error(
        "❌ HIBA:",
        err
      );

    }

  };

  /* =======================================================
     🚀 AUTO LOAD
  ======================================================= */

  useEffect(() => {

    if (
      authReady &&
      user &&
      !workout
    ) {

      console.log(
        "🚀 indítjuk az edzést"
      );

      fetchWorkout();

    }

  }, [
    authReady,
    user,
  ]);

  /* =======================================================
     ✅ TOGGLE
  ======================================================= */

  const toggle = (i) => {

    setCompleted((prev) =>

      prev.includes(i)
        ? prev.filter(
            (x) => x !== i
          )
        : [...prev, i]

    );

  };

  /* =======================================================
     🎉 COMPLETE WORKOUT
  ======================================================= */

  useEffect(() => {

    const complete =
      async () => {

        if (
          workout &&
          completed.length ===
            workout.exercises.length &&
          !finished
        ) {

          setFinished(true);

          try {

            const currentUser =
              auth.currentUser;

            if (!currentUser) {

              return;

            }

            await currentUser.getIdToken(
              true
            );

            await new Promise((r) =>
              setTimeout(r, 1000)
            );

            const fn =
              httpsCallable(
                functions,
                "completeWorkout"
              );

            const res =
              await fn({
                xp:
                  workout.xp_reward,
                isBoss:
                  workout.isBoss,
              });

            console.log(
              "🏆 XP siker:",
              res.data
            );

            setNewBadges(
              res.data.newBadges || []
            );

          } catch (err) {

            console.error(
              "❌ XP hiba:",
              err
            );

          }

        }

      };

    complete();

  }, [completed]);

  /* =======================================================
     🎨 UI
  ======================================================= */

  return (

    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#020617 0%,#07111f 100%)",
        display: "flex",
        justifyContent: "center",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: "430px",
          padding: "18px",
          paddingBottom: "110px",
          color: "white",
        }}
      >

        {/* HEADER */}

        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            paddingBottom: 16,
            paddingTop: 8,
            background:
              "linear-gradient(180deg,#020617 0%,rgba(2,6,23,0.92) 100%)",
            backdropFilter:
              "blur(12px)",
          }}
        >

          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
            }}
          >

            <div>

              <div
                style={{
                  fontSize: 14,
                  color: "#94a3b8",
                  marginBottom: 4,
                }}
              >
                🔥 Homefit
              </div>

              <div
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                }}
              >
                Dashboard
              </div>

            </div>

            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: 18,
                background:
                  "linear-gradient(135deg,#22c55e,#14b8a6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                boxShadow:
                  "0 10px 30px rgba(34,197,94,0.25)",
              }}
            >
              ⚡
            </div>

          </div>

        </div>

        {/* LOADING */}

        {!workout && (

          <div
            style={{
              marginTop: 30,
              textAlign: "center",
              opacity: 0.8,
            }}
          >
            Betöltés...
          </div>

        )}

        {/* WORKOUT */}

        {workout && (

          <>

            {/* =======================================================
                🔥 HERO CARD
            ======================================================= */}

            <div
              style={{
                marginTop: 10,
                borderRadius: 32,
                padding: 26,
                background:
                  "linear-gradient(135deg,#16a34a 0%,#065f46 55%,#022c22 100%)",
                position: "relative",
                overflow: "hidden",
                boxShadow:
                  "0 20px 50px rgba(34,197,94,0.18)",
              }}
            >

              {/* GLOW */}

              <div
                style={{
                  position: "absolute",
                  width: 220,
                  height: 220,
                  borderRadius: "50%",
                  background:
                    "rgba(255,255,255,0.08)",
                  top: -80,
                  right: -80,
                  filter: "blur(40px)",
                }}
              />

              {/* TOP */}

              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: 26,
                  position: "relative",
                  zIndex: 2,
                }}
              >

                <div>

                  <div
                    style={{
                      fontSize: 14,
                      opacity: 0.8,
                      marginBottom: 6,
                    }}
                  >
                    🔥 Mai státusz
                  </div>

                  <div
                    style={{
                      fontSize: 34,
                      fontWeight: 900,
                      lineHeight: 1,
                    }}
                  >
                    Level {workout.level}
                  </div>

                </div>

                <div
                  style={{
                    background:
                      "rgba(255,255,255,0.12)",
                    padding:
                      "12px 18px",
                    borderRadius: 20,
                    backdropFilter:
                      "blur(10px)",
                    fontWeight: 700,
                  }}
                >
                  🔥 {workout.streak} streak
                </div>

              </div>

              {/* XP BAR */}

              <div
                style={{
                  position: "relative",
                  zIndex: 2,
                }}
              >

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom: 10,
                    fontSize: 14,
                    opacity: 0.9,
                  }}
                >
                  <span>
                    XP progress
                  </span>

                  <span>
                    {Math.min(
                      workout.level * 20,
                      100
                    )}
                    %
                  </span>
                </div>

                <div
                  style={{
                    height: 16,
                    borderRadius: 999,
                    background:
                      "rgba(255,255,255,0.12)",
                    overflow: "hidden",
                  }}
                >

                  <div
                    style={{
                      width: `${
                        Math.min(
                          workout.level * 20,
                          100
                        )
                      }%`,
                      height: "100%",
                      borderRadius: 999,
                      background:
                        "linear-gradient(90deg,#bbf7d0,#22c55e)",
                      boxShadow:
                        "0 0 20px rgba(255,255,255,0.3)",
                    }}
                  />

                </div>

              </div>

              {/* FOOTER */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 1fr",
                  gap: 14,
                  marginTop: 22,
                  position: "relative",
                  zIndex: 2,
                }}
              >

                <div
                  style={{
                    background:
                      "rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    padding: 18,
                  }}
                >

                  <div
                    style={{
                      opacity: 0.7,
                      marginBottom: 6,
                      fontSize: 13,
                    }}
                  >
                    Mai jutalom
                  </div>

                  <div
                    style={{
                      fontSize: 26,
                      fontWeight: 900,
                    }}
                  >
                    +{workout.xp_reward} XP
                  </div>

                </div>

                <div
                  style={{
                    background:
                      "rgba(255,255,255,0.08)",
                    borderRadius: 20,
                    padding: 18,
                  }}
                >

                  <div
                    style={{
                      opacity: 0.7,
                      marginBottom: 6,
                      fontSize: 13,
                    }}
                  >
                    Edzés típus
                  </div>

                  <div
                    style={{
                      fontSize: 24,
                      fontWeight: 800,
                    }}
                  >
                    {workout.isBoss
                      ? "💀 Boss"
                      : "🔥 Normál"}
                  </div>

                </div>

              </div>

            </div>

            {/* BOSS ALERT */}

            {workout.isBoss && (

              <div
                style={{
                  marginTop: 18,
                  padding: 18,
                  borderRadius: 24,
                  background:
                    "linear-gradient(135deg,#ef4444,#7f1d1d)",
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: 20,
                  boxShadow:
                    "0 15px 40px rgba(239,68,68,0.25)",
                }}
              >
                💀 BOSS EDZÉS
              </div>

            )}

            {/* WORKOUT CARD */}

            <div
              style={{
                marginTop: 18,
                padding: 22,
                borderRadius: 28,
                background:
                  "rgba(30,41,59,0.92)",
                border:
                  "1px solid rgba(255,255,255,0.06)",
              }}
            >

              <h2
                style={{
                  marginTop: 0,
                  marginBottom: 24,
                  fontSize: 28,
                }}
              >
                {workout.title}
              </h2>

              {workout.exercises.map(
                (ex, i) => {

                  const done =
                    completed.includes(i);

                  return (

                    <div
                      key={i}
                      onClick={() =>
                        toggle(i)
                      }
                      style={{
                        padding:
                          "18px",
                        cursor:
                          "pointer",
                        fontSize:
                          "17px",
                        background:
                          done
                            ? "linear-gradient(135deg,#16a34a,#166534)"
                            : "rgba(255,255,255,0.03)",
                        borderRadius:
                          20,
                        marginBottom: 14,
                        transition:
                          "0.2s",
                        textDecoration:
                          done
                            ? "line-through"
                            : "none",
                        border:
                          done
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px solid rgba(255,255,255,0.04)",
                        display: "flex",
                        alignItems:
                          "center",
                        gap: 14,
                        fontWeight:
                          done
                            ? 700
                            : 500,
                      }}
                    >

                      <div
                        style={{
                          fontSize: 24,
                        }}
                      >
                        {done
                          ? "✅"
                          : "⬜"}
                      </div>

                      <div>
                        {ex}
                      </div>

                    </div>

                  );

                }
              )}

            </div>

            {/* FINISHED */}

            {finished && (

              <div
                style={{
                  marginTop: 18,
                  padding: 24,
                  borderRadius: 28,
                  background:
                    "linear-gradient(135deg,#22c55e,#16a34a)",
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: 26,
                  boxShadow:
                    "0 15px 40px rgba(34,197,94,0.25)",
                }}
              >
                🎉 Kész!
                <br />
                +{workout.xp_reward}
                XP
              </div>

            )}

            {/* BADGES */}

            {newBadges.length > 0 && (

              <div
                style={{
                  marginTop: 18,
                  padding: 24,
                  borderRadius: 28,
                  background:
                    "linear-gradient(135deg,#facc15,#eab308)",
                  color: "black",
                  textAlign: "center",
                }}
              >

                <div
                  style={{
                    fontWeight: 900,
                    fontSize: 24,
                    marginBottom: 14,
                  }}
                >
                  🏆 Új badge!
                </div>

                {newBadges.map(
                  (b, i) => (

                    <div
                      key={i}
                      style={{
                        marginBottom: 10,
                        fontWeight: 700,
                      }}
                    >
                      {b}
                    </div>

                  )
                )}

              </div>

            )}

            {/* NEW WORKOUT BUTTON */}

            <button
              onClick={fetchWorkout}
              style={{
                marginTop: 22,
                width: "100%",
                padding: "20px",
                borderRadius: 22,
                border: "none",
                background:
                  "linear-gradient(135deg,#22c55e,#16a34a)",
                color: "white",
                fontWeight: 900,
                fontSize: "18px",
                cursor: "pointer",
                boxShadow:
                  "0 15px 40px rgba(34,197,94,0.18)",
              }}
            >
              🔁 Új edzés
            </button>

          </>

        )}

      </div>

      {/* BOTTOM NAV */}

      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          maxWidth: "430px",
          background:
            "rgba(2,6,23,0.92)",
          backdropFilter:
            "blur(12px)",
          borderTop:
            "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent:
            "space-around",
          padding: "16px 0",
          color: "white",
        }}
      >

        <div
          onClick={() =>
            navigate("/dashboard")
          }
          style={{
            cursor: "pointer",
            fontSize: 28,
          }}
        >
          🏠
        </div>

        <div
          onClick={() =>
            navigate("/badges")
          }
          style={{
            cursor: "pointer",
            fontSize: 28,
          }}
        >
          🏆
        </div>

      </div>

    </div>

  );

}