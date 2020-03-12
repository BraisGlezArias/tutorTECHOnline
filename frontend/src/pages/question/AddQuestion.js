import React, { useEffect, useReducer, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RHFInput } from 'react-hook-form-input';
import Select from 'react-select';
import SimpleMDE from "react-simplemde-editor";
import { useMatchMedia } from '../../hooks/useMatchMedia';
import { getTags } from '../../http/tagsService';
import { addQuestion } from '../../http/questionsService';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

import '../../css/questions.css';
import "easymde/dist/easymde.min.css";

function questionsReducer(state, action) {
    switch (action.type) {
        case 'GET_TAGS_SUCCESS':
            return { ...state, tags: action.initialTags };
        default:
            return state;
    }
}

export function AddQuestion() {
    const isMobile = useMatchMedia('(max-width:576px)');
    const history = useHistory();
    const [state, dispatch] = useReducer(questionsReducer, {
        tags: []
    });

    useEffect(() => {
        getTags().then(response =>
            dispatch({ type: 'GET_TAGS_SUCCESS', initialTags: response.data.data })
        );
    }, []);

    const tags = state.tags

    const {
        handleSubmit,
        register,
        errors,
        formState,
        setError,
        setValue,
    } = useForm({
        mode: 'onBlur'
    });

    const colourStyles = {
        control: styles => ({ ...styles, backgroundColor: '#1c3041', border: "2px solid #67ece7" }),
        option: (styles, { isFocused }) => {
            return {
                ...styles,
                backgroundColor: isFocused ? 'black' : 'white',
                color: isFocused ? 'white' : 'black',
            };
        },
    };

    function handleAddQuestion(formData) {

        return addQuestion(formData)
            .then(() => {
                history.push('/preguntas')
            })
            .catch(() => {
                setValue('tags', '');
                setError('tags', 'bad request', 'Revisa que todo esté correcto');
            });
    };

    return (
        <React.Fragment>
            <main id="Question">

                <Header />

                        <div className='formulario'>
                            <h3>Haz tu pregunta</h3>
                            <form onSubmit={handleSubmit(handleAddQuestion)} noValidate>
                                <div
                                    className={`form-control ${
                                        errors.title ? 'ko' : formState.touched.title && 'ok'
                                        }`}
                                >
                                    <h2>Título</h2>
                                    <input
                                        ref={register({
                                            required: 'Es necesario que tu pregunta tenga un título',
                                            minLength: {
                                                message: 'Tu título debe ser más largo',
                                                value: 6,
                                            }
                                        })}
                                        name='title'
                                        type='text'
                                        placeholder='Escribe aquí el título de tu pregunta...'
                                    />
                                    {errors.title && (
                                        <span className='errorMessage'>{errors.title.message}</span>
                                    )}
                                </div>
                                <div
                                    className={`form.control ${
                                        errors.content ? 'ko' : formState.touched.content && 'ok'
                                        }`}
                                >
                                    <h2>Contenido</h2>
                                    <RHFInput
                                        as={<SimpleMDE/>}
                                        rules={{ required: 'Debes explicar cuál es tu problema',
                                            minLength: {
                                                message: "Introduce al menos una frase corta",
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
                                <div
                                    className={`form.control ${
                                        errors.tags ? 'ko' : formState.touched.tags && 'ok'
                                        }`}
                                >
                                    <h2>Tags</h2>
                                    <RHFInput
                                        as={<Select
                                            isMulti
                                            isSearchable
                                            placeholder='Elige uno o varios tags'
                                            options={tags}
                                            styles={colourStyles}
                                            maxMenuHeight={180}
                                        />}
                                        rules={{ required: 'Elige al menos un tag' }}
                                        name='tags'
                                        register={register}
                                        setValue={setValue}
                                    />
                                    {errors.tags && (
                                        <span className='errorMessage'>{errors.tags.message}</span>
                                    )}
                                </div>
                                <button
                                    type='submit'
                                    className='btn'
                                    disabled={formState.isSubmitting}
                                >
                                    Publicar
                                </button>
                            </form>
                        </div>

                <Footer />

            </main>
        </React.Fragment>
    )
}