import React, { useEffect, useReducer } from 'react';
import { getQuestions } from '../../http/questionsService';
import { useMatchMedia } from '../../hooks/useMatchMedia';
import { GetQuestions } from '../../components/question/GetQuestions';
import { NotFound } from '../../components/NotFound';
import { Tags } from '../../components/Tags';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SearchBar } from '../../components/SearchBar';

import '../../css/index.css'

function questionsReducer(state, action) {

    switch (action.type) {
        case 'GET_QUESTIONS_SUCCESS':
            return { ...state, questions: action.initialQuestions };
        default:
            return state;
    }
}

export function QuestionsList() {
    const isMobile = useMatchMedia('(max-width:576px)');
    const [state, dispatch] = useReducer(questionsReducer, {
        questions: [],
    });

    useEffect(() => {
        getQuestions().then(response =>
            dispatch({ type: 'GET_QUESTIONS_SUCCESS', initialQuestions: response.data.data })
        );
    }, []);

    return (
        <React.Fragment>
            <main id="Question">

                <Header />
                <SearchBar />
                <section className='PageGroup'>
                    <Tags />
                    { state.questions !== null && state.questions.length !== 0 &&
                        <div className="question">
                            <GetQuestions
                                questions={state.questions}
                            />
                        </div>
                    }
                    { state.questions.length === 0 &&
                        <div className='question'>
                        <NotFound />
                        </div>
                    }
                </section>
                <Footer />
                
            </main>
        </React.Fragment>
    )
}