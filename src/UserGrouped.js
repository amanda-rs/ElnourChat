const UserGrouped = ({messages}) => {


const result = messages.reduce((groupedMessages, message)=>{

    const user = message.userName;
    if(groupedMessages['Elnour'] == null) groupedMessages['Elnour'] = [];
    if(user === 'Elnour')groupedMessages[user].push(message);

    return groupedMessages;


}, {})

    return (        


        <div>


        </div>

     );
}
 
export default UserGrouped;