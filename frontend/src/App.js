import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { QuestionsList } from './pages/question/QuestionsList';
import { Question } from './pages/question/Question';
import { AddQuestion } from './pages/question/AddQuestion';
import { UpdateQuestion } from './pages/question/UpdateQuestion';
import { UpdateAnswer } from './pages/answer/UpdateAnswer';
import { GetQuestionsByTag } from './pages/tag/GetQuestionsByTag';
import { Frontpage } from './pages/Frontpage';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Contact } from './pages/Contact';
import { AboutUs } from './pages/AboutUs';
import { MyAccount } from './pages/Myaccount';
import { Users } from './pages/Users';
import { Profile } from './pages/Profile';
import { Search } from './pages/Search';
import { AuthProvider } from './context/auth-context';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Switch>
          <Route exact path='/'>
            <Frontpage />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/register'>
            <Register />
          </Route>
          <Route path='/buscar'>
            <Search />
          </Route>
          <Route path='/preguntar'>
            <AddQuestion />
          </Route>
          <Route exact path="/preguntas">
            <QuestionsList />
          </Route>
          <Route exact path='/preguntas/:id'>
            <Question />
          </Route>
          <Route path='/preguntas/:id/editar'>
            <UpdateQuestion />
          </Route>
          <Route path='/preguntas/:qId/respuestas/:aId/editar'>
            <UpdateAnswer />
          </Route>
          <Route exact path='/usuarios'>
            <Users />
          </Route>
          <Route path='/usuarios/:usuario'>
            <Profile />
          </Route>
          <Route path='/categorias/:tag'>
            <GetQuestionsByTag />
          </Route>
          <Route path='/contact'>
            <Contact />
          </Route>
          <Route path='/aboutUs'>
            <AboutUs />
          </Route>
          <PrivateRoute path='/myaccount'>
            <MyAccount />
          </PrivateRoute>

        </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
