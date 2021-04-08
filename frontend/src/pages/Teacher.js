import React from 'react'
import NavigationBar from '../components/NavigationBar';

const Teacher = (props) => {


    return (
        <div>
            <NavigationBar username={props.user.username} logout={props.logout} />
        </div>
    )
}

export default Teacher
