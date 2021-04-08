import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import TestDeck from '../components/TestDeck';

const Student = (props) => {
    
    const [docs, setDocs] = useState({});

    const { token, setToken } = props;
    const history = useHistory();

    useEffect(() => {

        const refreshPromise = (resolve, reject) => {
            axios.post('http://localhost:5000/user/refresh', null, { withCredentials: true })
                 .then((resp) => {
                    setToken(resp.data.accessToken);
                    resolve(resp.data.accessToken);
                 })
                 .catch((err) => {
                    reject(err);
                 });
        }

        new Promise(refreshPromise)
            .then(token => loadTests(token, 1))
            .catch(err => history.push('/login'))

        const interval = setInterval(() => {
            new Promise(refreshPromise)
                .catch(err => history.push('/login'))

        }, 5000);

        return () => { 
            clearInterval(interval);
        }

    }, [history, setToken]);

    const loadTests = (token, page) => {
        axios.get(`http://localhost:5000/test?page=${page}&limit=9`, { headers: { Authorization: `Bearer ${token}` }})
             .then((resp) => {
                setDocs(d => ({...d, docs: resp.data.docs, page: resp.data.page, totalPages: resp.data.totalPages}));
             })
             .catch((err) => {
                console.log('err', err);
             })
    }

    return (
        <React.Fragment>
            <NavigationBar username={props.user.username} logout={props.logout} />
            <TestDeck docs={docs} loadTests={loadTests} token={token} />
        </React.Fragment>
    )
}

export default Student;
