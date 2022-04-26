import "./following.css"
import React from 'react'
import Topbar from '../../components/topbar/Topbar'
import CloseFriend from '../../components/closeFriend/CloseFriend'
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import Sidebar from '../../components/sidebar/Sidebar';
import Rightbar from '../../components/rightbar/Rightbar';
import pic from "../../assets/person/noAvatar.png";
import { color } from "@mui/system";


export default function Following() {
    //A completer
    const [friends, setFriends] = useState([]);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const id = useParams().id;
    const [followed, setFollowed] = useState(
      currentUser.user.followers.includes(id)
    );
    useEffect(() => {
      const getFriends = async () => {
        try {
          const friendList = await axios.get("/apifriends/user/"+id+"/friends/");
          const liste=friendList.data.friends.followings;
          const listFriend=[]
          for(const friend in liste){
            const res = await axios.get("/api/user/"+liste[friend]);
            listFriend.push(res.data)
          }
          setFriends(listFriend)
        } catch (err) {
          console.log(err);
        }
      };
      
      getFriends();
   }, []);




  return friends.length!=0? (
    
    <div>
        <Topbar/>
        <div className="Container">
          <Sidebar/>
          <div className="friendsDisplay">
            <div >
              {friends.map((friend) => (
                <div className="userCard">
                  <Link to={"/profile/" + friend.id} style={{ textDecoration: "none" }} >
                    <div className="user">
                      <img
                        src={
                          friend.profile
                            ?  friend.profile
                            : pic
                        }
                        alt=""
                        className="userImg"
                      />
                      <div className="userInfo">
                        <div>
                          <span className="userlog" >{friend.login}</span>
                        </div>
                        <span className="userlog" >{friend.lastname} {friend.firstname}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
           
          </div> 
          <Rightbar/>
        </div>
    </div>
  ):
  <div>
    <Topbar/>
        <div className="Container">
          <Sidebar/>
          <div className="friendsDisplay" >
              <h2 className="titre">Aucun following</h2>
          </div> 
          <Rightbar/>
        </div>
    </div>
  ;
}
