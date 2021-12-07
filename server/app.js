const express = require('express')

const app = express()
const port = 4000
var cors = require('cors')
var arangojs = require('arangojs');
var aql = arangojs.aql;

const username = 'root';
const password = 'rootpassword';
const host = 'localhost';
const port2 = 8529;
const database = '_system';

const path = require('path');
const exp = require('constants');



// const db = new arangojs.Database({
//   url: `http://${username}:${password}@${host}:${port2}/_db/${database}`,
//   databaseName: false // don't automatically append database path to URL
// });

const db = new arangojs.Database({
  url: process.env.ARANGO_DB_URL || "http://localhost:8529/",
  databaseName: "_system",
  auth: { username: "root", password: "rootpassword" },
});

var readFile =  function() {

  const fs = require('fs');
  if (fs.existsSync('ChatHistory.json')) {

    let messages = JSON.parse(fs.readFileSync('ChatHistory.json'));

    return messages;

  }
}

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, '../build')))

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, '../build'))
// })


app.get('/chatroom/:roomId/messages', async (req, res) => {
  const cursor = await db.query(aql`
  FOR r IN Chatrooms
    FILTER r._key == ${req.params.roomId}
        FOR m IN 1..1 INBOUND r Room
            FOR u IN 1..1 INBOUND m Sender
                RETURN { _key:m._key, text:m.text, userName:u.username}`);

  res.send(await cursor.all());
})


app.get('/chatrooms', async (req, res) => {
  const cursor = await db.query(aql`
  FOR r IN Chatrooms
    RETURN r`);

    res.send(await cursor.all());
})

app.post('/chatrooms', async (req, res) => {
  let message;

  if (!req.body.title) {
    message = "You have to enter a title for your chatroom";
    res.send({chatroomId: 0, errorMessage:message});
    return;
  } 
  const title = req.body.title;
  const findChatroomQuery = aql`
  FOR room IN Chatrooms 
  FILTER room.title == ${req.body.title}
  RETURN room._key`;

  message = "Chatroom already exists";
  const findChatroomCursor = await db.query(findChatroomQuery);
  const rooms = await findChatroomCursor.all();
  let room = rooms[0];
  if (!room) {
    const chatroomQuery =  aql`INSERT {title: ${title}} IN Chatrooms 
    LET inserted = NEW
    RETURN inserted._key`;
    const chatroomCursor = await db.query(chatroomQuery);
    const chatroomsArray = await chatroomCursor.all();
    room = chatroomsArray[0];
    message = "";
  } 
  res.send({chatroomId: room, errorMessage: message});
})


app.post('/messages', async (req, res) => {
  const userQuery = aql`
  FOR user IN Users 
  FILTER user.username == ${req.body.userName}
  RETURN user._id`;
  const userCursor = await db.query(userQuery);
  const users = await userCursor.all();
  const user = users[0];

  const query = aql`INSERT {text: ${req.body.text}} IN Messages 
  LET inserted = NEW
  INSERT {_from: ${user}, _to:inserted._id}
  into Sender
  INSERT {_from:inserted._id, _to: ${req.body.chatroomId}} into Room
  RETURN { _key:inserted._key, text:inserted.text, userName:${req.body.userName}}`;
  const cursor = await db.query(query);

  
  const messages = await cursor.all();

  res.send(messages[0]);
})

app.post('/users', async (req, res) => {
  const username = req.body.username;
  const findUserQuery = aql`
  FOR user IN Users 
  FILTER user.username == ${req.body.username}
  RETURN user.username`;
  const findUserCursor = await db.query(findUserQuery);
  const users = await findUserCursor.all();
  let user = users[0];
  if (!user) {
    const userQuery =  aql`INSERT {username: ${username}} IN Users 
    LET inserted = NEW
    RETURN inserted.username`;
    const userCursor = await db.query(userQuery);
    const usersArray = await userCursor.all();
    user = usersArray[0];
  } 
  res.send({username: user});
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
