import { useState } from "react";
import supabase from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Hiba: " + error.message);
    } else {
      navigate("/dashboard");
    }
  };

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Hiba: " + error.message);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a, #1e293b)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          padding: "30px",
          width: "300px",
          color: "white",
          boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
        }}
      >
        <h2 style={{ textAlign: "center" }}>🎉 HomeFit Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            marginBottom: "10px",
            background: "#1e293b",
            color: "white",
          }}
        />

        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            marginBottom: "10px",
            background: "#1e293b",
            color: "white",
          }}
        />

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#22c55e",
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          Belépés
        </button>

        <button
          onClick={handleRegister}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            border: "none",
            background: "#3b82f6",
            color: "white",
            fontWeight: "bold",
            marginTop: "10px",
            cursor: "pointer",
          }}
        >
          Regisztráció
        </button>
      </div>
    </div>
  );
}