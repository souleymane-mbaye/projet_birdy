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
      const res = id
      //ICI
        ? await axios.get("/apimessages/user/"+id+"/infos")
        : await axios.get("/apimessages/messages");
      
      setPosts(
        res.data.messages.sort((p1, p2) => {
          return new Date(p2.date) - new Date(p1.date);
        })
      );
    };
    fetchPosts();
  }, [id, user._id]);
  return (
    <div className="feed">
      <div className="feedWrapper">
        {(id === user.user._id)? <></>  : <Share/>}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
