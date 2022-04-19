import "./rightbar.css";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";

export default function Rightbar({ users }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.user.followings.includes(users?.user._id)
  );

  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${users._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: users._id });
      } else {
        await axios.put(`/users/${users._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: users._id });
      }
      setFollowed(!followed);
    } catch (err) {
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {users.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Nom:</span>
            <span className="rightbarInfoValue">{users.user.lastname}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Prenom:</span>
            <span className="rightbarInfoValue">{users.user.firstname}</span>
          </div>
          
        </div>
        <Link to={`/update/${users.user._id}`} style={{ textDecoration: "none", color: "white"}}> 
                <button className="rightbarUpdateButton" > Update</button>
        </Link> 
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {users ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
