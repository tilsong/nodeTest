import React,{ useEffect} from 'react'
import axios from 'axios';

function LandingPage() {
    //LandingPage 실행시 바로 useEffect 실행
    useEffect(() => {
        axios.get('/api/hello')//endpoint
        .then(response => console.log(response.data))
    }, [])

    return (
        <div>
            LadingPage
        </div>    
    )
}

export default LandingPage