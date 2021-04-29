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
                {props.docs && props.docs.docs && props.docs.docs.map((e,i) => {
                    let type = e.type.charAt(0) + e.type.toLowerCase().replace('_', ' ').slice(1);
                    return <Card key={i} className="m-3" style={{minWidth: 300, maxWidth: 347}}>
                            <Card.Title className="p-2">
                                {e.title}
                            </Card.Title>
                            {props.callback && 
                                <Card.Text className="pl-2">
                                    Type: {type} <br />
                                    Max points: {e.test_points} <br />
                                    <Button variant="primary" onClick={() => props.callback(e._id, e.title, type)}>{props.caption}</Button>
                                </Card.Text>
                            }
                            {!props.callback && e.students && e.students.length === 1 &&
                                <Card.Text className="pl-2">
                                    Type: {type} <br />
                                    {e.students[0].points
                                        ? <span>Points: {e.students[0].points}<br />Max points: {e.test_points}</span>
                                        : <span><br />Max points: {e.test_points} <br /></span>
                                    }
                                </Card.Text>
                            }
                            <Card.Footer>
                                <small className="text-muted">Teacher: {e.teacher.username}</small>
                            </Card.Footer>
                        </Card>
                })}
            </CardDeck>
            <Pagination className="justify-content-center">{items}</Pagination>
        </Container>
    )
}

export default TestDeck;
