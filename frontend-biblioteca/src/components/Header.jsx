import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    // Array simples para o menu de cadastro
    const menuItens = [
        { name: 'Gêneros', path: '/cadastro/generos' },
        { name: 'Autores', path: '/cadastro/autores' },
        { name: 'Livros', path: '/cadastro/livros' },
    ];

    return (
        <header className="header-container">
            <div className="header-brand">
                <Link to="/" className="header-link-brand">
                    Livraria API
                </Link>
            </div>
            <nav>
                <ul className="header-nav-list">
                    <li className="header-nav-item">
                        <Link to="/livros" className="header-link">
                            Ver Livros
                        </Link>
                    </li>
                    <li className="header-nav-item dropdown">
                        <span className="header-link dropdown-toggle">Cadastro</span>
                        <ul className="dropdown-menu">
                            {menuItens.map(item => (
                                <li key={item.name} className="dropdown-item">
                                    <Link to={item.path} className="dropdown-link">
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;