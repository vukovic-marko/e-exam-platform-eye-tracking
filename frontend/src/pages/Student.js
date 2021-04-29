import React, { useEffect, useState } from 'react'
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import TestDeck from '../components/TestDeck';
import useRefreshToken from '../hooks/useRefreshToken';
import Test from '../components/Test';
import Button from 'react-bootstrap/Button';

const Student = (props) => {
    
    const [docs, setDocs] = useState({});
    const [selectedTest, setSelectedTest] = useState(null);
    const [submittedTests, setSubmittedTests] = useState(false);

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

    const viewFinsihedTestsHandler = () => {
        loadFinshedTests(props.token, 1);
        setSubmittedTests(true);
    }

    const closeView = () => {
        loadTests(props.token, 1);
        setSubmittedTests(false);
    }

    const loadFinshedTests = (token, page) => {
        axios.get(`http://localhost:5000/test/results?page=${page}&limit=9`, { headers: { Authorization: `Bearer ${token}` }})
             .then((resp) => {
                setDocs(d => ({...d, docs: resp.data.docs, page: resp.data.page, totalPages: resp.data.totalPages}));
             })
             .catch((err) => {
                console.log('err', err);
             })
    }

    const openTest = (id) => {
        axios.get(`http://localhost:5000/test/${id}`, {headers: { Authorization: `Bearer ${props.token}` } })
             .then((resp) => {
                setSelectedTest(resp.data);
             })
             .catch((err) => {
                console.log('err', err);
             })
    }

    return (
        <React.Fragment>
            {submittedTests
                ? <React.Fragment>
                    <NavigationBar username={props.user.username} logout={props.logout} />
                        <Button variant="outline-primary" style={{position: 'absolute', right:0, marginRight: 70, marginTop: 15}} onClick={closeView}>Close</Button>
                        <h1 style={{textAlign: 'center', marginTop: 20}}>Finished Tests</h1>
                        <TestDeck docs={docs} loadTests={loadFinshedTests} token={props.token} caption="Take Test"/>
                  </React.Fragment>
                : !selectedTest 
                    ? <React.Fragment>
                        <NavigationBar username={props.user.username} logout={props.logout} />
                        <div style={{marginTop: "1em", width: "100%", display: "flex", flexDirection: "row", justifyContent: "center"}}>    
                                <Button onClick={viewFinsihedTestsHandler}>View finished tests</Button>
                        </div>
                        <h1 style={{textAlign: 'center', marginTop: 20}}>Available Tests</h1>
                        <TestDeck docs={docs} loadTests={loadTests} token={props.token} caption="Take Test" callback={openTest} />
                      </React.Fragment>
                    : <React.Fragment>
                        <Test test={selectedTest} setSelectedTest={setSelectedTest} token={props.token}/>
                      </React.Fragment>
                }
        </React.Fragment>
    )
}

export default Student;
