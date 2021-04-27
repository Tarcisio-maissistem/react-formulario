import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import firebaseDb from "../_helpers/firebase";
import "firebase/database";
import swal from "sweetalert";

import { clientService } from "@/_services";

function List({ match }) {
  const { path } = match;
  const [clients, setClients] = useState(null);

  // CRIANDO LISTA DE CLIENTES INICIAL
  useEffect(() => {
    firebaseDb.child("clients").on("value", function (dataSnapshot) {
      const allClients = [];
      dataSnapshot.forEach(function (childSnapshot) {
        allClients.push(childSnapshot.val());
      });
      setClients(allClients);
    });

    // Antigo
    //clientService.getAll().then((x) => setClients(x));
  }, []);
  //console.log(JSON.stringify(clientService));

  function deleteClient(id) {
    swal({
      title: "tem certeza?",
      text: "Você irá remover esse cadastro",
      icon: "warning",
      buttons: ["Não!", "Sim!"],
      dangerMode: true,
    }).then(function (isConfirm) {
      if (isConfirm) {
        firebaseDb.child(`clients/${id}`).remove((err) => {
          if (err) console.log(err);
          else 
          swal("Removido!", "", "success");
        });
      } else {
        swal("Cancelado!", "seu arquivo está seguro!", "error");
      }
    });
  }

  return (
    <div>
      <h1>Clientes</h1>
      <Link to={`${path}/add`} className="btn btn-sm btn-success mb-2">
        Adicionar Cliente
      </Link>
      <table className="table table-hover table-sm table-striped">
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Nome</th>
            <th style={{ width: "20%" }}>CPF/CNPJ</th>
            <th style={{ width: "20%" }}>Contato</th>
            <th style={{ width: "15%" }}>Telefone</th>
            <th style={{ width: "10%" }}>Validade</th>
            <th style={{ width: "5%" }}>Opções</th>
          </tr>
        </thead>
        <tbody>
          {clients &&
            clients.map((client) => (
              <tr key={client.cpfcnpj}>
                <td>{client.fantasia}</td>
                <td>{client.cpfcnpj}</td>
                <td>{client.contato}</td>
                <td>{client.telefone}</td>
                <td>{client.validade}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <Link
                    to={`${path}/edit/${client.cpfcnpj}`}
                    className="btn btn-sm btn-primary mr-1"
                  >
                    Editar
                  </Link>

                  <button
                    onClick={() => deleteClient(client.cpfcnpj)}
                    className="btn btn-sm btn-danger btn-delete-client"
                    disabled={client.isDeleting}
                  >
                    {client.isDeleting ? (
                      <span className="spinner-border spinner-border-sm"></span>
                    ) : (
                      <span>Excluir</span>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          {!clients && (
            <tr>
              <td colSpan="4" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          )}
          {clients && !clients.length && (
            <tr>
              <td colSpan="4" className="text-center">
                <div className="p-2">Nenhum Cliente para exibir</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export { List };
