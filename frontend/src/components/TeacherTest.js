import React, { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import ReactDOMServer from 'react-dom/server';
import Chart from 'react-google-charts';

const Tooltip = (data) => {
    return (
      <div style= {{
        paddingLeft: 5,
        paddingRight: 5,
        paddingBottom: 5
      }}>
        <h3>{data.caption}</h3>
        <b>{data.count}</b> {data.count == 1 ? 'point' : 'points'} out of <b>{data.sequence_length}</b> total <br/>
        <b>{(data.percentage*100).toFixed(2)}%</b> of a sequence
      </div>
    )
  }

const Test = (props) => {

    const [question, setQuestion] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const { test } = props;

    useEffect(() => {
        if (test) {
            
            let arr = [
                [
                { type: 'string', id: 'caption' },
                { type: 'string', id: 'dummy bar label' },
                { type: 'string', role: 'tooltip' },
                { type: 'number', id: 'start' },
                { type: 'number', id: 'end' }]
              ]
              
            test.submitted_answers[0].crunched_gaze_data.sequence.forEach(element => {
                element.tooltip = ReactDOMServer.renderToStaticMarkup(
                    <Tooltip 
                        count={element.count} 
                        caption={element.caption} 
                        sequence_length={test.submitted_answers[0].crunched_gaze_data.sequence_length} 
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

            let arr1 = [['Area of interest', 'Total']]

            test.submitted_answers[0].crunched_gaze_data.summary.forEach(element => {
                arr1.push([element.caption, element.count])
            })

            setLoading(false);
            setQuestion({
                no: 0,
                question: test.test.questions[0],
                answer: test.submitted_answers[0],
                length: test.test.questions.length,
                sequence_data: arr,
                summary_data: arr1
            })
            
        }
    }, [test]);


    const previous = () => {
        if (question.no !== 0) {

            let arr = [
                [
                { type: 'string', id: 'caption' },
                { type: 'string', id: 'dummy bar label' },
                { type: 'string', role: 'tooltip' },
                { type: 'number', id: 'start' },
                { type: 'number', id: 'end' }]
              ]
              
            test.submitted_answers[question.no-1].crunched_gaze_data.sequence.forEach(element => {
                element.tooltip = ReactDOMServer.renderToStaticMarkup(
                    <Tooltip 
                        count={element.count} 
                        caption={element.caption} 
                        sequence_length={test.submitted_answers[question.no-1].crunched_gaze_data.sequence_length} 
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

            let arr1 = [['Area of interest', 'Total']]

            test.submitted_answers[question.no-1].crunched_gaze_data.summary.forEach(element => {
                arr1.push([element.caption, element.count])
            })

            setQuestion({
                ...question,
                question: test.test.questions[question.no - 1],
                answer: test.submitted_answers[question.no - 1],
                no : question.no - 1,
                sequence_data: arr,
                summary_data: arr1
            })
        }
    }

    const next = () => {
        if (question.no !== question.length - 1) {
            
            let arr = [
                [
                { type: 'string', id: 'caption' },
                { type: 'string', id: 'dummy bar label' },
                { type: 'string', role: 'tooltip' },
                { type: 'number', id: 'start' },
                { type: 'number', id: 'end' }]
              ]
              
            test.submitted_answers[question.no + 1].crunched_gaze_data.sequence.forEach(element => {
                element.tooltip = ReactDOMServer.renderToStaticMarkup(
                    <Tooltip 
                        count={element.count} 
                        caption={element.caption} 
                        sequence_length={test.submitted_answers[question.no+1].crunched_gaze_data.sequence_length} 
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

            let arr1 = [['Area of interest', 'Total']]

            test.submitted_answers[question.no+1].crunched_gaze_data.summary.forEach(element => {
                arr1.push([element.caption, element.count])
            })

            setQuestion({
                ...question,
                question: test.test.questions[question.no + 1],
                answer: test.submitted_answers[question.no + 1],
                no : question.no + 1,
                sequence_data: arr,
                summary_data: arr1
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
                    : <div style={{display: 'flex', width: window.innerWidth, height: window.innerHeight, flexDirection: 'column', alignItems: 'center', paddingTop: 125}}>
                        <p style={{position: 'absolute', left: 0, top: 0, marginLeft: 15, marginTop: 10, color: 'gray'}}>{test.test.title} • {test.test.type.toLowerCase().replace('_', ' ')} type • {test.student.username} {test.test.type === "MULTIPLE_CHOICE" ? <span>• {test.points}/{test.test.test_points} points</span> : <span>• {test.test.test_points} points</span>}</p>
                        <h2>{question.no+1}/{question.length}</h2>
                        <h2>{question.question.question}</h2>
                        {question.question.question_type === "MULTIPLE_CHOICE" 
                            ? <p style={{color: 'grey'}}>{question.answer.correct ? question.question.points : 0}/{question.question.points}</p>
                            : <p style={{color: 'grey'}}>{question.question.points}</p>
                        }
                            {question.question.question_type === "MULTIPLE_CHOICE"
                                ? <ol type="a">
                                    {question.question.answers.map((item, idx) =>
                                        <li ket={idx} style={item.correct ? {color: 'green'} : question.answer.answer_id === item._id ? {color: 'red'} : {color: 'black'}}>{item.answer}</li>
                                    )}
                                  </ol>
                                : <p>{question.answer.answer}</p>
                            }
                        <Button variant="outline-primary" onClick={() => props.setSelectedSubmittedTest(null)} style={{position: 'absolute', right: 0, top: 0, marginTop: 10, marginRight: 10}}>Leave</Button>
                        <Button disabled={question.no === 0 ? true : false} onClick={previous} style={{position: 'absolute', left:0, top: '50%', height: 40, marginTop: -20, marginLeft: 10}}>←</Button>
                        <Button disabled={question.no === question.length - 1 ? true : false} onClick={next} style={{position: 'absolute', right:0, top: '50%', height: 40, marginTop: -20, marginRight: 10}}>→</Button>
                        {question.sequence_data && question.answer.crunched_gaze_data && question.answer.crunched_gaze_data.sequence_length &&
                            <div style={{position: 'absolute', bottom: 0, width: '100%', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', marginBottom: 10}}>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                                    <Chart
                                        width={'850px'}
                                        height={'200px'}
                                        chartType="Timeline"
                                        loader={<div>Loading Chart</div>}
                                        data={question.sequence_data}
                                        options={{
                                            allowHtml: true,
                                            colors: ['#3581D8', '#D82E3F', '#FFE135', '#63CAD8', '#28CC2D']
                                            // timeline: {
                                            //   groupByRowLabel: false,
                                            // }
                                        }}
                                        // rootProps={{ 'data-testid': '2' }}
                                    />
                                    <span>sequence</span>
                                </div>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}> 
                                    <Chart
                                        width={'450px'}
                                        height={'275px'}
                                        chartType="PieChart"
                                        loader={<div>Loading Chart</div>}
                                        data={question.summary_data}
                                        options={{
                                            colors: ['#3581D8', '#D82E3F', '#FFE135', '#63CAD8', '#28CC2D']
                                        }}
                                        rootProps={{ 'data-testid': '1' }}
                                    />
                                    <span>total</span>
                                </div>
                                {/* <Chart
                                    width={'800px'}
                                    height={'200px'}
                                    chartType="Timeline"
                                    loader={<div>Loading Chart</div>}
                                    data={question.sequence_data}
                                    options={{
                                        allowHtml: true,
                                        // timeline: {
                                        //   groupByRowLabel: false,
                                        // }
                                    }}
                                    // rootProps={{ 'data-testid': '2' }}
                                /> */}
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
