/* import { Button, TextField } from "@mui/material";
import React from "react";
import Commentaire from "./Commentaire";
import './popComment'
function comModel({ closeModal }) {
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
            <b>Commentaire</b>
        </div>
        <div className="body">
          <Commentaire/> 
          
        </div>
        <div className="footer">
         
          <form className="post__form">
              <TextField
                label="Commenter"
                size="big"
                variant="outlined"
                className="post__input"
                placeholder="ajouter un commentaire"
              ></TextField>
              <Button
                variant="contained"
                size="small"
                endIcon={"r"}
                //onClick=
                type="submit"
                >
                Envoyer
              </Button>
            </form>
          
        </div>
      </div>
    </div>
  );
}

export default comModel;
 */