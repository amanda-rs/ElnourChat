import { useLocation, useHistory } from "react-router";
import { useState } from "react";

const NewChatroom = () => {
    const [title, setTitle] = useState("");
    const location = useLocation();
    const userName = location.state.detail;
    const history = useHistory();

    const displayError = (errorMessage) => {
        let parr = document.createElement('p');
        parr.setAttribute('style', 'display:block');
        parr.innerText = errorMessage;

        const div = document.querySelector(".errorDiv");

        div.appendChild(parr);
    }


    const submitTitle = async () => {
        const response = await fetch(process.env.NODE_ENV === "production" ? "chatrooms" : 'http://localhost:4000/chatrooms', {
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
            body: JSON.stringify({ title: title })  // body data type must match "Content-Type" header
        });

        const chatroom = await response.json();
       
        if (chatroom.errorMessage) {
            displayError(chatroom.errorMessage)
            return;
        }

        history.push({ pathname: `chat/${chatroom.chatroomId}`, state: { detail: userName } });

    }
    return (
        <div className="enterName">
            <div>
                <div className="row">
                    <div className="inputNameDiv col">
                        <input id="newChatroomInput" className="inputName" value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="Enter chatroom title"></input>
                        <button onClick={submitTitle}>Submit</button>
                    </div>
                </div>
                <div className="row">
                    <div className="errorDiv col"></div>
                </div>
            </div>
        </div>
    );
}

export default NewChatroom;