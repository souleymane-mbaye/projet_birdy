import { Button, TextField } from "@mui/material";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import React from "react";
import Commentaire from "./Commentaire";
import SendIcon from '@mui/icons-material/Send'
import './comModel.css'

export default function ComModel({ closeModal,post }) {
    const [com, setCom] = useState([]);
    const desc = useRef();


    useEffect(() => {
        const fetchCom = async () => {
          const res =await axios.get("/apimessages/user/"+ +"/messages/comment");
    
          const message=[]
          
            for(let mes of res.data.messages){
              
                message.push(mes)
              
            }
            setCom(        
              message.sort((p1, p2) => {
               return new Date(p2.date) - new Date(p1.date);
             }) 
           );
        };
        fetchCom();
      }, [post]);


      const submitHandler = async (e) => {
        e.preventDefault();
        const newCom = {
          message: desc.current.value
        };
        try { 
          const res=await axios.post("apimessages/user/"+  +"/messages", newCom);
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
          <Commentaire key={c._id} com={c} />
        ))}
          
        </div>
        <div className="footer">
         
          <form className="post__form">
              <TextField
                label="Commenter"
                size="big"
                variant="outlined"
                className="post__input"
                placeholder="ajouter un commentaire"
                ref={desc}
              ></TextField>
              <Button
                variant="contained"
                size="small"
                endIcon={<SendIcon/>}
                onClick={submitHandler}
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
