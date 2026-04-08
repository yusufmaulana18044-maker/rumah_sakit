import { supabase } from "../supabase";
import { useState } from "react";

export default function User() {
  const [keluhan, setKeluhan] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const kirim = async () => {
    const { error } = await supabase.from("tiket").insert([
      {
        kode_tiket: "TKT-" + Math.floor(Math.random() * 10000),
        user_id: user.id,
        keluhan,
      },
    ]);

    if (error) {
      alert("Gagal kirim!");
      console.log(error);
    } else {
      alert("Tiket berhasil dikirim!");
      setKeluhan("");
    }
  };

  return (
    <div>
      <h2>Kirim Keluhan</h2>

      <textarea
        placeholder="Tulis keluhan..."
        value={keluhan}
        onChange={(e)=>setKeluhan(e.target.value)}
      />

      <br />

      <button onClick={kirim}>Kirim</button>
    </div>
  );
}