import React, { useState, useEffect } from 'react';

import { Route, Switch, useHistory } from 'react-router-dom';

import axios from 'axios';
import { decodeToken } from 'react-jwt';

import Spinner from 'react-bootstrap/Spinner';

import NotFound from './pages/NotFound';
import Register from './pages/Register';
import Login from './pages/Login';
import Teacher from './pages/Teacher';
import Student from './pages/Student';

function App() {

  const [user, setUser] = useState({});
  const [token, setToken] = useState();
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    if (history.location.pathname === '/') {
      axios.post('http://localhost:5000/user/refresh', null, { withCredentials: true })
          .then((resp) => {
            setLoading(false);
            setUser((({_id, username, role}) => ({_id, username, role}))(decodeToken(resp.data.accessToken)));
          })
          .catch((err) => {
            setLoading(false);
            console.log('redirecting to login');
            history.push('/login');
          })
    }
  }, [history]);

  const handleLogout = () => {
    axios.post('http://localhost:5000/user/logout', null, { withCredentials: true })
         .then((resp) => {
          setToken(null);
          history.push('/login');
         })
         .catch((err) => {
           console.log('err', err);
         })
  }

  return (
    <React.Fragment>
      <Switch>
        <Route exact path="/">
          <React.Fragment>
            {loading 
              ? <div style={{display: 'flex', height: window.innerHeight, justifyContent: 'center', alignItems: 'center'}}>
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </div>
              : user.role === 'teacher'
                ? <Teacher user={user} token={token} setToken={setToken} logout={handleLogout} />
                : <Student user={user} token={token} setToken={setToken} logout={handleLogout} /> 
            }
          </React.Fragment>
        </Route>
        <Route exact path="/login">
          <Login setToken={setToken} setUser={setUser} setLoading={setLoading} />
        </Route>
        <Route exact path="/register" component={Register}/>
        <Route component={NotFound} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
