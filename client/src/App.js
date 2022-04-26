import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Register from "./pages/register/Register";
import Setup from "./pages/setup/Setup";
import Update from "./pages/update/Update";
import Follower from "./pages/follower/Follower";
import Following from "./pages/following/Following";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { user } = useContext(AuthContext);
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Home /> : <Setup />}
        </Route>
        <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">
          {user ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/profile/:id">
          <Profile />
        </Route>
        <Route path="/update/:id">
          <Update/>
        </Route>
        <Route path="/followers/:id">
          <Follower/>
        </Route>
       <Route path="/followings/:id">
          <Following/>
        </Route> 
      </Switch>
    </Router>
  );
}

export default App;
