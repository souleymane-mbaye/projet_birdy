import "./share.css";
import {
  PermMedia,
  Label,
  Room,
  EmojiEmotions,
  Cancel,
} from "@material-ui/icons";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import Avatar  from "../../assets/person/noAvatar.png";

export default function Share() {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const desc = useRef();
  const [file, setFile] = useState(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    const newPost = {
      message: desc.current.value
    };
    try {
      //ICI
      const res=await axios.post("/apimessages/user/"+user.user._id+"/messages", newPost);
      console.log("new post test",);
      
      if (file) {
        const data = new FormData();
        const fileName = Date.now() + file.name;
        data.append("name", fileName);
        data.append("file", file);
        newPost.img = fileName;
        console.log("new post",newPost);
         
<<<<<<< HEAD
        await axios.post("/apimessages/user/"+user.user._id+"/messages/"+res.data.id+"/upload-picture", data);
=======
        await axios.post("/apimessages/user/"+user.user._id+"/messages/"+res.data.id+"/uploadpicture", data);
>>>>>>> fbcd574ae800b443103e25dfa663dde036e25092
        console.log("new post test",);

      }
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
    
    
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.user.profilePicture
                ? user.user.profile
                : Avatar
            }
            alt=""
          />
          <input
            placeholder={"Tweeter " + user.user.login }
            className="shareInput"
            ref={desc}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
           
  
            <div className="shareOption">
              <EmojiEmotions htmlColor="goldenrod" className="shareIcon" />
              <span className="shareOptionText">Emoji</span>
            </div>
          </div>
          <button className="shareButton" type="submit">
            Tweeter
          </button>
        </form>
      </div>
    </div>
  );
}
