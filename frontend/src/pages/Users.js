import React, { useEffect, useReducer } from 'react';
import { getUsers } from '../http/usersService';
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { SearchBar } from '../components/SearchBar';

import '../css/users.css'

function usersReducer(state, action) {
    switch (action.type) {
      case "GET_USERS":
        return { ...state, users: action.initialUsers };
      default:
        return state;
    }
  }

  export function Users() {
        const [state, dispatch] = useReducer(usersReducer, {
          users: []
        });

        useEffect(() => {
          getUsers().then(response => 
            dispatch({ type: 'GET_USERS', initialUsers: response.data.data })
            );
        }, []);

        const users = state.users.filter(user => {
            if (user.role === 'User') {
                return true;
            }
        });

        const experts = state.users.filter(user => {
            if (user.role === 'Expert') {
                return true;
            }
        });

        return (
            <React.Fragment>
                <main id='user'>
                    <Header />
                    <div className='users'>
                        <h1>Users</h1>
                        <ul className='usuarios'>
                            {users.map((user) => (
                                <li key={user.id}>
                                    <div className='user'>
                                    { user.avatarURL !== null &&
                                    <img className="round" src={user.avatarURL} width='180' height='180' alt="profile photo" />
                                    }
                                    { user.avatarURL === null &&
                                    <img className="round" src={require('../images/profile1.png')} width='180' height='180' alt="profile photo" />
                                    }
                                    <a href={`/usuarios/${user.userName}`}>{user.userName}</a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <h1>Experts</h1>
                        <ul className='expertos'>
                            {experts.map((expert) => (
                                <li key={expert.id}>
                                    <div className='expert'>
                                    { expert.avatarURL !== null &&
                                    <img className="round" src={expert.avatarURL} width='180' height='180' alt="profile photo" />
                                    }
                                    { expert.avatarURL === null &&
                                    <img className="round" src={require('../images/profile1.png')} width='180' height='180' alt="profile photo" />
                                    }
                                    <a href={`/usuarios/${expert.userName}`}>{expert.userName}</a>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <Footer />
                </main>
            </React.Fragment>
        )
  }