import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

import '../css/header.css';

export function Header() {

    const { isAuthenticated } = useAuth();

    return (
        <React.Fragment>
            <header className="header">
                <div className="header-img">
                    <Link to="/"><img src={require('../images/logoBlack.png')} width='350' height='70' alt="LOGO" /></Link>
                </div>
                <div className='general'>
                    <div className="header-item">
                        <Link to="/preguntas">
                            Foro
                        </Link>
                    </div>
                    <div className='header-item'>
                        <Link to='/usuarios'>
                            Usuarios
                        </Link>
                    </div>
                </div>
                {!isAuthenticated &&
                    <React.Fragment>
                        <div className='priv'>
                            <div className="header-reg">
                                <Link to="/register">
                                    Registrarse
                                </Link>
                            </div>
                            <div className="header-log">
                                <Link to='/login'>
                                    Entrar
                                </Link>
                            </div>
                        </div>
                    </React.Fragment>
                }
                {isAuthenticated &&
                    <React.Fragment>
                        <div className='priv'>
                            <div className="header-account">
                                <Link to='/myaccount'>
                                    Mi perfil
                                </Link>
                            </div>
                            <div className="header-quest">
                                <a id='more' href="/preguntar">
                                    Añadir pregunta
                                    <img src={require('../images/add-48.png')} width="50" alt="HTML"/>
                                </a>
                            </div>
                            <div className="header-logOut">
                                <h5 onClick={e => {
                                    localStorage.removeItem('currentUser');
                                    window.location.href = '/login';
                                }}
                                >
                                    Salir
                                </h5>
                            </div>
                        </div>
                    </React.Fragment>
                }
            </header>
        </React.Fragment>
    );
}
