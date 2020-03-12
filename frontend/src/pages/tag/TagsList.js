import React, { useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import { useMatchMedia } from '../../hooks/useMatchMedia';
import { getTags } from '../../http/tagsService';
import { NotFound } from '../../components/NotFound';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { SearchBar } from '../../components/SearchBar';

import '../../css/index.css'


function tagsReducer(state, action) {

    switch (action.type) {
        case 'GET_TAGS_SUCCESS':
            return { ...state, tags: action.initialTags };
        default:
            return state;
    }
}

export function TagsList() {
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
            <main id="Tag">
                <Header />
                <SearchBar />
                <section className="MainpageGroup">

                { tags.length !== 0 && 
                    <div className="tag-list">
                        <ul class='tag-list p-t-md'>
                            {tags.map((tag) => (
                                <li>
                                        <Link className='tag-list-item' to={`/tags/${tag.tag}`}>
                                            {tag.tag}
                                        </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                }

                    { tags.length === 0 && 
                    <div className='tag-list'>
                    <NotFound />
                    </div>
                    }

                </section>
                <Footer />
            </main>
        </React.Fragment>
    )
}