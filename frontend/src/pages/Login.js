import React from 'react';
import { Link, useHistory, Redirect } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { logIn } from '../http/authService';
import { useAuth } from '../context/auth-context';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

import '../css/form.css';

export function Login() {

    const {
        handleSubmit,
        register,
        errors,
        watch,
        formState,
        setError,
        setValue,
        reset
    } = useForm({
        mode: 'onBlur'
    });

    const { isAuthenticated, setIsAuthenticated, setCurrentUser } = useAuth();
    const history = useHistory();

    const handleLogin = formData => {
        return logIn(formData)
            .then(response => {
                setIsAuthenticated(true);
                setCurrentUser(response.data);
                history.push('/');
            })
            .catch(error => {

                setValue('password', '');
                setError('password', 'credentials', 'Revisa tu e-mail y/o contraseña');

        });
    };

    return (
            <main className="centered-container">
                <Header />
                { !isAuthenticated &&
                <div className='formulario'>
                <h3>Iniciar Sesión</h3>
                <form onSubmit={handleSubmit(handleLogin)} noValidate>
                    <div
                        className={`form-control ${
                            errors.email ? 'ko' : formState.touched.email && 'ok'
                            }`}
                    >
                        <label>Correo Electrónico</label>
                        <input
                            ref={register({
                                required: 'Tu correo electrónico es obligatorio',
                                pattern: {
                                    value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                    message: 'Tu correo electrónico no es válido'
                                }
                            })}
                            name="email"
                            type="email"
                            placeholder="Introduce tu correo electrónico"
                        ></input>
                        {errors.email && (
                            <span className="errorMessage">{errors.email.message}</span>
                        )}
                    </div>
                    <div
                        className={`form-control ${
                            errors.password ? 'ko' : formState.touched.password && 'ok'
                            }`}
                    >
                        <label>Contraseña</label>
                        <input
                            ref={register({
                                required: 'Tu contraseña es obligatoria',
                                minLength: {
                                    value: 6,
                                    message: 'Debes introducir una contraseña con al menos 8 caracteres'
                                }
                            })}
                            name="password"
                            type="password"
                            placeholder="Por favor, introduce tu contraseña"
                        ></input>
                        {errors.password && (
                            <span className="errorMessage">{errors.password.message}</span>
                        )}
                    </div>
                    <div className="btn-container">
                        <button
                            type="submit"
                            className="btn"
                            disabled={formState.isSubmitting}
                        >
                            Entrar
                            </button>
                        <div className="m-t-lg">
                            <Link to="/register">¿No tienes una cuenta? Regístrate haciendo click <strong>aquí</strong></Link>
                        </div>
                    </div>
                </form>
                </div>
                }
                
               { isAuthenticated &&
                    
                    <Redirect to='/' />
                    
                }

                <Footer />
            </main>
    );
}