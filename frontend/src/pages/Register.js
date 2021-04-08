import React, { useState } from 'react'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import { useHistory } from 'react-router'
import axios from 'axios';

const Register = () => {

    const [userDetails, setUserDetails] = useState({});
    const history = useHistory();

    const handleChange = e => {
        setUserDetails({...userDetails, [e.target.name] : e.target.value });
      }
    
      const handleSubmit = e => {
        e.preventDefault();
    
        axios.post('http://localhost:5000/user/register', userDetails)
             .then((resp) => {
              history.push('/login');
              // window.location.reload();
             })
             .catch((err) => {
               console.log('err', err);
             })
      
      }


    return (
        <div>
            <Container style={{height: window.innerHeight, width: window.innerWidth}} className="d-flex justify-content-center align-items-center">
              <Form onChange={handleChange} onSubmit={handleSubmit} style={{width: 500}}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Username</Form.Label>
                  <Form.Control name="username" type="string" placeholder="Enter username" />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Enter password" />
                </Form.Group>

                <Form.Group controlId="formBasicRepeatPassword">
                    <Form.Label>Repeat Password</Form.Label>
                    <Form.Control name="repeat_password" type="password" placeholder="Repeat password" />
                </Form.Group>

                <Button variant="primary" type="submit">
                  Register
                </Button>
                <Button variant="link" onClick={() => history.push('/login')}>
                  Already have an account?
                </Button>
              </Form>
            </Container>
        </div>
    )
}

export default Register;
