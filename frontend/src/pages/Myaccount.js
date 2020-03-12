import React, { useEffect, useReducer } from "react";
import { useAuth } from "../context/auth-context";
import { getUsers } from "../http/usersService";
import { User } from "../components/User";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";

import "../css/myaccount.css";

function usersReducer(state, action) {
  switch (action.type) {
    case "GET_USERS":
      return { ...state, users: action.initialUsers };
    default:
      return state;
  }
}

export function MyAccount() {
  const [state, dispatch] = useReducer(usersReducer, {
    users: []
  });
  const { currentUser } = useAuth();

  useEffect(() => {
    getUsers().then(response =>
      dispatch({ type: "GET_USERS", initialUsers: response.data.data })
    );
  }, []);

  const filterUsers = state.users.filter(user => {
    if (user.id === currentUser.userId) {
      return true;
    }
  });

  const filteredUser = filterUsers[0];

  return (
    <React.Fragment>
      <main id="user">
        <Header />

        {filteredUser !== undefined && (
          <div className="userData">
            <User user={filteredUser} />
          </div>
        )}

        <Footer />
      </main>
    </React.Fragment>
  );
}