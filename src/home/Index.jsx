import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebaseDb from "../_helpers/firebase";

function Home() {
  const [qtdclients, setQtdclients] = useState([]);

  useEffect(() => {
    firebaseDb
      .firestore()
      .collection("clients")
      .get()
      .then(function (querySnapshot) {
        setQtdclients(querySnapshot.size);
      });
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <p>
        <Link to="users">&gt;&gt; Lista de Usuários</Link>
      </p>
      <p>
        <Link to="clients">&gt;&gt; Lista de Clientes </Link>
      </p>
      <label>{"Quantidade de Clientes " + qtdclients}</label>
      {/* <p>
        <Link to="Autenticação">&gt;&gt; Autenticação </Link>
      </p> */}
    </div>
  );
}

export { Home };
