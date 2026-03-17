import React from 'react';
import Lottie from 'lottie-react';
import error404Animation from '@/assets/animations/Error 404.json';
import { Link } from 'react-router-dom';
import './Error404Page.css';

const Error404Page = () => {
  return (
    <div className="error404-container">
      <div className="error404-content">
        <Lottie 
          animationData={error404Animation} 
          loop={true} 
          className="error404-animation"
        />
        <h1 className="error404-title">Página No Encontrada</h1>
        <p className="error404-message">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <Link to="/" className="error404-button">
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default Error404Page;
