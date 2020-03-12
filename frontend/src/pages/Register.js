import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useHistory } from 'react-router-dom';
import { signUp } from '../http/authService';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

import '../css/form.css';

export function Register() {
  const { register, errors, formState, handleSubmit, setError } = useForm({
    mode: 'onBlur'
  });
  const history = useHistory();

   const handleRegister = formData => {
    console.log(formData);
    return signUp(formData)
      .then(response => {
        // setRole(jwt_decode(response.data.token))
        history.push('/');
      })
      .catch(error => {
        if (error.response.status === 409) {
          setError('email', 'conflict', 'Ya existe una cuenta creada con este correo');
        }
      });
  }; 


  return (
    <main className="centered-container">
      <Header />
      <div className='formulario'>
      <h3>Regístrate</h3>
      <form onSubmit={handleSubmit(handleRegister)} noValidate>
        <div
          className={`form-control ${
            errors.username ? 'ko' : formState.touched.username && 'ok'
          }`}
        >
          <label>Nombre de Usuario</label>
          <input
            ref={register({
              required: 'Es obligatorio tener un nombre'
            })}
            name="username"
            type="text"
            placeholder="Tu nombre"
          ></input>
          {errors.username && (
            <span className="errorMessage">{errors.username.message}</span>
          )}
        </div>
        <div
          className={`form-control ${
            errors.email ? 'ko' : formState.touched.email && 'ok'
          }`}
        >
          <label>Correo electrónico</label>
          <input
            ref={register({
              required: 'Necesitamos saber tu correo electrónico para crearte una cuenta',
              pattern: {
                message: 'Por favor, introduce una dirección de correo electrónico válida',
                value: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              }
            })}
            name="email"
            type="email"
            placeholder="Aquí, tu email"
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
              required: 'Es obligatorio que cuentes con una contraseña',
              minLength: {
                message: 'Tu contraseña debe tener más de 6 caracteres',
                value: 6
              }
            })}
            name="password"
            type="password"
            placeholder="Escribe aquí tu contraseña"
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
            Quiero registrarme
          </button>
          <div className="m-t-lg">
            <Link to="/login">¿Ya tienes una cuenta? Puedes <strong>iniciar sesión</strong> haciendo click <strong>aquí</strong></Link>
          </div>
        </div>
      </form>
      </div>
      <Footer />
    </main>
  );
}
