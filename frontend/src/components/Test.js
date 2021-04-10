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


    // CHECK 

    const previous = () => {
        if (question.no !== 0) {
            setQuestion({
                ...question,
                question: test.questions[question.no-1],
                no : question.no - 1
            })
        }
    }

    // CHECK

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
                        <h2>{question.no+1}/{question.length}</h2>
                        <h2>{question.question.question}</h2>
                        {question.question.question_type === "MULTIPLE_CHOICE"
                            ? <ol style={{marginTop: 50}}>
                                {question.question.answers.map((e,i) => 
                                    <li key={i}>{e.answer}</li>
                                )}
                             </ol>
                            : <Form style={{marginTop: 50, width: 350}}>
                                <Form.Group controlId="essay_anser">
                                    <Form.Control as="textarea" rows={3} />
                                </Form.Group>
                            </Form>
                        }
                        <Button disabled={question.no === 0 ? true : false} onClick={previous} style={{position: 'absolute', left:0, top: '50%', height: 40, marginTop: -20}}>←</Button>
                        <Button disabled={question.no === question.length - 1 ? true : false} onClick={next} style={{position: 'absolute', right:0, top: '50%', height: 40, marginTop: -20}}>→</Button>
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
