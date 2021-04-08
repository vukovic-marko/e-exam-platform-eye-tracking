import React from 'react';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Pagination from 'react-bootstrap/Pagination';
import Button from 'react-bootstrap/Button';

const TestDeck = (props) => {

    let items = [];

    for (let number = 1; number <= props.docs.totalPages; number++) {
        items.push(
          <Pagination.Item key={number} active={number === props.docs.page} onClick={() => props.loadTests(props.token, number)}>
            {number}
          </Pagination.Item>,
        );
    }

    return (
        <Container>
            <CardDeck>
                {props.docs && props.docs.docs && props.docs.docs.map((e,i) => 
                    <Card key={i} className="m-3" style={{minWidth: 300}}>
                        <Card.Title className="p-2">
                            {e.title}
                        </Card.Title>
                        <Card.Text className="pl-2">
                            Type: {e.type} <br />
                            Max points: {e.test_points} <br />
                            <Button variant="primary" onClick={() => props.callback(e._id)}>{props.caption}</Button>
                        </Card.Text>
                        <Card.Footer>
                            <small className="text-muted">Teacher: {e.teacher.username}</small>
                        </Card.Footer>
                    </Card>
                )}
            </CardDeck>
            <Pagination className="justify-content-center">{items}</Pagination>
        </Container>
    )
}

export default TestDeck;
