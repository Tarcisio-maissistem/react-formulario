import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    // clients = firebaseDb.child("clients").once("value", function (snapshot) {
    //   let arr = [];
    //   snapshot.forEach(function (childSnapshot) {
    //     arr.push(childSnapshot.val());
    //   });
    //   setClients(arr);
    //   console.log(arr);
    // });
  }, []);

  return (
    <div>
      <h1>Dashboard Mais Sistem</h1>

      <p>
        <Link to="users">&gt;&gt; Lista de Usuários</Link>
      </p>
      <p>
        <Link to="clients">&gt;&gt; Lista de Clientes</Link>
      </p>
    </div>
  );
}

export { Home };
