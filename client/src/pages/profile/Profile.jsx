import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useContext,useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import pic from "../../assets/person/noAvatar.png";
import cover from "../../assets/person/noCover.png";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";


export default function Profile() {

  const { user } = useContext(AuthContext);

  return (
    <>
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  user.user.coverPicture
                    ? user.user.coverPicture
                    : cover
                }
                alt=""
              />
              <img
                className="profileUserImg"
                src={
                  user.user.profile
                    ?  user.user.profile
                    : pic
                }
                alt=""
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.user.login}</h4>
              <span className="profileInfoDesc">{user.user.bio}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            
            <Feed id={user.user._id} />
           
            <Rightbar users={user}/>
          </div>
        </div>
      </div>
    </>
  );
}
