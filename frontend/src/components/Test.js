import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const Test = (props) => {

    const { test } = props;
    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (test && test.questions && test.questions.length) {
            setLoading(false);
            setQuestion({
                no: 0,
                question: test.questions[0],
                length: test.questions.length
            });
        } else {
            setError('Test does not have any questions. Please contact your teacher.')
        }
    }, [test]);

    useEffect(() => {
        // TODO ADD CODE TO RECORD GAZE DATA
    }, [question]);

    const previous = () => {
        if (question.no !== 0) {
            setQuestion({
                ...question,
                question: test.questions[question.no-1],
                no : question.no - 1
            })
        }
    }

    const next = () => {
        if (question.no !== question.length - 1) {
            setQuestion({
                ...question,
                question: test.questions[question.no + 1],
                no : question.no + 1,
            })
        }
    }

    return (
        <React.Fragment>
           {!loading
                ? error
                    ? <React.Fragment>
                        {error}
                      </React.Fragment>
                    : <div style={{display: 'flex', width: window.innerWidth, height: window.innerHeight, flexDirection: 'column', alignItems: 'center', paddingTop: 150}}>
                        <p style={{position: 'absolute', left: 0, top: 0, marginLeft: 15, marginTop: 10, color: 'gray'}}>{props.test.title} • {props.test.type.toLowerCase().replace('_', ' ')} type • {props.test.teacher.username}</p>
                        <h2>{question.no+1}/{question.length}</h2>
                        <h2>{question.question.question}</h2>
                            {question.question.question_type === "MULTIPLE_CHOICE"
                                ? <Form style={{marginTop: 50}}>
                                    {question.question.answers.map((e,i) => 
                                        <Form.Group key={i} controlId="formBasicCheckbox">
                                            <Form.Check type="checkbox" label={e.answer} />
                                        </Form.Group>
                                    )}
                                  </Form>
                                : <Form style={{marginTop: 50, width: 350}}>
                                    <Form.Group controlId="essay_anser">
                                        <Form.Control as="textarea" rows={3} />
                                    </Form.Group>
                                  </Form>
                            }
                        <Button variant="primary" onClick={() => alert('TODO')} style={{position: 'absolute', right: 0, top: 0, marginTop: 10, marginRight: 10}}>Submit</Button>
                        <Button variant="outline-primary" onClick={() => props.setSelectedTest(null)} style={{position: 'absolute', right: 0, top: 0, marginTop: 10, marginRight: 95}}>Leave</Button>
                        <Button disabled={question.no === 0 ? true : false} onClick={previous} style={{position: 'absolute', left:0, top: '50%', height: 40, marginTop: -20, marginLeft: 10}}>←</Button>
                        <Button disabled={question.no === question.length - 1 ? true : false} onClick={next} style={{position: 'absolute', right:0, top: '50%', height: 40, marginTop: -20, marginRight: 10}}>→</Button>
                      </div>
                : <div style={{display: 'flex', height: window.innerHeight, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
            }
        </React.Fragment>
    )
}

export default Test
