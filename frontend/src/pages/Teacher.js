import React from 'react'
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router-dom'
import axios from 'axios';

const Teacher = (props) => {

    const history = useHistory();

    const handleLogout = () => {
        axios.post('http://localhost:5000/user/logout', null, { withCredentials: true })
             .then((resp) => {
              props.setToken(null);
              history.push('/login');
             })
             .catch((err) => {
               console.log('err', err);
             })
    }

    return (
        <div>
            Teacher's Page <br />
            Hi, {props.user.username}! <br />
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    )
}

export default Teacher
