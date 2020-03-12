import React, { useReducer, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { RHFInput } from 'react-hook-form-input';
import SimpleMDE from 'react-simplemde-editor';
import { updateAnswer } from '../../http/answersService';
import { getQuestion } from '../../http/questionsService';
import { useMatchMedia } from '../../hooks/useMatchMedia';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

import '../../css/index.css';
import "easymde/dist/easymde.min.css";


function answersReducer(state, action) {
    switch (action.type) {
        case 'GET_QUESTION':
            return { ...state, question: action.question };
        default:
            return state;
        }
}

export function UpdateAnswer() {
    const isMobile = useMatchMedia('(max-width:576px)');
    const history=useHistory();
    const { qId, aId } = useParams()

    const [ state, dispatch ] = useReducer(answersReducer, {
        question: null,
    })

    useEffect(() => {
        getQuestion(qId).then(response =>
            dispatch({ type: 'GET_QUESTION', question: response.data })
        );
    }, []);

    const question = state.question;

    const answer = (question === null) ? 'respuesta' : question.answers.filter(answer =>
        (answer === null) ? false : answer.questionId === qId);

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
    
    function handleUpdateAnswer (formData) {

        return updateAnswer(question.id, aId, formData)
            .then(() => {
                history.push('/');
                history.push(`preguntas/${question.id}`);
            })
            .catch(() => {
                setError('content', 'bad request', 'Revisa que todo esté correcto');
            });
    };

    return (
        <React.Fragment>
            <main id="Question">

                <Header/>
                
                    <div className='formulario'>
                        <h3>Modifica tu respuesta</h3>
                        <form onSubmit={handleSubmit(handleUpdateAnswer)} noValidate>
                            <div 
                                className={`form-control ${
                                    errors.content ? 'ko' : formState.touched.content && 'ok'
                                }`}
                            >
                                <RHFInput
                                    as={<SimpleMDE />}
                                    rules={{ required: 'Debes modificar tu respuesta',
                                        minLength: {
                                            message: 'Introduce al menos una frase corta',
                                            value: 10
                                        }
                                    }}
                                    name='content'
                                    value={answer[0].answer}
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
                                Actualizar tu respuesta
                            </button>
                        </form>
                    </div>
                   
                <Footer />

            </main>
        </React.Fragment>
    )
}