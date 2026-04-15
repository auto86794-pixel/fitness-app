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
      navigate("/dashboard"); // 🔥 átirányítás
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
      navigate("/dashboard"); // 🔥 átirányítás
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>HomeFit Login 🎉</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Jelszó"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={handleLogin}>Belépés</button>
      <button onClick={handleRegister}>Regisztráció</button>
    </div>
  );
}