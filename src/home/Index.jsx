import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>React + Formik - Exemplo de CRUD</h1>
            <p>Um aplicativo de exemplo que mostra como listar, adicionar, editar e excluir registros de usuários com React e Formik.</p>
            <p><Link to="users">&gt;&gt; Gerenciar usuários</Link></p>
        </div>
    );
}

export { Home };