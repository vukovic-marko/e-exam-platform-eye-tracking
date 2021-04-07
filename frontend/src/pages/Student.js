import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Container from 'react-bootstrap/Container';

const Student = (props) => {

    const [docs, setDocs] = useState([]);

    const { setToken } = props;
    const history = useHistory();


    useEffect(() => {
        const interval = setInterval(() => {
            axios.post('http://localhost:5000/user/refresh', null, { withCredentials: true })
                 .then((resp) => {
                    setToken(resp.data.accessToken);
                 })
                 .catch((err) => {
                    console.log('redirecting to login');
                    history.push('/login');
                 })
        }, 5000);
        return () => { 
            clearInterval(interval);
        }
      }, [history, setToken]);

    useEffect(() => {
        console.log('getting tests')

        axios.post('http://localhost:5000/user/refresh', null, { withCredentials: true })
                 .then((resp) => {
                    setToken(resp.data.accessToken);
                    axios.get('http://localhost:5000/test?page=1&limit=15', { headers: { Authorization: `Bearer ${resp.data.accessToken}` }})
                         .then((resp) => {
                            setDocs(resp.data.docs);
                         })
                         .catch((err) => {
                            console.log('err', err);
                         })
                 })
                 .catch((err) => {
                    console.log('redirecting to login');
                    history.push('/login');
                 })

    }, [history, setToken])


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
        <React.Fragment>
            <Container>
                Student's Page <br />
                Hi, {props.user.username}! <br />
                <Button onClick={handleLogout}>Logout</Button>
                <CardDeck>
                {docs.map((e,i) => 
                    <Card key={i}>
                        <Card.Title>
                            {e.title}
                        </Card.Title>
                        <Card.Text>
                            Type: {e.type} <br />
                            Max points: {e.test_points}
                        </Card.Text>
                        <Card.Footer>
                            <small className="text-muted">Teacher: {e.teacher.username}</small>
                        </Card.Footer>
                    </Card>
                )}
                </CardDeck>
            </Container>
        </React.Fragment>
    )
}

export default Student
