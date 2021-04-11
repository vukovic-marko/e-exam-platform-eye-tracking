import React, { useEffect, useState } from 'react'
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import TestDeck from '../components/TestDeck';
import useRefreshToken from '../hooks/useRefreshToken';
import Test from '../components/Test';

const Student = (props) => {
    
    const [docs, setDocs] = useState({});
    const [selectedTest, setSelectedTest] = useState(null);

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
            {!selectedTest 
                ? <React.Fragment>
                    <NavigationBar username={props.user.username} logout={props.logout} />
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
