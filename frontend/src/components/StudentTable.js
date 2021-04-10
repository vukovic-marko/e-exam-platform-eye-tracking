import React from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';
import dayjs from 'dayjs';

const StudentTable = (props) => {

    // TODO DODATI LOADING KAO NA POCENOJ STRANICI

    return (
        <React.Fragment>
            <Container>
                {!props.loading
                    ? props && props.tests && props.tests.length
                        ?   <React.Fragment>
                                <h1>{props.selectedTest.title}</h1>
                                <p>Type: {props.selectedTest.type}</p>
                                <Table striped bordered hover className="mt-3">
                                    <thead>
                                        <tr>
                                            <th>date started</th>
                                            <th>date submitted</th>
                                            <th>student username</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {props.tests.map((item,idx) => 
                                            <tr key={idx}>
                                                <td>
                                                    {item.started_at ? dayjs(item.started_at).format('DD/MM/YYYY HH:mm') : '-'}
                                                </td>
                                                <td>
                                                    {item.submitted_at ? dayjs(item.submitted_at).format('DD/MM/YYYY HH:mm') : '-'}
                                                </td>
                                                <td>
                                                    {item.student.username}
                                                </td>
                                            </tr>    
                                        )}
                                    </tbody>
                            </Table>
                        </React.Fragment>
                    : <React.Fragment>
                        <h1>{props.selectedTest.title}</h1>
                        <p>Type: {props.selectedTest.type}</p>
                        <p>Nobody has taken the tast.</p>
                      </React.Fragment>
                : <div style={{display: 'flex', height: window.innerHeight, justifyContent: 'center', alignItems: 'center'}}>
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                  </div>
            }
            </Container>
        </React.Fragment>
    )
}

export default StudentTable;
