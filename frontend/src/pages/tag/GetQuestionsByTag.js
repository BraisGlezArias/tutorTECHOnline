import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { getQuestions } from '../../http/questionsService';
import { getTag } from '../../http/tagsService';
import { useMatchMedia } from '../../hooks/useMatchMedia';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { NotFound } from '../../components/NotFound';
import { Tags } from '../../components/Tags';
import { SearchBar } from '../../components/SearchBar';
import { GetQuestions } from '../../components/question/GetQuestions';

import '../../css/index.css'

function tagsReducer(state, action) {

    switch (action.type) {
        case 'GET_QUESTIONS_SUCCESS':
            return { ...state, questions: action.initialQuestions };
        case 'GET_TAG':
            return { ...state, tag: action.tag };
        default:
            return state;
    }
}

export function GetQuestionsByTag() {
    const isMobile = useMatchMedia('(max-width:576px)');
    const { tag } = useParams();
    const [state, dispatch] = useReducer(tagsReducer, {
        questions: [],
        tag: null,
    });

    useEffect(() => {
        getQuestions().then(response => 
            dispatch({ type: 'GET_QUESTIONS_SUCCESS', initialQuestions: response.data.data })
            );
    }, []);

    useEffect(() => {
        getTag(tag).then(response =>
            dispatch({ type: 'GET_TAG', tag: response.data }))
        
    })

    const filteredQuestions = state.questions.filter(question => {
        if (state.tag !== null) {
            if (question.tags.some(tag => tag.tag === state.tag.tag)) {
                return true;
            }
        }
    });

    return (
        <React.Fragment>
            <main id="Tag">
                <Header/>
                <SearchBar />
                <section className="PageGroup">

                    <Tags />

                    { state.tag !== null &&  filteredQuestions.length !== 0 &&
                        <div className='question'>
                            <GetQuestions
                                questions={ filteredQuestions }
                            />
                        </div>
                    }

                    { filteredQuestions.length === 0 && 
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