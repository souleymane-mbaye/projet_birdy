import "./post.css";
import { Bookmark } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { ThumbUp } from "@material-ui/icons";
import noAvatar from "../../assets/person/noAvatar.png"

export default function Post({ post }) {
  const [like, setLike] = useState(post.likes.length);
  //le nombre de like reprensent la longeur de l'array contenant tout les utilisateur ayant aimer le post
  const [isLiked, setIsLiked] = useState(false);
  const [user, setUser] = useState({});
  //nous utilisant l'element user afin de recuperer les information de l'utilisateur aya publier un post et les afficher dans celui ci
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  //permet d'acceder au dossier a partir de n'import quelle position dans le site web
  //Et cela grace au fichier .env declarant le chemin pour atteindre les photo 
  const { user: currentUser } = useContext(AuthContext);


  /* on recupere une array contenant le liste des utilisateurs ayant liker le post */
  useEffect(() => {
    /* on verifie si l'user courant a aimer ce post ou pas */
    setIsLiked(post.likes.includes(currentUser.user._id));
  }, [currentUser._id, post.likes]);

  //RECUPERE LES UTILISATEURS
  useEffect(() => {
    const fetchUser = async () => {
      //en utilisant la list de post passe en parametre contenant les userId en recupere les differents nom d'utilisateur ayant publier les post
      const res = await axios.get("/api/user/"+post.author_id);
      setUser(res.data);
      
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = () => {
    try {
      console.log("currente",post)
      const idPost={
        message_id:post._id
      };
      /* on modifie l'array des like on prenant l'id du post et celui du user pour les ajouter a la list des like
      ou le supprimer si il l'avait deja liker et qu'il dislike maintenant */
      if(!isLiked){
        axios.patch("apimessages/user/"+currentUser.user._id +"/messages/like",idPost);
      }else{
        axios.patch("apimessages/user/"+currentUser.user._id +"/messages/unlike",idPost);
      }
      
    } catch (err) {}
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };
  console.log("photo path",`${PF}`+post?.picture);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user._id}`}>
               {/* si l'utilisateur ne possede pas de photos de profile 
              nous afficheront une photo specifique qui lui sevira de photo de profile */}
              <img
                className="postProfileImg"
                src={
                  user.profile
                    ? user.profile
                    : noAvatar
                }
                alt=""
              />
            </Link>
            <Link to={`/profile/${user._id}`} style={{ textDecoration: "none", color: "black"}}>
              <span className="postUsername">{user.login}</span>
                
            </Link>
            {/*    //nous avons utiliser la libraire timeago.js qui permet de calculer depuis quand le post a ete poster a partire de la createdAt presente dans la database*/}
            <span className="postDate">{format(post.date)}</span>
          </div>
          <div className="postTopRight">
            <Bookmark />
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.text}</span>
          {/*           //recuperation de l'image poste par le user*/}          
          <img className="postImg" src={`${PF}${post?.picture}`} alt="" />
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
          <ThumbUp
              className="likeIcon"
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
              htmlColor="blue"
            />
            <span className="postLikeCounter">{like} like</span>
          </div>
          <div className="postBottomRight">
            <span className="postCommentText">{post.comment} commentaires</span>
          </div>
        </div>
      </div>
    </div>
  );
}
