import "./sidebar.css";
import {
  RssFeed,
  Chat,
  Bookmark,
} from "@material-ui/icons";
import { Link } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';

export default function Sidebar() {
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
      
          <li className="sidebarListItem">
            <Link to={"/messenger"}  style={{ textDecoration: "none" , color: "darkslategray"}}>
              <Chat className="sidebarIcon" />
              <span className="sidebarListItemText">Messages</span>
            </Link>
          </li>
          
          <li className="sidebarListItem">
            <Link to={""}  style={{ textDecoration: "none" , color: "darkslategray"}}>
              <Bookmark className="sidebarIcon" />
              <span className="sidebarListItemText">Favoris</span>
            </Link>
          </li>
          <li className="sidebarListItem">
            <Link to={"/"}  style={{ textDecoration: "none" , color: "darkslategray"}}>
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
