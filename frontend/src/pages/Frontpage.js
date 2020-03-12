import React, { useReducer, useEffect } from 'react';
import { getTags } from '../http/tagsService';
import { Header } from '../components/Header';
import { useMatchMedia } from '../hooks/useMatchMedia';
import { Footer } from '../components/Footer';
import { SearchBar } from '../components/SearchBar';

function tagsReducer(state, action) {

    switch (action.type) {
        case 'GET_TAGS_SUCCESS':
            return { ...state, tags: action.initialTags };
        default:
            return state;
    }
}

export function Frontpage() {
    const isMobile = useMatchMedia('(max-width:576px)');
    const [state, dispatch] = useReducer(tagsReducer, {
        tags: [],
    });

    useEffect(() => {
        getTags().then(response =>
            dispatch({ type: 'GET_TAGS_SUCCESS', initialTags: response.data.data })
        );
    }, []);

    const tags = state.tags;

return (
    <React.Fragment>
        <main className="Mainpage">

            <Header />

            <section className="MainpageGroup">
                <h1>Resuelve tus dudas sobre programación</h1>
                <p>Quiero saber más acerca de...</p>
                <section className="logolinks">
                            {tags.map((tag) => (
                                    <a href={`/categorias/${tag.tag}`}>
                                        <img src={tag.image} width="100" alt="HTML"/>
                                    </a>
                            ))}
                </section>
            </section>

            <SearchBar />

            <Footer />
        </main>
    </React.Fragment>
    )
}