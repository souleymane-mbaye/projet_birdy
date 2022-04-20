import "./sidebar.css";
import {
  RssFeed,
  Chat,
  Bookmark,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { logoutCall } from "../../apiCalls";



export default function  Sidebar() {

  const history = useHistory();
  const { user } = useContext(AuthContext);
  const { isFetching, dispatch } = useContext(AuthContext);

  const handleClick = async (e) => {
    
    e.preventDefault();
    
    try {
      await axios.delete("/api/user/"+user.user._id+"/logout");
      logoutCall(
        { },
        dispatch
      );
      history.push("/");
    } catch (err) {
      console.log(err,"erreur");
    }
  };

  return (

    <div className="sidebar">
      
      <div className="sidebarWrapper">
        <ul className="sidebarList">
          <li className="sidebarListItem">
            <Link to={"/"}  style={{ textDecoration: "none" , color: "darkslategray"}}>
              <RssFeed className="sidebarIcon" />
              <span className="sidebarListItemText">Feed</span>
            </Link>
          </li>
      
          {/* <li className="sidebarListItem">
            <Link to={"/messenger"}  style={{ textDecoration: "none" , color: "darkslategray"}}>
              <Chat className="sidebarIcon" />
              <span className="sidebarListItemText">Messages</span>
            </Link>
          </li> */}
          
          <li className="sidebarListItem">
            <Link to={""}  style={{ textDecoration: "none" , color: "darkslategray"}}>
              <Bookmark className="sidebarIcon" />
              <span className="sidebarListItemText">Favoris</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to={"/"}  style={{ textDecoration: "none" , color: "darkslategray"}} onClick={handleClick}>
              <LogoutIcon className="sidebarIcon" />
              <span className="sidebarListItemText">Deconnexion</span>
            </Link>
          </li>
         
        </ul>
        <hr className="sidebarHr" />
        
      </div>
    </div>
  );
}
 