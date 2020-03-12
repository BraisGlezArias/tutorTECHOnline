import React, { useEffect, useReducer } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RHFInput } from 'react-hook-form-input';
import Select from 'react-select';
import SimpleMDE from "react-simplemde-editor";
import { 
    getQuestion, 
    updateQuestion 
} from '../../http/questionsService';
import { getTags } from '../../http/tagsService';
import { useMatchMedia } from '../../hooks/useMatchMedia';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

import '../../css/index.css';
import "easymde/dist/easymde.min.css";

function questionsReducer(state, action) {
    switch (action.type) {
        case 'GET_TAGS_SUCCESS':
            return { ...state, tags: action.initialTags };
        case 'GET_QUESTION':
            return { ...state, question: action.question };
        default:
            return state;
    }
}

export function UpdateQuestion() {
    const isMobile = useMatchMedia('(max-width:576px)');
    const history = useHistory();
    const { id } = useParams();
    const [state, dispatch] = useReducer(questionsReducer, {
        tags: [],
        question: null,
    });

    useEffect(() => {
        getTags().then(response =>
            dispatch({ type: 'GET_TAGS_SUCCESS', initialTags: response.data.data })
        );
    }, []);

    useEffect(() => {
        getQuestion(id).then(response =>
            dispatch({ type: 'GET_QUESTION', question: response.data })
            );
    }, []);

    const tags = state.tags;
    const question = state.question;

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

    function handleUpdateQuestion (formData) {

        return updateQuestion(question.id, formData)
            .then(() => {
                history.push(`/preguntas/${question.id}`)
            })
            .catch(() => {
                setValue('tags', `${question.tags}`);
                setError('tags', 'bad request', 'Revisa que todo esté correcto');
            });
    };

    return (
        <React.Fragment>
            <main id="Question">

                <Header/>
                
                    { question !== null &&
                        <div className='formulario'>
                            <h3>Modifica tu pregunta</h3>
                            <form onSubmit={handleSubmit(handleUpdateQuestion)} noValidate>
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
                                        defaultValue={question.title}
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
                                        as={<SimpleMDE />}
                                        rules={{ required: 'Debes modificar tu pregunta',
                                            minLength: {
                                                message: "Introduce al menos una frase corta",
                                                value: 10
                                            }
                                        }}
                                        name='content'
                                        value={question.content}
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
                                                options = {tags}
                                                styles={colourStyles} 
                                                maxMenuHeight={180}
                                            />
                                        }
                                        rules={{ required: 'Elige al menos un tag' }}
                                        name='tags'
                                        register= {register} 
                                        setValue= {setValue}
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
                    }
                   
                <Footer />

            </main>
        </React.Fragment>
    )
}