import { supabase } from "../supabase";
import { useState } from "react";

export default function login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    localStorage.setItem("user", JSON.stringify(data.user));

    if (email === "admin@gmail.com") {
      window.location.href = "/admin";
    } else {
      window.location.href = "/user";
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  );

  <h1 className="text-red-500">TAILWIND AKTIF</h1>

  const role = email === "admin@gmail.com" ? "admin" : "user";

localStorage.setItem("user", JSON.stringify(data.user));
localStorage.setItem("role", role);

window.location.href = "/dashboard";
}

