import { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router";
import ListChatrooms from "./ListChatrooms";

const Chatrooms = () => {
    const location = useLocation();
    const userName = location.state.detail;
    const history = useHistory();
    async function getData(url = '') {

        await fetch(url).then(response => response.json()).then(chatrooms => {setChatrooms(chatrooms)});            
  
    }

    
  
      useEffect(()=>{
  
          getData(process.env.NODE_ENV === "production" ? "chatrooms" : "http://localhost:4000/chatrooms");
      },[])
  
      const [chatrooms, setChatrooms] = useState(null);

    return ( 
        <div className="chatDiv">
           <button  onClick={() => history.push({pathname:'/newChatroom',
            state: {detail:userName}})}>Add new chatroom</button>
           {chatrooms && <ListChatrooms username={userName} chatrooms={chatrooms}/>}

        </div>
     );
}
 
export default Chatrooms;