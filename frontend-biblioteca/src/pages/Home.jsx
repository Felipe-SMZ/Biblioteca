import React from 'react';

// URL de exemplo do Unsplash (substitua pela sua imagem preferida)
const UNSPLASH_IMAGE_URL = 'https://images.unsplash.com/photo-1535905557558-afc4877a26fc?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const Home = () => {
    return (
        <div className="home-container">
            <div className="home-content">
                <h2 className="home-title">Bem-vindo(a) à Biblioteca</h2>
                <p className="home-subtitle">
                    Seu portal de gestão e consulta de livros, autores e gêneros.
                </p>
                <button className="home-button">
                    <a href="/livros">Explorar o Catálogo</a>
                </button>
            </div>

            <div className="home-image-wrapper">
                <img
                    src={UNSPLASH_IMAGE_URL}
                    alt="Pilha de livros antigos em uma biblioteca"
                    className="home-image"
                />
            </div>
        </div>
    );
};

export default Home;