import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import Chart from 'react-google-charts';
import { Stage, Layer } from 'react-konva';
import Tooltip from './Tooltip';
import AreaOfInterest from './AreaOfInterest';
import CreateQuestionModal from './CreateQuestionModal';
import CreateAreaOfInterestModal from './CreateAreaOfInterestModal';

const MODE_VIEW = "MODE_VIEW";
const MODE_CREATE = "MODE_CREATE";


const Test = (props) => {

    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateQuestionModal, setShowCreateQuestionModal] = useState(false);
    const [showCreateAreaOfInterestModal, setShowCreateAreaOfInterestModal] = useState(false);

    const [test, setTest] = useState(props.test);

    const changeQuestion = (n) => {

        let i = 0;

        if (n) {
            i = question.no+n;
        }

        let arr = [[
            { type: 'string', id: 'caption' },
            { type: 'string', id: 'dummy bar label' },
            { type: 'string', role: 'tooltip' },
            { type: 'number', id: 'start' },
            { type: 'number', id: 'end' }
        ]]
         
        if (props.mode === MODE_VIEW) {
            test.submitted_answers[i].crunched_gaze_data.sequence.forEach(element => {
                element.tooltip = ReactDOMServer.renderToStaticMarkup(
                    <Tooltip 
                        count={element.count} 
                        caption={element.caption} 
                        sequence_length={test.submitted_answers[i].crunched_gaze_data.sequence_length} 
                        percentage={element.percentage} 
                    />
                )
                
                arr.push([
                    element.caption,
                    null,
                    element.tooltip,
                    element.start,
                    element.end
                ])
            })
        }

        let arr1 = [['Area of interest', 'Total']]

        if (props.mode === MODE_VIEW) {
            test.submitted_answers[i].crunched_gaze_data.summary.forEach(element => {
                arr1.push([element.caption, element.count])
            })
        }

        if (props.mode === MODE_VIEW) {
            if (n !== 0) {
                setQuestion({
                    ...question,
                    question: test.test.questions[i],
                    answer: test.submitted_answers[i],
                    no : i,
                    sequence_data: arr,
                    summary_data: arr1
                })
            } else {
                setLoading(false)
                setQuestion({
                    length: test.test.questions.length,
                    question: test.test.questions[i],
                    answer: test.submitted_answers[i],
                    no : i,
                    sequence_data: arr,
                    summary_data: arr1
                })
            }
        } else {
            setQuestion({
                ...question,
                question: test.test.questions[i],
                no : i
            })
        }
        
    } 

    useEffect(() => {
        if (props.mode === MODE_VIEW) {
            if (test) {
                changeQuestion(0);            
            }
        } else {
            if (!test.test.questions.length) {
                setQuestion({
                    length: 0,
                    question: null,
                    no: 0
                })
                setLoading(false);
            }
        }

    }, [test]);

    

    const previous = () => {
        if (question.no !== 0) {
            changeQuestion(-1);
        }
    }

    const next = () => {
        if (question.no !== question.length - 1) {
            changeQuestion(1);
        }
    }

    const handleEdit = () => {

    }

    const addNewArea = (areaDetails) => {
        setQuestion({
            ...question,
            question: {
                ...question.question,
                areas_of_interest: [
                    ...question.question.areas_of_interest,
                    {
                        caption: areaDetails.caption,
                        top_left: {
                            x1: 100,
                            y1: 100
                        },
                        bottom_right: {
                            x2: 300,
                            y2: 300
                        }
                    }
                ]
            }
        })

        let temp = JSON.parse(JSON.stringify(test.test.questions));
        temp[question.no].areas_of_interest.push({
            caption: areaDetails.caption,
                        top_left: {
                            x1: 100,
                            y1: 100
                        },
                        bottom_right: {
                            x2: 300,
                            y2: 300
                        }
        })
        setTest({
            ...test,
            test: {
                ...test.test,
                questions: temp
            }
        })

        setShowCreateAreaOfInterestModal(false);
    }

    const addNewQuestionHandler = () => {
        setShowCreateQuestionModal(true);
    }

    const addNewAreaOfInterestHandler = () => {
        setShowCreateAreaOfInterestModal(true);
    }

    const addNewQuestion = (q) => {

        q.areas_of_interest = []
        
        if (question.length === 0) {
            setQuestion({
                ...question,
                question: q,
                no : 0,
                length: 1
            })
        } else {
            setQuestion({
                ...question,
                question: q,
                no : question.no + 1,
                length: question.length + 1
            })
        }
        
        setTest({
            ...test,
            test : {
                ...test.test,
                questions: [
                    ...test.test.questions,
                    q
                ]
            }
        });

        setShowCreateQuestionModal(false)


    }

    const createTest = () => {
        props.createTest(test);
    }

    const areaOfInterestMoved = (idx, x1, y1, x2, y2) => {
        let areas_of_interest = JSON.parse(JSON.stringify(question.question.areas_of_interest));
        areas_of_interest[idx] = {
            caption: areas_of_interest[idx].caption,
            top_left: {
                x1: x1,
                y1: y1
            },
            bottom_right: {
                x2: x2,
                y2: y2
            }
        }

        setQuestion({
            ...question,
            question: {
                ...question.question,
                areas_of_interest: areas_of_interest
            }
        })

        // TODO ADD TO TEST

        let temp = JSON.parse(JSON.stringify(test.test.questions));
        temp[question.no].areas_of_interest[idx] = {
            caption: temp[question.no].areas_of_interest[idx].caption,
                        top_left: {
                            x1: x1,
                            y1: y1
                        },
                        bottom_right: {
                            x2: x2,
                            y2: y2
                        }
        }
        setTest({
            ...test,
            test: {
                ...test.test,
                questions: temp
            }
        })
    }

    return (
        <React.Fragment>
            <Stage style={{position: 'absolute', left: 0, top: 0}} width={window.innerWidth} height={window.innerHeight}>
                <Layer>
                    {
                        question && question.question && question.question.areas_of_interest && question.question.areas_of_interest.map((area, idx) => {
                            if (props.mode === MODE_VIEW)
                                return <AreaOfInterest key={idx} area={area} idx={idx} /> 
                            else
                                return <AreaOfInterest key={idx} area={area} idx={idx} caption={area.caption} draggable={true} areaOfInterestMoved={areaOfInterestMoved}/>
                        }
                    )}
                </Layer>
            </Stage>
           {!loading
                ? error
                    ? <React.Fragment>
                        {error}
                      </React.Fragment>
                    : <div style={{display: 'flex', width: window.innerWidth, height: window.innerHeight, flexDirection: 'column', alignItems: 'center', paddingTop: 125}}>
                        <p style={{position: 'absolute', left: 0, top: 0, marginLeft: 15, marginTop: 10, color: 'gray'}}>{test.test.title}{props.mode === MODE_VIEW &&  <span> • {test.test.type.toLowerCase().replace('_', ' ')} type • {test.student.username} {test.test.type === "MULTIPLE_CHOICE" ? <span>• {test.points}/{test.test.test_points} points</span> : <span>• {test.test.test_points} points</span>}</span>}</p>
                        {/* <p style={{position: 'absolute', left: 0, top: 0, marginLeft: 15, marginTop: 10, color: 'gray'}}>{test.test.title} • {test.test.type.toLowerCase().replace('_', ' ')} type • {test.student.username} {test.test.type === "MULTIPLE_CHOICE" ? <span>• {test.points}/{test.test.test_points} points</span> : <span>• {test.test.test_points} points</span>}</p> */}
                        {question && question.question && question.question.question 
                            ? <React.Fragment>
                                <h2>{question.no+1}/{question.length}</h2>
                                <h2>{question.question.question}</h2>
                                {/* {question.question.type === "MULTIPLE_CHOICE" 
                                    ? <p style={{color: 'grey'}}>{question.answer.correct ? question.question.points : 0}/{question.question.points}</p>
                                    : <p style={{color: 'grey'}}>{question.question.points}</p>
                                } */}
                                {props.mode === MODE_VIEW
                                    ? question.question.type === "MULTIPLE_CHOICE"
                                        ? <ol type="a">
                                            {question.question.answers.map((item, idx) =>
                                                <li key={idx} style={item.correct ? {color: 'green'} : question.answer.answer_id === item._id ? {color: 'red'} : {color: 'black'}}>{item.answer}</li>
                                            )}
                                            </ol>
                                        : <p>{question.answer.answer}</p>
                                    : question.question.type === "MULTIPLE_CHOICE"
                                        && <ol type="a">
                                            {question.question.answers.map((item, idx) =>
                                                <li key={idx} style={item.correct ? {color: 'green'} : {color: 'black'}}>{item.answer}</li>
                                            )}
                                            </ol>
                                }
                              </React.Fragment>
                            : <React.Fragment>
                                <h3>Please add some questions</h3>
                                <p>There is currently no questions added. Please add some questions.</p>
                              </React.Fragment>
                        }    
                        <Button variant="outline-primary" onClick={() => props.setTest(null)} style={{position: 'absolute', right: 0, top: 0, marginTop: 10, marginRight: 10}}>Leave</Button>
                        <Button disabled={question.no === 0 ? true : false} onClick={previous} style={{position: 'absolute', left:0, top: '50%', height: 40, marginTop: -20, marginLeft: 10}}>←</Button>
                        <Button disabled={question.no === question.length - 1 || !question.length ? true : false} onClick={next} style={{position: 'absolute', right:0, top: '50%', height: 40, marginTop: -20, marginRight: 10}}>→</Button>
                        {props.mode === MODE_CREATE &&
                            <React.Fragment>
                                <CreateQuestionModal showModal={showCreateQuestionModal} setShowModal={setShowCreateQuestionModal} addQuestion={addNewQuestion}/>
                                <CreateAreaOfInterestModal showModal={showCreateAreaOfInterestModal} setShowModal={setShowCreateAreaOfInterestModal} createAreaOfInterest={addNewArea}/>
                                <div style={{position: 'absolute', bottom: 0}}>
                                    <Button onClick={handleEdit} disabled={!question.length ? true : false} variant="outline-primary" className="ml-1 mr-1">Edit Question</Button>
                                    <Button onClick={addNewAreaOfInterestHandler} disabled={!question.length ? true : false} variant="outline-primary" className="ml-1 mr-1">New Area</Button>
                                    <Button onClick={addNewQuestionHandler} variant="outline-primary" className="ml-1 mr-1">New Question</Button>
                                    <Button onClick={createTest} variant="primary" className="ml-1 mr-1">Submit</Button>
                                </div>
                            </React.Fragment>
                        }
                        {props.mode === MODE_VIEW && question.sequence_data && question.answer.crunched_gaze_data && question.answer.crunched_gaze_data.sequence_length &&
                            <div style={{position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 10}}>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Chart
                                        width={'850px'}
                                        height={'200px'}
                                        chartType="Timeline"
                                        loader={
                                            <div style={{display: 'flex', width: "850px", height: "200px", justifyContent: 'center', alignItems: 'center'}}>
                                                <Spinner animation="border" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </Spinner>
                                            </div>
                                        }
                                        data={question.sequence_data}
                                        options={{
                                            allowHtml: true,
                                            colors: ['#3581D8', '#D82E3F', '#FFE135', '#63CAD8', '#28CC2D']
                                        }}
                                    />
                                    <span>sequence</span>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}> 
                                    <Chart
                                        width={'450px'}
                                        height={'275px'}
                                        chartType="PieChart"
                                        loader={
                                            <div style={{display: 'flex', justifyContent: 'center',  width: "450px", height: "275px",  alignItems: 'center'}}>
                                                <Spinner animation="border" role="status">
                                                    <span className="sr-only">Loading...</span>
                                                </Spinner>
                                            </div>
                                        }
                                        data={question.summary_data}
                                        options={{
                                            colors: ['#3581D8', '#D82E3F', '#FFE135', '#63CAD8', '#28CC2D']
                                        }}
                                        rootProps={{ 'data-testid': '1' }}
                                    />
                                    <span>total</span>
                                </div>
                            </div>
                        }
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
