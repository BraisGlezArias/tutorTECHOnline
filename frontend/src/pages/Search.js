import React, { useEffect, useReducer } from 'react';
import { useLocation } from 'react-router-dom';
import { useMatchMedia } from '../hooks/useMatchMedia';
import { getQuestions } from '../http/questionsService';
import { GetQuestions } from '../components/question/GetQuestions';
import { NotFound } from '../components/NotFound';
import { Tags } from '../components/Tags';
import { SearchBar } from '../components/SearchBar';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

import '../css/index.css'

function questionsReducer(state, action) {
    switch (action.type) {
        case 'GET_QUESTIONS_SUCCESS':
            return { ...state, questions: action.initialQuestions };
        default:
            return state;
    }
}

function useQuery() {
    return new URLSearchParams(useLocation().search);
}

export function Search() {
    const isMobile = useMatchMedia('(max-width:576px)');
    const query = useQuery();
    const [state, dispatch] = useReducer(questionsReducer, {
        questions: [],
    });

    const searchText = query.get('p');

    useEffect(() => {
        getQuestions().then(response =>
            dispatch({ type: 'GET_QUESTIONS_SUCCESS', initialQuestions: response.data.data })
            );
    }, []);

    const filteredQuestions = state.questions.filter(question => {
        const tag = question.tags.map(tag => tag.tag);
        const text = `${question.title} ${question.content} ${tag}`.trim();
        const filterText = text
            .toLowerCase()
            .includes(searchText.toLowerCase());
        
        return filterText;
    });

    return (
        <React.Fragment>
            <main id='Question'>

                <Header />
                <SearchBar />
                <section className='PageGroup'>

                    <Tags />
                    { filteredQuestions.length > 0 &&
                        <div className='question'>
                            <GetQuestions
                                questions={filteredQuestions}
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