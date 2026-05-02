import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) alert(error.message);
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) alert(error.message);
      else alert("Check your email!");
    }
  };

  return (
    <div style={{ color: "white", textAlign: "center" }}>
      <h2>{isLogin ? "Login" : "Register"}</h2>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ margin: 5 }}
      />

      <br />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ margin: 5 }}
      />

      <br />

      <button onClick={handleAuth}>
        {isLogin ? "Login" : "Register"}
      </button>

      <p
        onClick={() => setIsLogin(!isLogin)}
        style={{ cursor: "pointer", marginTop: 10 }}
      >
        {isLogin ? "No account? Register" : "Already have account? Login"}
      </p>
    </div>
  );
}