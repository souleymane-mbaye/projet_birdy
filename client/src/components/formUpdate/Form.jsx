import {useContext, useRef,useState } from "react";
import { Cancel } from "@material-ui/icons";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import "./form.css"
import {
    PermMedia} from "@material-ui/icons";

export default function Form() {
    const { user } = useContext(AuthContext);
    const [file, setFile] = useState(null);
    const email = useRef();
    const login = useRef();
    const prenom = useRef();
    const nom = useRef();
    const bio = useRef();
    const password = useRef();
    const passwordAgain = useRef();
    const [text, setText] = useState("");


    const submitHandler = async (e) => {
        e.preventDefault();
         
        if (file) {
          const data = new FormData();
          const fileName = Date.now() + file.name;
          data.append("name", fileName);
          data.append("file", file);
          try {
            await axios.post("/api/user/"+user.user._id+"/upload-profil", data);
          } catch (err) {}
        }
        try {
          
          //a revoir
          if(email.current.value!=""||login.current.value!=""||prenom.current.value!=""||nom.current.value!=""){
            const update={
              email:email.current.value,
              login:login.current.value,
              lastname:nom.current.value,
              firstname:prenom.current.value,
            };
            await axios.patch("api/user/"+user.user._id,update);
          }
          if(bio.current.value!=""){
            const bioval=
            {bio: bio.current.value,
            };
            await axios.patch("/api/user/"+ user.user._id+"/bio",bioval);
          }
          
          //window.location.reload();
        } catch (err) {
          console.log("erreur");
        }
      };

  return (
    <div className="form" >
      <div className="formWrapper">
          <form  onSubmit={submitHandler}>
          <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                name="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => {
                  setFile(e.target.files[0])
                  setText("fichier ajouter avec succés")
                }}
              />
              <pre>             {text}</pre>
            </label>


            <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
                <input className="input100" type="email" ref={email} name="email" placeholder="Email"/>
                <span className="focus-input100"></span>
               
              </div>
              
              <div className="wrap-input100 validate-input">
                <input className="input100" type="text" ref={login} name="Login" placeholder="@Login"/>
                <span className="focus-input100"></span>
               
              </div>

              <div className="wrap-input100 validate-input">
                <input className="input100" type="text" ref={prenom}  name="firstname" placeholder="Prénom"/>
                <span className="focus-input100"></span>
               
              </div>
              <div className="wrap-input100 validate-input">
                <input className="input100" type="text" ref={nom} name="lastname" placeholder="Nom"/>
                <span className="focus-input100"></span>
              </div>

              <div className="wrap-input100 validate-input" data-validate = "bio">
                <textarea className="input100" type="text" ref={bio}  name="bio" placeholder="bio"/>
                <span className="focus-input100"></span>      
              </div>
             {/*  <div className="wrap-input100 validate-input" data-validate = "Saisir un mot de passe">
                <input className="input100" type="password" required ref={password} name="pass" placeholder="Mot de passe"/>
                <span className="focus-input100"></span>
                
              </div>
             
              
              <div className="wrap-input100 validate-input" required data-validate = "Saisir un mot de passe">
                <input className="input100" type="password" required ref={passwordAgain} name="pass" placeholder="Confirmer le mot de passe"/>
                <span className="focus-input100"></span>
                
              </div> */}
              
              
              <div className="container-login100-form-btn">
                <button className="login100-form-btn" type="submit">
                  Modifier
                </button>
              </div>
          </form>
      </div>
    </div>
  );
}
