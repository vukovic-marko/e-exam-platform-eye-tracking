import React from 'react';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import dayjs from 'dayjs';

const StudentTable = (props) => {

    // TODO DODATI LOADING KAO NA POCENOJ STRANICI

    return (
        <React.Fragment>
            <Container>
                {props && props.tests && props.tests.length
                ?   <Table striped bordered hover className="mt-5">
                        <thead>
                            <tr>
                                <th>date started</th>
                                <th>date submitted</th>
                                <th>student username</th>
                                <th>test title</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.tests.map(item => 
                                <tr>
                                    <td>
                                        {dayjs(item.started_at).format('DD/MM/YYYY HH:mm')}
                                    </td>
                                    <td>
                                        {dayjs(item.submitted_at).format('DD/MM/YYYY HH:mm')}
                                    </td>
                                    <td>
                                        {item.student.username}
                                    </td>
                                    <td>
                                        {item.test.title}
                                    </td>
                                </tr>    
                            )}
                        </tbody>
                </Table>
            : <p>no results</p>}
            </Container>
        </React.Fragment>
    )
}

export default StudentTable;
