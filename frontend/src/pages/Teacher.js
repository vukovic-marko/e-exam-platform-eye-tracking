import React, { useEffect, useState } from 'react'
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import TestDeck from '../components/TestDeck';
import Button from 'react-bootstrap/Button';
import StudentTable from '../components/StudentTable';
import useRefreshToken from '../hooks/useRefreshToken';

const Teacher = (props) => {

    const [docs, setDocs] = useState({});
    const [students, setStudents] = useState();
    const [selectedTest, setSelectedTest] = useState(null);
    const [loading, setLoading] = useState(true);

    useRefreshToken(props.setToken);

    useEffect(() => {
        if (!Object.keys(docs).length && props.token !== undefined) loadTests(props.token, 1);
    }, [props.token, docs]);

    const loadTests = (token, page) => {
        axios.get(`http://localhost:5000/test?page=${page}&limit=9`, { headers: { Authorization: `Bearer ${token}` }})
             .then((resp) => {
                setDocs(d => ({...d, docs: resp.data.docs, page: resp.data.page, totalPages: resp.data.totalPages}));
             })
             .catch((err) => {
                console.log('err', err);
             })
    }

    const viewStudents = (id, title, type) => {
        setSelectedTest({title: title, type: type});
        axios.get(`http://localhost:5000/test/${id}?page=1&limit=15`, {headers: {Authorization: `Bearer ${props.token}`}})
             .then(resp => {
                setStudents(resp.data.docs);
                setLoading(false);
             })
             .catch(err => {
                console.log('err', err);
             })
            
    }

    return (
        <React.Fragment>
            <NavigationBar username={props.user.username} logout={props.logout} />
            {!selectedTest 
                ? <React.Fragment>
                    <h1 style={{textAlign: 'center', marginTop: 20}}>Created Tests</h1>
                    <TestDeck docs={docs} loadTests={loadTests} token={props.token} caption="View Students" callback={viewStudents} />
                  </React.Fragment>
                : <div>
                    <Button variant="outline-primary" style={{position: 'absolute', right:0, marginRight: 70, marginTop: 15}} onClick={() => {setSelectedTest(null); setStudents(null); setLoading(true); }}>x</Button>
                    <StudentTable tests={students} loading={loading} selectedTest={selectedTest} />
                  </div>
            }
        </React.Fragment>
    )
}

export default Teacher
