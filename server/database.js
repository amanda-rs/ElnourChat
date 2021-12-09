
var arangojs = require("arangojs");

function FillDatabase () {

    const messageArray = [];
    const messagesFromFile = [];
    const userFromFile = [];
    const usersArray = [];

    var fs = require("fs");
    fs.readFile("Server/words.txt", function (err, data) {
      if (err) throw err;
      var array = data.toString().split("\n");
      saveMessagesToDatabase(array);
    });

    fs.readFile("Server/names.txt", function (err, data) {
      if (err) throw err;
      var namesArray = data.toString().split("\n");
      saveUsersToArray(namesArray);
    });

    function saveUsersToArray(array) {
      for (j = 0; j < array.length; j++) {
        userFromFile.push(array[j]);
      }

      for (i = 0; i < userFromFile.length; i++) {
        usersArray.push({
          _key: `user${i + 1}`,
          username: userFromFile[i + 1],
        });
      }

      collectioUsers.import(usersArray).then(
        (result) => console.log("Import complete:"),
        (err) => console.error("Import failed:", err)
      );
    }

    function saveMessagesToDatabase(array) {
      for (j = 0; j < array.length; j++) {
        messagesFromFile.push(array[j]);
      }
      for (x = 0; x < messagesFromFile.length; x++) {
        messageArray.push({ _key: `M${x + 1}`, text: messagesFromFile[x] });
      }
      collectionMessages.import(messageArray).then(
        (result) => console.log("Import complete:", result),
        (err) => console.error("Import failed:", err)
      );
      sendersArray = [];
      for (j = 0; j < usersArray.length; j++) {
        sendersArray.push({
          _from: `Users/user${j + 1}`,
          _key: `S${i + 1}`,
          _to: `Messages/M${i + 1}`,
        });
      }
      senderEdge.import(sendersArray).then(
        (result) => console.log("Import complete:", result),
        (err) => console.error("Import failed:", err)
      );

      roomsArray = [];
      for (i = 0; i < 50; i++) {
        roomsArray.push({
          _from: `Messages/M${i + 1}`,
          _key: `R${i + 1}`,
          _to: `Chatrooms/room10`,
        });
      }
      roomEdge.import(roomsArray).then(
        (result) => console.log("Import complete:", result),
        (err) => console.error("Import failed:", err)
      );
    }

    const db = new arangojs.Database({
      url: process.env.ARANGO_DB_URL || "http://localhost:8529/",
      databaseName: "_system",
      auth: { username: "root", password: "rootpassword" },
    });

    collectionChatRooms = db.collection("Chatrooms");

    collectionMessages = db.collection("Messages");

    collectioUsers = db.collection("Users");

    collectionChatRooms.create().then(
      () => console.log("Collection created"),
      (err) => console.error("Failed to create collection:", err)
    );

    collectionChatRooms.update("Chatrooms", { d: "qux" }).then(
      (meta) => console.log("Chatrooms updated:"),
      (err) => console.error("Failed to update chatrooms:", err)
    );

    collectionMessages.create().then(
      () => console.log("Collection created"),
      (err) => console.error("Failed to create collection:", err)
    );

    collectionMessages.update("Messages", { d: "qux" }).then(
      (meta) => console.log("Messages updated:"),
      (err) => console.error("Failed to update messages:", err)
    );
    collectioUsers.create().then(
      () => console.log("Collection created"),
      (err) => console.error("Failed to create collection:", err)
    );

    collectioUsers.update("Users", { d: "qux" }).then(
      (meta) => console.log("Users updated:"),
      (err) => console.error("Failed to update users:", err)
    );

    Elnour = {
      _key: "elnourDoc",
      username: "Elnour",
    };

    collectioUsers.save(Elnour).then(
      (meta) => console.log("Elnour saved", meta._rev),
      (err) => console.error("Failed to save Elnour", err)
    );

    collectioUsers.update("elnourDoc", { d: "qux" }).then(
      (meta) => console.log("elnourDoc updated:"),
      (err) => console.error("Failed to update elnourDoc:", err)
    );

    const senderEdge = db.collection("Sender");
    senderEdge.create({ type: arangojs.CollectionType.EDGE_COLLECTION });

    const roomEdge = db.collection("Room");
    roomEdge.create({ type: arangojs.CollectionType.EDGE_COLLECTION });

    chatRoomArray = [];
    for (i = 0; i < 12; i++) {
      chatRoomArray.push({ _key: `room${i + 1}`, title: "ChatRoom" + i });
    }

    collectionChatRooms.import(chatRoomArray).then(
      (result) => console.log("Import complete:"),
      (err) => console.error("Import failed:", err)
    );



}

module.exports.database = FillDatabase;

