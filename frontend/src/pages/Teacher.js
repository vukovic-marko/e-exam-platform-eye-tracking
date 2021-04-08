import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import axios from 'axios';
import NavigationBar from '../components/NavigationBar';
import TestDeck from '../components/TestDeck';
import Button from 'react-bootstrap/Button';
import StudentTable from '../components/StudentTable';

const Teacher = (props) => {

    const [docs, setDocs] = useState({});
    const [students, setStudents] = useState();
    const [selectedTest, setSelectedTest] = useState(null);

    const history = useHistory();
    const { token, setToken } = props;

    useEffect(() => {

        const refreshToken = () => {
            return new Promise((resolve, reject) => {
                axios.post('http://localhost:5000/user/refresh', null, { withCredentials: true })
                 .then((resp) => {
                    setToken(resp.data.accessToken);
                    resolve(resp.data.accessToken);
                 })
                 .catch((err) => {
                    reject(err);
                 });
            })
        }

        refreshToken()
            .then(token => loadTests(token, 1))
            .catch(err => history.push('/login'))

        const interval = setInterval(() => {
            refreshToken()
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

    const viewStudentsPromise = (id) => {
        return new Promise((resolve, reject) => {
            axios.get(`http://localhost:5000/test/${id}?page=1&limit=15`, {headers: {Authorization: `Bearer ${token}`}})
                 .then(resp => {
                     resolve(resp);
                 })
                 .catch(err => {
                     reject(err);
                 })
        })
    }

    const viewStudents = (id) => {
        setSelectedTest(id);
        viewStudentsPromise(id)
            .then((resp) => {
                setStudents(resp.data.docs);
            })
    }

    return (
        <React.Fragment>
            <NavigationBar username={props.user.username} logout={props.logout} />
            {!selectedTest 
                ? <TestDeck docs={docs} loadTests={loadTests} token={token} caption="View Students" callback={viewStudents} />
                : <div>
                    {/* <p>{students}</p> */}
                    <StudentTable tests={students} />
                    <Button onClick={() => {setSelectedTest(null); setStudents(null)}}>x</Button>
                  </div>}
        </React.Fragment>
    )
}

export default Teacher
