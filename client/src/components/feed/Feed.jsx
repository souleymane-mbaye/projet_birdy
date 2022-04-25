import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ id }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    const fetchPosts = async () => {
      const res =await axios.get("/apimessages/messages");

      const message=[]
      if(id){
        for(let mes of res.data.messages){
          if(mes.author_id==id){
            message.push(mes)
          }
        }
      }else{
        for(let mes of res.data.messages){
            message.push(mes)
          }
      }
      setPosts(        
          message.sort((p1, p2) => {
           return new Date(p2.date) - new Date(p1.date);
         }) 
       );
    };
    fetchPosts();
  }, [id, user._id]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(id)? <></>  : <Share/>}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
