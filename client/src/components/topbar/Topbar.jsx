import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import pic from "../../assets/person/noAvatar.png";
import logo from "../../assets/birdyRBG.png";


export default function Topbar() {
  const { user } = useContext(AuthContext);
  console.log("test test ",user)
  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          {/* le text decoration sert a enelever l'effet de lien qui est sousligne  */}
          <img className="logo2" src={logo} alt=""></img>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Rechercher un utilisateur"
            className="searchInput"
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person />
          </div>
          {/* <div className="topbarIconItem">
            <Link to={"/messenger"} style={{ textDecoration: "none" , color: "green"}}>
              <Chat />
            </Link>
            
          </div> */}

        </div>
        <Link to={`/profile/${user.user._id}`} style={{ textDecoration: "none", color: "white"}}>
          <span className="topbarLink">{user.user.login}</span>
        </Link>
        <Link to={`/profile/${user.user._id}`}>
          <img
            src={
              user.user.profile
                ? user.user.profile
                : pic
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
