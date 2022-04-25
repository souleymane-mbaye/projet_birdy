import "./follower.css"
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


export default function Follower() {
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
          setFriends(friendList.data.friends.followers);
        } catch (err) {
          console.log(err);
        }
      };
      getFriends();
    }, []);




  return (
    <div>
        <Topbar/>
        <div className="Container">
          <Sidebar/>
          <div >
            <p>testttt</p>
              <div className="rightbarFollowings">
              {friends.map((friend) => (
                <Link to={"/profile/" + friend.id} style={{ textDecoration: "none" }} >

                  <div className="rightbarFollowing">
                    <img
                      src={
                        friend.profile
                          ?  friend.profile
                          : "person/noAvatar.png"
                      }
                      alt=""
                      className="rightbarFollowingImg"
                    />
                    <span className="rightbarFollowingName">{friend.login}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Rightbar/>
          </div>
        </div>
    </div>
  )
}
