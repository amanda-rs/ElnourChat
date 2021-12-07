import { useLocation, useParams } from "react-router";
import React, { useState, useEffect } from "react";
import Messages from "./Messages";
import UserGrouped from "./UserGrouped";


async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
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
      body: JSON.stringify(data)  // body data type must match "Content-Type" header
    });
   
    return response.json(); // parses JSON response into native JavaScript objects
  }

const Chat = () => {
    const { id } = useParams();
    const chatroomId = "Chatrooms/" + id;

    const location = useLocation();
    const userName = location.state.detail;


    const elnour = ['..är jättemycket snö', 'Inte normalt', 'Och jag är ny här i... i .. Sverige',
'Men det är jättesvårt', 'Ja!', 'De de de.. de vet inte!', 'Jag kommer från Sudan', 'Nä dä dä dä de.. 50 grader varmt',
 'Men jag har bara 3 dar, jag kom tillbaka', 'Jag reser där till för en månad', 'Ja det är bra!', 'De e mycket bra vädret',
'Heter jag Elnur?', 'Elnur, ja det är förnamn', 'Isak Adam', 'Nej!', 'E, S, H, G, Nej!']

    
    const [message, setMessage] = useState("");

    const [messages, setMessages] = useState([]);

    const typing = document.querySelector('#elnour-typing');

    let [isUser, setIsUser] = useState(false);

    async function getData(url = '') {
        await fetch(process.env.NODE_ENV === "production" ? `/chatroom/${id}/messages` : `http://localhost:4000/chatroom/${id}/messages`).then(response => response.json()).then(messages => {setMessages(messages)});            
  
      }
  
      useEffect(()=>{
  
          getData();
      },[])
  

    useEffect(() => {

        if (isUser) {
            elnourSendMessage();
            setIsUser(false);
        }
        

    }, [messages]);

    const addMessage = async (userName, messageText) => {
        const newMessage = { userName: userName, text: messageText, chatroomId:chatroomId};
        
        const message = await postData(process.env.NODE_ENV === "production" ? "/messages" : "http://localhost:4000/messages", newMessage);

        const newMessageArray = [...messages]

        newMessageArray.push(message);

        setMessages(newMessageArray);

    }

    const messageSentByUser = () => {

        setIsUser(true);

        addMessage(userName, message);

        setMessage('');
    }

    const elnourSendMessage = () => {
        setTimeout(() => {
            typing.setAttribute("style", "display:block");
        }, 500);
        setTimeout(() => {
            const newMessage = elnour[Math.floor(Math.random() * (elnour.length))]
            addMessage('Elnour', newMessage);
            typing.setAttribute("style", "display:none");

        }, 3000);

    }

    return (

        <div className="chat">
            <div className="chatInputDiv">
                <Messages messages={messages} userName={userName} />
                <UserGrouped messages={messages}/>
                <div id="textbox-div" className="inputNameDiv">
                <input id="messageInput" value={message} onChange={(e) => setMessage(e.target.value)} type="text" className="chatInput inputName" placeholder="Write a message here.."/>
                <button onClick={messageSentByUser} className="send">Send</button>
                </div>
            </div>
            <div className="typing">
                <p id="elnour-typing" style={{ display: "none" }}>Elnour is typing..</p>
            </div>

        </div>
    );
}

export default Chat;