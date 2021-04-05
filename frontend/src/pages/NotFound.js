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
        <div>
            404
            <Button onClick={goHome}>Go Home</Button>
        </div>
    )
}

export default NotFound;
