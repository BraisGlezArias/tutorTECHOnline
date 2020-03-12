import React, { useState, useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import marked from 'marked';
import { useAuth } from '../../context/auth-context';
import { getUser, getUsers } from '../../http/usersService';
import { AddRating } from '../rating/AddRating';

import '../../css/questions.css';

function questionsReducer(state, action) {
    switch (action.type) {
        case 'GET_USER':
            return { ...state, user: action.user};
        case 'GET_USERS':
            return { ...state, users: action.users};
        default:
            return state;
    }
}

export function GetQuestion({ question, onDeleteTags, onDeleteQuestion, onDeleteAnswer }) {
    const [state, dispatch] = useReducer(questionsReducer, {
        user: null,
        users: []
    })
    const user = state.user;
    const users = state.users;
    const [answers, setAnswers] = useState(question.answers);
    const { currentUser } = useAuth();
    
    useEffect(() => {
        getUser(question.userId).then(response =>
            dispatch({ type: 'GET_USER', user: response.data})
            );
    }, []);

    useEffect(() => {
        getUsers().then(response => 
            dispatch({ type: 'GET_USERS', users: response.data.data})
            );
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    function  getMarkdownText(text) {
        var rawMarkup = marked(text, {sanitize: true});
        return { __html: rawMarkup };
    }

    return (
        <div className='questions'>
            <div className='container'>
                
                { user !== null &&
                    <React.Fragment>
                    <div className='info'>
                        <h5>Categorías:</h5>
                    { question.tags.map((tag) => (
                        tag !== null && 
                        <button className='primary' key={tag.id}>
                            <Link to={`/categorias/${tag.tag}`}>
                                #{tag.tag}
                            </Link>
                        </button>
                    ))}
                    </div>
                    <div className='info'>
                        <div>
                            { user.avatarURL !== null &&
                            <img className="round" src={user.avatarURL} alt="profile photo" />
                            }
                            { user.avatarURL === null &&
                            <img className="round" src={require('../../images/profile1.png')} alt="profile photo" />
                            }
                            <a href={`/usuarios/${user.userName}`}>{user.userName}</a>
                        </div>
                        <div>
                            <span className='date'>{question.createdAt.slice(0, -14)}</span>
                            <span className='date'>{question.createdAt.slice(11, -5)}</span>
                        </div>
                    </div>
                    <h5 className='text-title'>
                        {question.title}
                    </h5>
                    <p className='overflow-hidden' dangerouslySetInnerHTML={getMarkdownText(question.content)} />
                    { currentUser !== null && currentUser.userId === question.userId &&
                        <div id='edit'>
                            <button onClick={e => {
                                e.preventDefault();
                                onDeleteTags(question.id);
                                }}
                            >
                                <Link to={`/preguntas/${question.id}/editar`}>
                                    Editar
                                </Link>
                            </button>
                            <button onClick={e => {
                                e.preventDefault();
                                onDeleteQuestion(question.id);
                                }}
                            >
                                <Link to={`/preguntas`}>
                                    Borrar
                                </Link>
                            </button>
                        </div>
                    }
                    {answers !== undefined && answers.map((answer) => (
                        answer !== null && users.map((user) => (
                            user.id === answer.userId &&
                        <React.Fragment>
                            <hr className='line'></hr>
                            <div className='info'>
                            <div>
                                { user.avatarURL !== null &&
                                <img className="round" src={user.avatarURL} alt="profile photo" />
                                }
                                { user.avatarURL === null &&
                                <img className="round" src={require('../../images/profile1.png')} alt="profile photo" />
                                }
                                <a href={`/usuarios/${user.userName}`}>{user.userName}</a>
                            </div>
                            <div>
                                <span className='date'>{answer.createdAt.slice(0, -14)}</span>
                                <span className='date'>{answer.createdAt.slice(11, -5)}</span>
                            </div>
                            </div>
                            <p className='overflow-hidden1' dangerouslySetInnerHTML={getMarkdownText(answer.answer)} />
                            { currentUser !== null && currentUser.userId === answer.userId &&
                                <div id='edit'>
                                    <button>
                                        <Link to={`/preguntas/${question.id}/respuestas/${answer.id}/editar`}>
                                           Editar
                                        </Link>
                                    </button>
                                    <button 
                                        onClick={e => {
                                        e.preventDefault();
                                        onDeleteAnswer(question.id, answer.id);
                                        setAnswers();              
                                        }}
                                    >
                                        <Link to={`/preguntas/${question.id}`}>
                                            Borrar
                                        </Link>
                                    </button>
                                </div>
                            }
                            <AddRating
                                rating={answer.rating}
                                aId={answer.id}
                                aUId={answer.userId}
                                qId={question.id}
                            />
                        </React.Fragment>
                        ))
                    ))}
                </React.Fragment>
                }
            </div>
        </div>
    )
}