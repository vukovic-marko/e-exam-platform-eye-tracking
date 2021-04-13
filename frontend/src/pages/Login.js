import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Alert from 'react-bootstrap/ALert'
import Form from 'react-bootstrap/Form'
import { useHistory } from 'react-router'
import { decodeToken } from 'react-jwt';
import axios from 'axios';

const Register = (props) => {

    const [userDetails, setUserDetails] = useState({});
    const [errorDetails, setErrorDetails] = useState(null);
    const history = useHistory();

    const handleChange = e => {
        setUserDetails({...userDetails, [e.target.name] : e.target.value });
      }
    
      const handleSubmit = e => {
        e.preventDefault();

        setErrorDetails(null);
    
        axios.post('http://localhost:5000/user/login', userDetails, { withCredentials: true })
             .then((resp) => {
                props.setToken(resp.data.accessToken);
                props.setUser((({_id, username, role}) => ({_id, username, role}))(decodeToken(resp.data.accessToken)));
                props.setLoading(false);
                history.push('/');
             })
             .catch((err) => {
              
              let temp = [];

              console.log(err.response.data)

              Object.entries(err.response.data.message).forEach(([k,v]) => {
                if (v.message) {
                  temp.push(v.message);
                }
              })

              if (!temp.length) {
                temp.push(err.response.data.message);
              }

               setErrorDetails(temp);
               props.setLoading(false);
             })
      
      }

      return (
        <div> 
            <Container style={{height: window.innerHeight, width: window.innerWidth}} className="d-flex justify-content-center align-items-center">
              <div style={{position: 'relative', display: 'flex', alignItems: 'flex-end'}}>
                <Form onChange={handleChange} onSubmit={handleSubmit} style={{width: 500}}>
                  {errorDetails && 
                    <Alert variant="danger" style={{position: 'absolute', top: -100, width: 500, margin: 0}}>
                      {
                        errorDetails.map(item => <React.Fragment>{item}<br /></React.Fragment>)
                      }
                    </Alert>
                  }
                  <Form.Group controlId="formBasicEmail">
                    <Form.Label>Username</Form.Label>
                    <Form.Control name="username" type="string" placeholder="Enter username" />
                  </Form.Group>
                  <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Enter password" />
                  </Form.Group>
                  <Button variant="primary" type="submit">
                    Log in
                  </Button>
                  <Button variant="link" onClick={() => history.push('/register')}>
                    Don't have an account?
                  </Button>
                </Form>
              </div>
            </Container>
          </div>
    )
}

export default Register;
