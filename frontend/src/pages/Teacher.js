import React, { useEffect, useState } from 'react'
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import TestDeck from '../components/TestDeck';
import Button from 'react-bootstrap/Button';
import StudentTable from '../components/StudentTable';
import useRefreshToken from '../hooks/useRefreshToken';
import TeacherTest from '../components/TeacherTest';
import CreateTestModal from '../components/CreateTestModal';

const MODE_VIEW = "MODE_VIEW";
const MODE_CREATE = "MODE_CREATE";

const Teacher = (props) => {

    const [docs, setDocs] = useState({});
    const [students, setStudents] = useState();
    const [selectedTest, setSelectedTest] = useState(null);
    const [selectedSubmittedTest, setSelectedSubmittedTest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showCreateTestModal, setShowCreateTestModal] = useState(false);
    const [testTBC, setTestTBC] = useState(null);

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

    const handleOpenTest = (e, id) => {
        e.preventDefault();

        axios.get(`http://localhost:5000/test/result/${id}`, { headers: { Authorization : `Bearer ${props.token}` } })
             .then(resp => {
                 setSelectedSubmittedTest(resp.data);
             })
             .catch(err => {
                 console.log('err', err);
             })
    }

    const handleCreateTest = () => {
        setShowCreateTestModal(true);
    }

    const createTest = ({test}) => {

        axios.post('http://localhost:5000/test', test, { headers: { Authorization: `Bearer ${props.token}` }})
             .then(resp => {
                 console.log(resp);
             })
             .catch(err => {
                 console.log('err', err);
             })
    }

    const createEmptyTest = (testDetails) => {
        setShowCreateTestModal(false);
        setTestTBC({
            test: {
                title: testDetails.title,
                questions: []
            }
        })
    }

    return (
        <React.Fragment>
            {!testTBC 
                ? !selectedSubmittedTest    
                    ? !selectedTest 
                        ? <React.Fragment>
                            <NavigationBar username={props.user.username} logout={props.logout} />
                            <Button onClick={handleCreateTest}>Create Test</Button>
                            <CreateTestModal showModal={showCreateTestModal} setShowModal={setShowCreateTestModal} createTest={createEmptyTest} />
                            <h1 style={{textAlign: 'center', marginTop: 20}}>Created Tests</h1>
                            <TestDeck docs={docs} loadTests={loadTests} token={props.token} caption="View Students" callback={viewStudents} />
                        </React.Fragment>
                        : <div>
                            <NavigationBar username={props.user.username} logout={props.logout} />
                            <Button variant="outline-primary" style={{position: 'absolute', right:0, marginRight: 70, marginTop: 15}} onClick={() => {setSelectedTest(null); setStudents(null); setLoading(true); }}>Leave</Button>
                            <StudentTable tests={students} loading={loading} selectedTest={selectedTest} handleOpenTest={handleOpenTest} />
                        </div>
                    : <React.Fragment>
                        <TeacherTest test={selectedSubmittedTest} setTest={setSelectedSubmittedTest} mode={MODE_VIEW} />
                    </React.Fragment>
                : <React.Fragment>
                    <TeacherTest test={testTBC} setTest={setTestTBC} createTest={createTest} mode={MODE_CREATE} />
                  </React.Fragment>    
            }
        </React.Fragment>
    )
}

export default Teacher
