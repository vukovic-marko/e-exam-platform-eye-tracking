import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const useRefreshToken = (setToken) => {

    const history = useHistory();

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
            .catch(err => history.push('/login'))

        const interval = setInterval(() => {
            refreshToken()
                .catch(err => history.push('/login'))

        }, 5000);

        return () => { 
            clearInterval(interval);
        }

    }, [history, setToken]);
}

export default useRefreshToken;
