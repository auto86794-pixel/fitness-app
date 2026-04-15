import { useEffect, useMemo, useState } from "react";
import supabase from "./supabaseClient";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const WATER_GOAL = 2000;
const CALORIES_GOAL = 1800;

export default function FitnessDashboard() {
  const [water, setWater] = useState("");
  const [calories, setCalories] = useState("");
  const [message, setMessage] = useState("");
  const [chartData, setChartData] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
    loadHistory();
  }, []);

  const loadData = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    const { data } = await supabase
      .from("daily_stats")
      .select("*")
      .eq("user_id", user.id)
      .eq("date", today)
      .maybeSingle();

    if (data) {
      setWater(data.water?.toString() || "");
      setCalories(data.calories?.toString() || "");
    }
  };

  const loadHistory = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("daily_stats")
      .select("date, water, calories")
      .eq("user_id", user.id)
      .order("date", { ascending: true });

    setChartData(data || []);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("Mentés...");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    await supabase.from("daily_stats").upsert(
      [
        {
          user_id: user.id,
          date: today,
          water: Number(water || 0),
          calories: Number(calories || 0),
        },
      ],
      { onConflict: "user_id,date" }
    );

    setSaving(false);
    setMessage("Mentve! 💾");
    loadHistory();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const waterPercent = useMemo(
    () => Math.min((Number(water || 0) / WATER_GOAL) * 100, 100),
    [water]
  );

  const caloriesPercent = useMemo(
    () => Math.min((Number(calories || 0) / CALORIES_GOAL) * 100, 100),
    [calories]
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">

        {/* BAL OLDAL */}
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/10">
          <h1 className="text-2xl font-bold mb-4">💪 Dashboard</h1>

          <input
            type="number"
            placeholder="💧 Víz (ml)"
            value={water}
            onChange={(e) => setWater(e.target.value)}
            className="w-full mb-3 p-3 rounded-xl bg-slate-900 border border-white/10 focus:ring-2 focus:ring-emerald-400 outline-none"
          />

          <input
            type="number"
            placeholder="🔥 Kalória"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="w-full mb-4 p-3 rounded-xl bg-slate-900 border border-white/10 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-emerald-500 py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition"
          >
            {saving ? "Mentés..." : "Mentés"}
          </button>

          <button
            onClick={handleLogout}
            className="w-full mt-3 bg-red-500 py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition"
          >
            Kilépés
          </button>

          <p className="text-center mt-3 text-sm text-gray-300">{message}</p>

          {/* PROGRESS */}
          <div className="mt-6">
            <p className="text-sm">💧 Víz: {water || 0}/{WATER_GOAL}</p>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-sky-400 transition-all duration-500"
                style={{ width: `${waterPercent}%` }}
              />
            </div>

            <p className="text-sm">🔥 Kalória: {calories || 0}/{CALORIES_GOAL}</p>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-400 transition-all duration-500"
                style={{ width: `${caloriesPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* JOBB OLDAL */}
        <div className="bg-white/5 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/10">
          <h2 className="text-xl font-semibold mb-4">📊 Statisztika</h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid stroke="#334155" />
                <XAxis
                  dataKey="date"
                  stroke="#94a3b8"
                  tickFormatter={(d) => d?.slice(5)}
                />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="water"
                  stroke="#38bdf8"
                  strokeWidth={3}
                />
                <Line
                  type="monotone"
                  dataKey="calories"
                  stroke="#fb923c"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* LISTA */}
          <div className="mt-6 space-y-2">
            {chartData.slice().reverse().map((item, i) => (
              <div
                key={i}
                className="flex justify-between bg-slate-900 p-3 rounded-xl text-sm hover:bg-slate-800 transition"
              >
                <span>{item.date?.slice(5)}</span>
                <span>💧 {item.water} | 🔥 {item.calories}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}