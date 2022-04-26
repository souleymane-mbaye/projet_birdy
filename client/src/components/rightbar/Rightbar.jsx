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
    currentUser.user.followings.includes(users?._id)
  );
  const [usere, setUsere] = useState({});
  //rajouter un useEFfect pour modifier le current user et le followed

  useEffect(() => {
    const fetchUser = async () => {
      try{
        const res = await axios.get("/api/user/"+currentUser.user._id);
        setUsere(res.data);
        setFollowed(res.data.followings.includes(users?._id))
      }catch(e){
        console.log("erreur",e)
      }     
    };
    fetchUser();
    
  }, [currentUser]);


  const handleClick = async () => {
    try {
      if (followed) {
        await axios.delete("/apifriends/user/"+currentUser.user._id+"/friends/"+users._id);
      } else {
        await axios.post("/apifriends/user/"+users._id+"/friends", {
          login: currentUser.user.login,
        });
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
        {users._id !== currentUser.user._id && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}
        <h4 className="rightbarTitle">Information:</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Nom:</span>
            <span className="rightbarInfoValue">{users.lastname}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Prenom:</span>
            <span className="rightbarInfoValue">{users.firstname}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Bio:</span>
            <span className="rightbarInfoValue">{users.bio? users.bio : "vide"}</span>
          </div>
          
          {/* <div className="rightbarInfoItem">
            <Link to={`/followings/${users._id}`}  style={{ textDecoration: "none"}}>
              <span className="rightbarInfoKey">Followings:</span>
              <span className="rightbarInfoValue">{users.followings.length}</span>
            </Link>
          </div> */}
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Email:</span>
            <span className="rightbarInfoValue">{users.email}</span>
          </div>
          <span>
            <span className="rightbarInfoItem">
              <Link to={`/followers/${users._id}`}  style={{ textDecoration: "none"}}>
                <button className="rightbarFollowButton2" > Followers</button>
              </Link>
              <Link to={`/followings/${users._id}`}  style={{ textDecoration: "none"}}>
                <button className="rightbarFollowButton2" > Followings</button>
              </Link>
            </span>
            {users._id == currentUser.user._id && (
            <div className="rightbarInfoItem">
              <Link to={`/update/${users._id}`} style={{ textDecoration: "none", color: "white"}}> 
                <button className="rightbarUpdateButton" > Update</button>
              </Link> 
            </div>
             )}
            
          </span>
        </div>
        
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
