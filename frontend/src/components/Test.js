import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import useWebSocket from 'react-use-websocket';

const Test = (props) => {

    const { test } = props;
    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [answers, setAnswers] = useState({});

    const [socketUrl, setSocketUrl] = useState('ws://127.0.0.1:43333');


    const {
        sendMessage,
        // sendJsonMessage,
        // lastMessage,
        lastJsonMessage,
        // readyState, // za loading ili tako nesto
        getWebSocket
    } = useWebSocket(socketUrl, {
        share: false,
        onOpen: () => {
            sendMessage('AppKeyDemo')
        },
        onClose: () => {
            console.log('websocket connection closed')
        },
        shouldReconnect: (closeEvent) => true // TODO CHECK
    })

    useEffect(() => {
      if (lastJsonMessage && lastJsonMessage.GazeX && lastJsonMessage.GazeY && question && question.question) {
        let temp = JSON.parse(JSON.stringify(answers));

        temp[temp.findIndex(q => q.question_id===question.question._id)].gaze_data.push({GazeX: lastJsonMessage.GazeX, GazeY: lastJsonMessage.GazeY});

        setAnswers(temp);
      }
    }, [lastJsonMessage, question]) // TRAZI ANSWERS U DEPENDECY-u ali mozda naci neku alternativu?
    
    useEffect(() => {
        console.log('component initialized')

        // OBAVLJA LI OVO SVOJ POSAO ILI SE SAMA KONEKCIJA ISKLJUCI POSLE TIMEOUT-a?
        return (() => {
            console.log('component destroyed')
            getWebSocket().close();
        })
    }, [getWebSocket]);

    useEffect(() => {
        if (test && test.questions && test.questions.length) {
            setLoading(false);
            setQuestion({
                no: 0,
                question: test.questions[0],
                length: test.questions.length
            });

            let temp_answers = [];

            test.questions.forEach((e, i) => {
                console.log(i, e);
                
                let temp_answer = {}
                temp_answer.question_id = e._id;
                temp_answer.answer = '';
                temp_answer.gaze_data = [];
                if (e.question_type === 'MULTIPLE_CHOICE') {
                    temp_answer.answer_id = undefined;
                }

                temp_answers.push(temp_answer);
            })

            setAnswers(temp_answers);

        } else {
            setError('Test does not have any questions. Please contact your teacher.')
        }
    }, [test]);

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

    const handleToggleChange = (e) => {
        console.log(e);
        for (let c = 0; c<question.question.answers.length; c++) {
            if (e.target.form[c].attributes.answer_id.value !== e.target.attributes.answer_id.value) {
                e.target.form[c].checked = false;
            }
        }

        let temp = JSON.parse(JSON.stringify(answers));
        temp[temp.findIndex(q => q.question_id === question.question._id)].answer_id = e.target.attributes.answer_id.value;
        temp[temp.findIndex(q => q.question_id === question.question._id)].answer = e.target.nextSibling.innerHTML;
        
        setAnswers(temp);

    }

    const handleTextareaChanged = (e) => {
        let temp = JSON.parse(JSON.stringify(answers));
        temp[temp.findIndex(q => q.question_id === question.question._id)].answer = e.target.value;
        
        setAnswers(temp);
    }

    const handleSubmitAnswers = () => {
        axios.post(`http://localhost:5000/test/${props.test._id}`, {answers: answers}, { headers: { Authorization: `Bearer ${props.token}` }})
             .then((resp) => {
                 let msg = 'Test successfully submitted. ';
                 if (resp.data.test.type === 'MULTIPLE_CHOICE')
                    msg += `You have received ${resp.data.points}/${resp.data.test.test_points} points!`;
                 
                 alert(msg);
                 window.location.reload();
             })
             .catch((err) => {
                console.log('err', err);
             })
    }

    return (
        <React.Fragment>
           {!loading
                ? error
                    ? <React.Fragment>
                        {error}
                      </React.Fragment>
                    : <div style={{
                        display: 'flex', 
                        width: window.innerWidth, 
                        height: window.innerHeight, 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        paddingTop: 125
                      }}>
                        <p style={{
                            position: 'absolute', 
                            left: 0, 
                            top: 0, 
                            marginLeft: 15, 
                            marginTop: 10, 
                            color: 'gray'
                        }}>
                            {props.test.title} • {props.test.type.toLowerCase().replace('_', ' ')} type • {props.test.teacher.username}
                        </p>
                        <h2>{question.no+1}/{question.length}</h2>
                        <h2>{question.question.question}</h2>
                            {question.question.question_type === "MULTIPLE_CHOICE"
                                ? <Form style={{marginTop: 50}}>
                                    <Form.Group controlId="formBasicCheckbox">
                                        {question.question.answers.map((e,i) => 
                                                <Form.Check 
                                                    checked={answers[answers.findIndex(q => q.question_id===question.question._id)].answer_id === e._id ? true : false} 
                                                    key={i} 
                                                    answer_id={e._id} 
                                                    type="checkbox" 
                                                    label={e.answer} 
                                                    onChange={handleToggleChange}
                                                />
                                        )}
                                    </Form.Group>
                                  </Form>
                                : <Form style={{marginTop: 50, width: 350}}>
                                    <Form.Group controlId="essay_anser">
                                        <Form.Control as="textarea" rows={3} value={answers[answers.findIndex(q => q.question_id===question.question._id)].answer} onChange={handleTextareaChanged}/>
                                    </Form.Group>
                                  </Form>
                            }
                        <Button variant="primary" onClick={handleSubmitAnswers} style={{position: 'absolute', right: 0, top: 0, marginTop: 10, marginRight: 10}}>Submit</Button>
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
