import { useHistory } from 'react-router-dom';
import { useState } from 'react';
const EnterName = () => {

    const history = useHistory();


    const submitName = async()=>{
        if(name === null || name === ""){
            return;
        } 

        const response = await fetch(process.env.NODE_ENV === "production" ? "users" : 'http://localhost:4000/users', {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
              'Content-Type': 'application/json'
              // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({username: name})  // body data type must match "Content-Type" header
          });

          const username = await response.json();

          if (username) {
            history.push({pathname:'/chatrooms',
            state: {detail:username.username}});      
          }
    }

    const [name, setName] = useState("");
    return (

        <div className="enterName">
            <div className="inputNameDiv">
                <input id="nameInput" className="inputName" value={name} onChange={(e)=>setName(e.target.value)} type="text" placeholder="Enter your name here!"></input>
                <button onClick={submitName}>Submit</button>
            </div>

        </div>
            );

       

}

export default EnterName;