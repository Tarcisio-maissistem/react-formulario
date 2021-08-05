import React from 'react';
import { NavLink } from 'react-router-dom';

function Nav() {
    return (
        <nav className="navbar navbar-expand navbar-dark bg-primary">
            <div className="navbar-nav">
                <NavLink exact to="/" className="nav-item nav-link">Home</NavLink>
                <NavLink to="/users" className="nav-item nav-link">Usuários</NavLink>
                <NavLink to="/clients" className="nav-item nav-link">Clientes</NavLink>
                <NavLink to="/autentication" className="nav-item nav-link">Autenticação</NavLink>
            </div>
        </nav>
    );
}

export { Nav };