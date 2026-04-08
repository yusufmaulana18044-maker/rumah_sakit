import { supabase } from "../supabase";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
    } else {
      alert("Berhasil daftar!");
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <input placeholder="Email" onChange={(e)=>setEmail(e.target.value)} />
      <input type="password" onChange={(e)=>setPassword(e.target.value)} />
      <button onClick={register}>Daftar</button>
    </div>
  );
}