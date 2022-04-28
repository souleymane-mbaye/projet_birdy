import { Button, TextField } from "@mui/material";
import { useRef,useContext, useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import Commentaire from "./Commentaire";
import SendIcon from '@mui/icons-material/Send'
import './comModel.css'
import { AuthContext } from "../../context/AuthContext";


export default function ComModel({ closeModal,post }) {
    const [com, setCom] = useState([]);
    const desc = useRef();
    const { user } = useContext(AuthContext);


    useEffect(() => {
        
          const message=[]
          
            for(let mes of post.comments){
              
                message.push(mes)
              
            }
            setCom(        
              message.sort((p1, p2) => {
               return new Date(p2.date) - new Date(p1.date);
             }) 
           );
        
      }, [post]);


      const submitHandler = async (e) => {
        e.preventDefault();
        const newCom = {
            message_id: post._id,
          comment_text: desc.current.value
        };
        try { 
            if(desc.current.value!="")
                await axios.patch("/apimessages/user/"+user.user._id  +"/messages/comment", newCom);
        } catch (err) {
          console.log(err);
        }
        window.location.reload();
      };
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              closeModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="title">
            <b>Commentaires</b>
        </div>
        <div className="body">
        {com.map((c) => (
            <div>
          <Commentaire key={c._id} com={c} /> <br/>
          </div>
        ))}
          
        </div>
        <div className="footer">
         
          <form className="post__form" onSubmit={submitHandler}>
              <input
                label="Commenter"
                size="big"
                variant="outlined"
                className="post__input"
                placeholder="ajouter un commentaire"
                ref={desc}
              />
              <Button
                variant="contained"
                size="small"
                endIcon={<SendIcon/>}
                
                type="submit"
                >
                Envoyer
              </Button>
            </form>
        </div>
      </div>
    </div>
  )
}
