import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import {
    getQuestion,
    getQuestions,
    deleteTagsFromQuestion,
    deleteQuestion
} from '../../http/questionsService';
import { deleteAnswer } from '../../http/answersService';
import { useAuth } from '../../context/auth-context';
import { useMatchMedia } from '../../hooks/useMatchMedia';
import { GetQuestion } from '../../components/question/GetQuestion';
import { AddAnswer } from '../../components/answer/AddAnswer';
import { Tags } from '../../components/Tags';
import { SearchBar } from '../../components/SearchBar';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';

import '../../css/index.css'

function questionsReducer(state, action) {

    switch (action.type) {
        case 'GET_QUESTIONS_SUCCESS':
            return { ...state, questions: action.initialQuestions };
        case 'GET_QUESTION':
            return { ...state, question: action.question };
        case 'DELETE_TAGS':
            return { ...state, questions: state.questions.filter(q => q.id === action.id) };
        case 'DELETE_QUESTION':
            return { ...state, questions: state.questions.filter(q => q.id === action.id) };
        case 'DELETE_ANSWER':
            return { ...state, answer: action.id};    
        default:
            return state;
    }
}

export function Question() {
    const isMobile = useMatchMedia('(max-width:576px)');
    const { id } = useParams();
    const { currentUser } = useAuth(); 
    const [state, dispatch] = useReducer(questionsReducer, {
        questions: [],
        question: null,
        answer: null,
    })

    const question = state.question;

    useEffect(() => {
        getQuestions().then(response =>
            dispatch({ type: 'GET_QUESTIONS_SUCCESS', initialQuestions: response.data.data })
        );
    }, []);

    useEffect(() => {
        getQuestion(id).then(response =>
            dispatch({ type: 'GET_QUESTION', question: response.data })
            );
    }, []);

    const handleDeleteTags = () => {
        deleteTagsFromQuestion(id).then(() => {
          dispatch({ type: 'DELETE_TAGS', id });
        });
      };

    const handleDeleteQuestion = () => {
        deleteQuestion(id).then(() => {
            dispatch({ type: 'DELETE_QUESTION', id });
        });
    };

    const handleDeleteAnswer = (qId, aId) => {
        deleteAnswer(qId, aId).then(() => {
            dispatch({ type: 'DELETE_ANSWER', aId });
        })
    }

    return (
        <React.Fragment>
            <main id='Question'>
                <Header />

                <SearchBar />
                <section className='PageGroup'>

                    <Tags />
                    <div className="question">
                    { state.question !== null &&
                        <React.Fragment>

                                <GetQuestion
                                    question={question}
                                    onDeleteTags={id => handleDeleteTags(id)}
                                    onDeleteQuestion={id => handleDeleteQuestion(id)}
                                    onDeleteAnswer={(qId, aId) => handleDeleteAnswer(qId, aId)}
                                />

                            { currentUser !== null && currentUser.role !== 'User' && currentUser.userId !== question.userId &&
                                    <AddAnswer 
                                        id={id}
                                    />
                            }
                        </React.Fragment>
                    }
                    </div>

                </section>
                <Footer />
            </main>
        </React.Fragment>
    )
}