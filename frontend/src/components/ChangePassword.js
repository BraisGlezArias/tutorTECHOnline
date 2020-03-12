import React from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../context/auth-context';
import { changePassword } from '../http/authService';

export function ChangePassword() {
    const history = useHistory();
    const { currentUser } = useAuth();

    const {
        handleSubmit,
        register,
        errors,
        formState,
        setValue,
        setError
    } = useForm({
        mode: 'onBlur'
    });

    const handlePassword = formData => {
        formData.userId = currentUser.userId;

        console.log(formData);
        return changePassword(formData)
            .then(() => {
                history.push('/');
                history.push('/myaccount');
            })
            .catch(error => {
                setValue('password', '');
                setValue('newPassword', '');
                setValue('confirmedNewPassword', '');
                setError('confirmedNewPassword', 'bad request', 'Revisa tu contenido');
        });
    };


    return (
        <React.Fragment>
            <form className='formulario' onSubmit={handleSubmit(handlePassword)} noValidate>
                <div
                    className={`form-control ${
                        errors.password ? 'ko' : formState.touched.password && 'ok'
                    }`}
                >
                    <h4>Pon tu contraseña actual</h4>
                    <input
                        ref={register({
                            required: 'Tu contraseña actual es obligatoria',
                            minLength: {
                                value: 6,
                                message: 'Debes introducir una contraseña con al menos 8 caracteres'
                            }
                        })}
                        name='password'
                        type='password'
                        placeholder='Tu contraseña actual'
                    />
                    {errors.password && (
                        <span className='errorMessage'>{errors.password.message}</span>
                    )}
                </div>
                <div
                    className={`form-control ${
                        errors.newPassword ? 'ko' : formState.touched.newPassword && 'ok'
                    }`}
                >
                    <h4>Elige una nueva contraseña:</h4>
                    <input
                        ref={register({
                            required: 'Debes introducir una nueva contraseña',
                            minLength: {
                                value: 6,
                                message: 'Tu nueva contraseña debe ser más larga'
                            }
                        })}
                        name="newPassword"
                        type="password"
                        placeholder="Tu nueva contraseña"
                        ></input>
                        {errors.newPassword && (
                            <span className="errorMessage">{errors.newPassword.message}</span>
                        )}
                </div>
                <div
                    className={`form-control ${
                        errors.confirmedNewPassword ? 'ko' : formState.touched.confirmedNewPassword && 'ok'
                    }`}
                >
                    <h4>Confirma tu nueva contraseña:</h4>
                    <input
                        ref={register({
                            required: 'Confirma tu nueva contraseña',
                            minLength: {
                                value: 6,
                                message: 'Tu nueva contraseña debe ser más larga'
                            }
                        })}
                        name="confirmedNewPassword"
                        type="password"
                        placeholder="Tu nueva contraseña"
                        ></input>
                        {errors.confirmedNewPassword && (
                            <span className="errorMessage">{errors.confirmedNewPassword.message}</span>
                        )}
                </div>
                <button type="submit" className="primary">Cambiar contraseña</button>
            </form>
        </React.Fragment>
    )
}