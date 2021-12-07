import { Link } from "react-router-dom";

const ListChatrooms  = ({username, chatrooms}) => {
    return (
        <div className="chatroomDiv">
            {chatrooms.map((chatroom) => (
                <div className="messageDiv" key={chatroom._key}>
                    <div className="card chatroom">
                        <Link className="link" to={{pathname: `chat/${chatroom._key}`, state: {detail:username} }}>{chatroom.title}</Link>
                    </div>
                </div>
            ))}
        </div>
     );
}
 
export default ListChatrooms;