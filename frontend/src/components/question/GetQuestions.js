import React, { useReducer, useEffect} from "react";
import { Link } from 'react-router-dom';
import { getUsers } from '../../http/usersService';

import '../../css/questions.css';

function questionsReducer(state, action) {
    switch (action.type) {
        case 'GET_USERS':
            return { ...state, users: action.users};
        default:
            return state;
    }
}

export function GetQuestions({ questions }) {
    const [state, dispatch] = useReducer(questionsReducer, {
        users: []
    })
    const users = state.users;
    const now = new Date().toISOString();

    useEffect(() => {
        getUsers().then(response => 
            dispatch({ type: 'GET_USERS', users: response.data.data})
            );
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0)
      }, [])

    const date = ((date1, date2) => {

        const newDate1 = new Date(date1);
        const newDate2 = new Date(date2);

        const diff = newDate2 - newDate1;

        if (diff > 864e5) {
            return `${Math.floor(diff/864e5)} días`
        }
        else if (diff > 36e5) {
            return `${Math.floor(diff/36e5)} horas`
        } 
        else if (diff > 60e3) {
            return `${Math.floor(diff/60e3)} minutos`
        }

        return `${Math.floor(diff/1e3)} segundos`;
    })

    const answers = (question => {
        const filteredAnswers = question.answers.filter(answer => answer !== null);

        return filteredAnswers;
    })

    const rating = (question => {

        const filteredAnswers = question.answers.filter(answer => answer !== null);

        const array = filteredAnswers.map(answer =>
            answer.rating);

        if (array.length !== 0) {
        const sum = array.reduce((previous, current) => current += previous);
        const avg = sum / array.length;

        return (Math.round(avg * 10)/10);
        }

        return 0;
    });

    const ratings = (question => {

        const filteredAnswers = question.answers.filter(answer => answer !== null);
        const array = filteredAnswers.map(answer => 
            answer.ratings);

        if (array.length !== 0) {
        const sum = array.reduce((previous, current) => current += previous);

        return sum;
        }

        return 0;
    })


    return (
        <div className='opacity-container'>
            <ul className='questions'>
                {questions.map((question) => (
                    users.map((user) => (
                        user.id === question.userId &&
                        <li key={question.id}>
                        <div className='container'>
                            <div style={{ minWidth: '35px' }}>
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
                                    <span className='date'>{question.createdAt.slice(0, -14)}</span>
                                    <span className='date'>{question.createdAt.slice(11, -5)}</span>
                                </div>
                                </div>
                            </div>
                            <div className='overflow-hidden'>
                                <h1 className='truncate-text-title'>
                                    <Link to={`/preguntas/${question.id}`}>
                                        {question.title}
                                    </Link>
                                </h1>
                            </div>
                            <div className="info">
                                <div>
                                    <h5>Categorías:</h5>
                                    {question.tags.map((tag) => (
                                        <button className='primary' key={tag.id}>
                                            <Link to={`/categorias/${tag.tag}`}>
                                                #{tag.tag}
                                            </Link>
                                        </button>
                                    ))}
                                </div>
                                <div>
                                    <span>Visitas: {question.visitCounter}</span>
                                    { question.answers.length === 0 &&
                                    <span>Sin respuestas</span>
                                    }
                                    { question.answers.length !== 0 && answers(question)[0] !== undefined &&
                                    <React.Fragment>
                                    <span>Respuestas: {answers(question).length}, última hace {date(answers(question)[0].createdAt, now)}</span>
                                    <span>Puntuación: {rating(question)}/{ratings(question)}</span>
                                    </React.Fragment>
                                    }
                                </div>
                            </div>
                        </div>
                    </li>
                    ))
                ))}
            </ul>
        </div>
    );
}