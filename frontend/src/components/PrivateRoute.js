import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../context/auth-context';


export function PrivateRoute({ children, /* expert, */ ...others }) {
    // const { expert } = useAuth();
    const { isAuthenticated } = useAuth();


  //   return (
  //     <React.fragment>
  //       <Route {...others}>
  //         {allowedRoles.includes(expert) ?  children : <Redirect to="/login" />}
  //       </Route>
  //     </React.fragment>
  //     );
  //  }
  
  return (
    <React.Fragment>
      {isAuthenticated ? (
        <Route {...others}>{children}</Route>
      ) : (
        <Redirect to="/login" />
      )}
    </React.Fragment>
  );
}