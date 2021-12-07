

import Navbar from './Navbar';
import Home from './Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import EnterName from './EnterName';
import Chat from './Chat';
import Chatrooms from './Chatrooms';
import NewChatroom from './NewChatroom';


function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="content">
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route exact path="/enterName">
              <EnterName />
            </Route>
            <Route path="/chat/:id">
              <Chat />
            </Route>
            <Route exact path="/chatrooms">
              <Chatrooms />
            </Route>
            <Route exact path="/newChatroom">
              <NewChatroom />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
