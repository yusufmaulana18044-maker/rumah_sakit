import { supabase } from "../supabase";
import { useEffect, useState } from "react";

export default function Admin() {
  const [tiket, setTiket] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    let { data, error } = await supabase
      .from("tiket")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    } else {
      setTiket(data);
    }
  };

  return (
    <div>
      <h2>Dashboard Admin</h2>

      <p>Total Tiket: {tiket.length}</p>

      {tiket.map((t) => (
        <div key={t.id} style={{border:"1px solid black", margin:"10px", padding:"10px"}}>
          <p><b>Kode:</b> {t.kode_tiket}</p>
          <p><b>Keluhan:</b> {t.keluhan}</p>
          <p><b>Status:</b> {t.status}</p>
          <p><b>Waktu:</b> {t.created_at}</p>
        </div>
      ))}
    </div>
  );
}