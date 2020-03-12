import React, { useReducer, useEffect } from 'react';
import { getTags } from '../http/tagsService';

function tagsReducer(state, action) {

    switch (action.type) {
        case 'GET_TAGS_SUCCESS':
            return { ...state, tags: action.initialTags };
        default:
            return state;
    }
}

export function Tags() {
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
            <section className="links">
                            {tags.map((tag) => (
                                <React.Fragment>
                                    <a href={`/categorias/${tag.tag}`}>
                                        <img src={tag.image} width="100" alt="HTML"/>
                                    </a>
                                    <br />
                                </React.Fragment>
                            ))}
            </section>
        </React.Fragment>
    )
}