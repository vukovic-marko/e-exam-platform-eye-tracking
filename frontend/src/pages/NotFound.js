import React from 'react'
import { useHistory } from 'react-router-dom'
import Button from 'react-bootstrap/Button'

const NotFound = () => {

    const history = useHistory();

    const goHome = () => {
        history.push('/');
        window.location.reload(true);
    }

    return (
        <div style={{display: 'flex', width: window.innerWidth, height: window.innerHeight, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
            <h1>404 - PAGE NOT FOUND</h1>
            <p>You have requested a page that does not exist.</p>
            <Button onClick={goHome}>Go Home</Button>
        </div>
    )
}

export default NotFound;
