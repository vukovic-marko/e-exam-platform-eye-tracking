import React, { useEffect, useState } from 'react'
import Button from 'react-bootstrap/Button'
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Container from 'react-bootstrap/Container';
import Pagination from 'react-bootstrap/Pagination';
import NavigationBar from '../components/NavigationBar';

const Student = (props) => {

    const [docs, setDocs] = useState({});

    const { token, setToken } = props;
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
                    loadTests(resp.data.accessToken, 1);
                 })
                 .catch((err) => {
                    console.log('redirecting to login');
                    history.push('/login');
                 })

    }, [history, setToken]);

    const loadTests = (token, page) => {
        axios.get(`http://localhost:5000/test?page=${page}&limit=9`, { headers: { Authorization: `Bearer ${token}` }})
             .then((resp) => {
                setDocs(d => ({...d, docs: resp.data.docs, page: resp.data.page, totalPages: resp.data.totalPages}));
             })
             .catch((err) => {
                console.log('err', err);
             })
    }
    
    let items = [];

    for (let number = 1; number <= docs.totalPages; number++) {
        items.push(
          <Pagination.Item key={number} active={number === docs.page} onClick={() => loadTests(token, number)}>
            {number}
          </Pagination.Item>,
        );
    }

    return (
        <React.Fragment>
            <NavigationBar username={props.user.username} logout={props.logout} />
            <Container>
                <CardDeck>
                    {docs && docs.docs && docs.docs.map((e,i) => 
                        <Card key={i} className="m-3" style={{minWidth: 300}}>
                            <Card.Title className="p-2">
                                {e.title}
                            </Card.Title>
                            <Card.Text className="pl-2">
                                Type: {e.type} <br />
                                Max points: {e.test_points} <br />
                                <Button variant="primary">Take Test</Button>
                            </Card.Text>
                            <Card.Footer>
                                <small className="text-muted">Teacher: {e.teacher.username}</small>
                            </Card.Footer>
                        </Card>
                    )}
                </CardDeck>
                <Pagination className="justify-content-center">{items}</Pagination>
            </Container>
        </React.Fragment>
    )
}

export default Student
