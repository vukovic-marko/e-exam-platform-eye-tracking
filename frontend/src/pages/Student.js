import React, { useEffect, useState } from 'react'
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import TestDeck from '../components/TestDeck';
import useRefreshToken from '../hooks/useRefreshToken';

const Student = (props) => {
    
    const [docs, setDocs] = useState({});

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
        alert(`student opened a test with id = ${id}`)
    }

    return (
        <React.Fragment>
            <NavigationBar username={props.user.username} logout={props.logout} />
            <TestDeck docs={docs} loadTests={loadTests} token={props.token} caption="Take Test" callback={openTest} />
        </React.Fragment>
    )
}

export default Student;
