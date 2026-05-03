import { useState } from "react";

export default function Questionnaire() {

  const [gender, setGender] =
    useState("Nő");

  const [age, setAge] =
    useState(29);

  const [weight, setWeight] =
    useState(78);

  const [height, setHeight] =
    useState(168);

  const [goal, setGoal] =
    useState("Fogyás");

  const [level, setLevel] =
    useState("Teljesen kezdő");

  const [weeklyDays, setWeeklyDays] =
    useState(3);

  const [minutes, setMinutes] =
    useState(20);

  function generatePlan() {

    console.log({
      gender,
      age,
      weight,
      height,
      goal,
      level,
      weeklyDays,
      minutes,
    });

    alert("Edzésterv generálva 🔥");
  }

  return (
    <div
      style={{
        marginTop: 40,
        background:
          "rgba(255,255,255,0.04)",
        borderRadius: 32,
        padding: 32,
        border:
          "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <h2
        style={{
          fontSize: 42,
          marginTop: 0,
          marginBottom: 12,
        }}
      >
        Kérdőív
      </h2>

      <p
        style={{
          color: "#94a3b8",
          lineHeight: 1.8,
          marginBottom: 30,
        }}
      >
        Add meg az alapadataid, és
        elkészítjük a személyre szabott
        heti terved.
      </p>

      <div
        style={{
          display: "grid",
          gap: 20,
        }}
      >
        {/* NEM */}
        <div>
          <label style={label}>
            Nem
          </label>

          <select
            value={gender}
            onChange={(e) =>
              setGender(e.target.value)
            }
            style={input}
          >
            <option>Nő</option>
            <option>Férfi</option>
          </select>
        </div>

        {/* ÉLETKOR */}
        <div>
          <label style={label}>
            Életkor
          </label>

          <input
            type="number"
            value={age}
            onChange={(e) =>
              setAge(e.target.value)
            }
            style={input}
          />
        </div>

        {/* TESTSÚLY */}
        <div>
          <label style={label}>
            Testsúly (kg)
          </label>

          <input
            type="number"
            value={weight}
            onChange={(e) =>
              setWeight(e.target.value)
            }
            style={input}
          />
        </div>

        {/* MAGASSÁG */}
        <div>
          <label style={label}>
            Magasság (cm)
          </label>

          <input
            type="number"
            value={height}
            onChange={(e) =>
              setHeight(e.target.value)
            }
            style={input}
          />
        </div>

        {/* CÉL */}
        <div>
          <label style={label}>
            Cél
          </label>

          <select
            value={goal}
            onChange={(e) =>
              setGoal(e.target.value)
            }
            style={input}
          >
            <option>Fogyás</option>
            <option>Izomépítés</option>
            <option>Egészség</option>
          </select>
        </div>

        {/* SZINT */}
        <div>
          <label style={label}>
            Szint
          </label>

          <select
            value={level}
            onChange={(e) =>
              setLevel(e.target.value)
            }
            style={input}
          >
            <option>
              Teljesen kezdő
            </option>

            <option>Kezdő</option>

            <option>Közepes</option>
          </select>
        </div>

        {/* HETI EDZÉS */}
        <div>
          <label style={label}>
            Heti edzésnapok
          </label>

          <input
            type="number"
            value={weeklyDays}
            onChange={(e) =>
              setWeeklyDays(
                e.target.value
              )
            }
            style={input}
          />
        </div>

        {/* IDŐ */}
        <div>
          <label style={label}>
            Edzésidő (perc)
          </label>

          <input
            type="number"
            value={minutes}
            onChange={(e) =>
              setMinutes(
                e.target.value
              )
            }
            style={input}
          />
        </div>

        <button
          onClick={generatePlan}
          style={button}
        >
          🔥 Edzésterv generálása
        </button>
      </div>
    </div>
  );
}

const label = {
  display: "block",
  marginBottom: 10,
  fontWeight: 700,
  fontSize: 18,
};

const input = {
  width: "100%",
  padding: 18,
  borderRadius: 20,
  border:
    "1px solid rgba(255,255,255,0.08)",
  background:
    "rgba(255,255,255,0.03)",
  color: "white",
  fontSize: 18,
  outline: "none",
  boxSizing: "border-box",
};

const button = {
  marginTop: 20,
  padding: "20px 24px",
  borderRadius: 22,
  border: "none",
  background:
    "linear-gradient(135deg,#22c55e,#14b8a6)",
  color: "white",
  fontWeight: 800,
  cursor: "pointer",
  fontSize: 18,
};