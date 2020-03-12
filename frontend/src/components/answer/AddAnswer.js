import React from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RHFInput } from 'react-hook-form-input';
import SimpleMDE from "react-simplemde-editor";
import { addAnswer } from '../../http/answersService';

import '../../css/form.css';

export function AddAnswer(id) {
    const history= useHistory();

    const {
        handleSubmit,
        register,
        errors,
        formState,
        setError,
        setValue
    } = useForm({
        mode: 'onBlur'
    });

    function handleAnswerQuestion (formData) {

        return addAnswer(id, formData)
            .then(() => {
                history.push('/');
                history.push(`/preguntas/${id.id}`);
            })
            .catch(() => {
                setError('content', 'bad request', 'Revisa que todo esté correcto')
            });
    };

    return (
        <React.Fragment>
            <div className='formulario'>
                <h3>Escribe una respuesta</h3>
                <form onSubmit={handleSubmit(handleAnswerQuestion)} noValidate>
                    <div 
                        className={`form-control ${
                            errors.title ? 'ko' : formState.touched.title && 'ok'
                        }`}
                    >
                        <RHFInput
                            as={<SimpleMDE/>}
                            rules={{ required: 'Debes poner una respuesta',
                                minLength: {
                                    message: 'Tu respuesta debería ser más extensa',
                                    value: 10
                                }
                            }}
                            name='content'
                            register={register}
                            setValue={setValue}
                        />
                        {errors.content && (
                            <span className='errorMessage'>{errors.content.message}</span>
                        )}
                    </div>
                    <button
                        type='submit'
                        className='btn'
                        disabled={formState.isSubmitting}
                    >
                        Responder
                    </button>
                </form>
            </div>
        </React.Fragment>
    );
}