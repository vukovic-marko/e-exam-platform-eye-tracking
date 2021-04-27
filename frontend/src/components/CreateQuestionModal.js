import React, { useState, useEffect } from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const MODE_CREATE = "CREATE";
const MODE_EDIT = "EDIT";

const CreateQuestionModal = (props) => {

    const [question, setQuestion] = useState({
        question: '',
        type: "ESSAY",
        answers: undefined,
        points: undefined
    });

    const { mode } = props;

    useEffect(() => {
        if (props.question && props.question.question) {
            setQuestion({
                question: props.question.question.question,
                type: props.question.question.type,
                answers: props.question.question.answers,
                points: props.question.question.points
            })
        }
        
    }, [props.question])
  
    const handleClose = () => {
        // setQuestion(null); // TODO: CHECK
        props.setShowModal(false);
    }

    const handleChange = e => {

        if (e.target.name === "answer") {         
            
            let temp = JSON.parse(JSON.stringify(question.answers));

            if (e.target.attributes.subname.value === "answer") {
                temp[e.target.attributes.idx.value].answer = e.target.value;
            } else if (e.target.attributes.subname.value === "correct") {
                temp[e.target.attributes.idx.value].correct = e.target.checked;
            }

            setQuestion({
                ...question,
                answers: temp
            })

        } else if (e.target.name === "type") {
            if (e.target.value === "MULTIPLE_CHOICE") {
                setQuestion({
                    ...question,
                    [e.target.name] : e.target.value,
                    answers: [{
                        answer: '',
                        correct: false
                    }]
                })
            } else if (e.target.value === "ESSAY") {
                setQuestion({
                    ...question,
                    [e.target.name] : e.target.value,
                    answers: undefined
                })
            }
        } else {
            setQuestion({
                ...question,
                [e.target.name] : e.target.value
            })
        } 
    }

    const handleCreate = () => {
        if (mode === MODE_CREATE) {
            props.addQuestion(question);        
        } else if (mode === MODE_EDIT) {
            props.addQuestion(question, props.question.no);
        }
    }

    const handleAddAnswer = () => {
        setQuestion({
            ...question,
            answers: [
                ...question.answers,
                {
                    answer: "",
                    correct: false
                }
            ]
        })
    }

    return (
      <React.Fragment>  
        <Modal show={props.showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
                {mode === MODE_CREATE && <span>New Question</span>}
                {mode === MODE_EDIT && <span>Edit Question</span>}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onChange={handleChange}>
                <Form.Group controlId="formQuestion">
                    <Form.Label>Question</Form.Label>
                    {mode === MODE_CREATE && <Form.Control as="textarea" rows={3} name="question" />}
                    {mode === MODE_EDIT && <Form.Control as="textarea" rows={3} name="question" defaultValue={question.question}/>}
                </Form.Group>

                <Form.Group controlId="formQuestionType">
                    <Row>
                        <Col sm={{span: 8}}>
                            <Form.Label>Question type</Form.Label>
                            {mode === MODE_CREATE &&
                                <Form.Control name="type" as="select">
                                    <option value="ESSAY">Essay</option>
                                    <option value="MULTIPLE_CHOICE">Multiple choice</option>
                                </Form.Control>
                            }
                            {mode === MODE_EDIT &&
                                <Form.Control name="type" as="select" defaultValue={question.type}>
                                    <option value="ESSAY">Essay</option>
                                    <option value="MULTIPLE_CHOICE">Multiple choice</option>
                                </Form.Control>
                            }
                        </Col>
                        <Col sm={{span: 4}}>
                        <Form.Group controlId="formQuestion">
                            <Form.Label>Points</Form.Label>
                            {mode === MODE_CREATE && <Form.Control type="number" name="points" placeholder="Enter points"/>}
                            {mode === MODE_EDIT && <Form.Control type="number" name="points" placeholder="Enter points" defaultValue={question.points}/>}
                        </Form.Group>
                        </Col>
                    </Row>
                </Form.Group>

                {question && question.type && question.type === "MULTIPLE_CHOICE" &&
                    <React.Fragment>
                        <Row>
                            <Col sm={{span: 2}}>
                                <Form.Label>Correct</Form.Label>
                            </Col>
                            <Col sm={{span: 10}}>
                                <Form.Label>Answer</Form.Label>
                            </Col>
                        </Row>
                        <Form.Group controlId="formAnswer">
                            {question && question.answers && question.answers.length && question.answers.map((v,i) => 
                                <Row key={i} style={{margin: 10}}>
                                    <Col sm={{span: 2}}>
                                        <Form.Check size="sm" type="checkbox" name="answer" idx={i} subname="correct" defaultChecked={v.correct}/>
                                    </Col>
                                    <Col sm={{span: 10}}>
                                        <Form.Control size="sm" type="string" placeholder="Enter answer" name="answer" idx={i} subname="answer" defaultValue={v.answer} />
                                    </Col>
                                </Row>
                            )}
                        </Form.Group>
                        <Button onClick={handleAddAnswer}>Add new answer</Button>
                    </React.Fragment>
                }
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Dismiss
            </Button>
            <Button variant="primary" onClick={handleCreate}>
              Save Question
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }

export default CreateQuestionModal
