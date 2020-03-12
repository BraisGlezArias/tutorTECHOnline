import React, { useEffect, useReducer } from 'react';
import { useParams } from 'react-router-dom';
import { getUsers } from '../http/usersService';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SearchBar } from '../components/SearchBar';

import '../css/myaccount.css';

function usersReducer(state, action) {
    switch (action.type) {
        case 'GET_USERS':
            return { ...state, users: action.initialUsers };
        default:
            return state;
    }
}

export function Profile() {
    const { usuario } = useParams();
    const [state, dispatch] = useReducer(usersReducer, {
        users: []
    });

    useEffect(() => {
        getUsers().then(response => 
            dispatch({ type: 'GET_USERS', initialUsers: response.data.data })
        );
    }, []);

    console.log(state.users);

    const filterUsers = state.users.filter(user => {
        if (user.userName === usuario) {
            return true;
        }
    });

    const user = filterUsers[0];

    const rating = (user => {
        const filteredAnswers = user.answers.filter(answer => answer !== null);
    
        const array = filteredAnswers.map(answer => answer.rating);
    
        if (array.length !== 0) {
        const sum = array.reduce((previous, current) => current += previous);
        const avg = sum / array.length;
    
        return (Math.round(avg * 10)/10);
        }
    
        return 0;
      }); 
    
      const ratings = (user => {
        const filteredAnswers = user.answers.filter(answer => answer !== null);
    
        const array = filteredAnswers.map(answer => answer.ratings);
    
        if (array.length !== 0) {
        const sum = array.reduce((previous, current) => current += previous);
    
        return sum;
        }
    
        return 0;
      })

    return (
        <React.Fragment>
            <Header />  
                { user !== undefined &&
                <body className="userBody">
                    <section className='user-container'>
                        { user.avatarURL !== null &&
                        <img className="round" src={user.avatarURL} alt="profile photo" />
                        }
                        { user.avatarURL === null &&
                        <img className="round" src={require('../images/profile1.png')} alt="profile photo" />
                        }
                        <h3 className="userName">Nombre: {user.userName}</h3>
                        <h4 className="data">Correo electrónico: {user.email}</h4>
                        <h4 className="data">Rol: {user.role}</h4>
                        { user.role !== 'User' &&
                        <h4 className='data'>Rating: {rating(user)}/{ratings(user)}</h4>
                        }
                    </section>
                </body>
                }
            <Footer />
        </React.Fragment>
    )
}