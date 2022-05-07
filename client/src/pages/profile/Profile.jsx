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

  const [user, setUser] = useState({});
  const id = useParams().id;

  useEffect(() => {
    const fetchUser = async () => {
      //en utilisant la list de post passe en parametre contenant les userId en recupere les differents nom d'utilisateur ayant publier les post
      try{
        const res = await axios.get("/api/user/"+id);
        setUser(res.data);
        
      }catch(e){
        console.log(e)
      }
     
    };
    fetchUser();
  }, [id,user]);
  
  return (
    
    <>
    {console.log(user,"user")}
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                 cover
                }
                alt=""
              />
              {
            user.profil!="" ? <img className="profileUserImg" src={require("../../../public/data/uploads/profil/"+user.profil)} />: <><img
            className="profileUserImg"
            src={pic}
            alt=""
          /></>
          }

              
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.login}</h4>
            </div>
          </div>
          <div className="profileRightBottom">
            
            <Feed id={user._id} />
           
            <Rightbar users={user}/>
          </div>
        </div>
      </div> 
    </>
  );
}
