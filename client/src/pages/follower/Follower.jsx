import pic from "../../assets/person/noAvatar.png";
import "./follower.css"
import Topbar from '../../components/topbar/Topbar'
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import Sidebar from '../../components/sidebar/Sidebar';
import Rightbar from '../../components/rightbar/Rightbar';


export default function Follower() {
    
    const [friends, setFriends] = useState([]);
    const id = useParams().id;

    
    useEffect(() => {
      const getFriends = async () => {
        try {
          const friendList = await axios.get("/apifriends/user/"+id+"/friends/");
          const liste=friendList.data.friends.followers;
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
            
         
              {friends.map((friend) => (
                <div className="userCard">
                  <Link to={"/profile/" + friend._id} style={{ textDecoration: "none" }} >
                    <div className="user">
                    {
                 friend.profil!="" ? <img className="userImg" src={require("../../../public/data/uploads/profil/"+friend.profil)} />: <><img className="profileUserImg" src={pic} alt=""/></>
              }
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
          <Rightbar/>
        </div>
    </div>
  ):
  <div>
    <Topbar/>
        <div className="Container">
          <Sidebar/>
          <div className="friendsDisplay" >
              <h2 className="titre">Aucun follower</h2>
          </div> 
          <Rightbar/>
            
        </div>
    </div>
  ;
  
}


/* import "./follower.css"
import React from 'react'
import Topbar from '../../components/topbar/Topbar'
import { AuthContext } from "../../context/AuthContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import Sidebar from '../../components/sidebar/Sidebar';
import Rightbar from '../../components/rightbar/Rightbar';
import pic from "../../assets/person/noAvatar.png";


export default function Follower() {
    //A completer
    const [friends, setFriends] = useState([]);
    const { user: currentUser, dispatch } = useContext(AuthContext);
    const id = useParams().id;
   
    
    useEffect(() => {
      const getFriends = async () => {
        try {
          const friendList = await axios.get("/apifriends/user/"+id+"/friends");
          console.log(friendList);
          const list=[]
          for(const friend of friendList.data.friends.followers){
            try{
              const res = await axios.get("/api/user/"+friend);
              list.push(res.data)
              
            }catch(e){
              console.log(e)
            }
          }
          setFriends(list)
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
          <div >
              <div className="rightbarFollowings">
              {console.log("frrri",friends)}
              {friends.map((friend) => (
                
                <Link to={"/profile/" + friend._id} style={{ textDecoration: "none" }} >

                  <div className="rightbarFollowing">
                  {
                 friend.profil!="" ? <img className="profileUserImg" src={require("../../../public/data/uploads/profil/"+friend.profil)} />: <><img className="profileUserImg" src={pic} alt=""/></>
              }
                    <span className="rightbarFollowingName">{friend.login}</span>
                  </div>
                </Link>
              ))}
            </div>
            <Rightbar/>
          </div>
        </div>
    </div>
  ):<>
   <div>
        <Topbar/>
        <div className="Container">
          <Sidebar/>
        </div>
    </div>
  </>
}
 */