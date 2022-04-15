import axios from "axios";
import { useContext, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import { useHistory } from "react-router";

export default function Login() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  //useRef est un hooks que l'on utilise pour recuperer l'email et le mps du formulaire
  const history = useHistory();
  const email = useRef();
  const password = useRef();

  /* on utilise ce hook de useContexte pour utiliser le dispatche de AuthContext dans l'appel de login call */
  const { isFetching, dispatch } = useContext(AuthContext);

  /* sur le clique du boutton de connexion on appelle notre fct */
  const handleClick = async (e) => {
    e.preventDefault();
    console.log(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.current.value));
    /* dans le cas ou tout les elements sont bien
    inserer il faudra cree une variable user qui possedera les attributs cree  */
    const email_val = (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.current.value) ? email.current.value : "");
    const login_val = (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.current.value) ? email.current.value : "");
    console.log("Reg",email_val);
    
    const user = {
      login: login_val,
      email: email_val,
      password: password.current.value,
    };
    
    /* puis on utilise un post pour inscrire l'utilisateur puis on utilise 
    le hook history qui  nous permet de rediriger l'utilisateur vers la page de login */
    try {
      await axios
        .post("/api/user/login", user)
        .then((res) => {console.log("Res",res);})
      history.push("/");
    } catch (err) {
      /*
      Ajout de Inner Html
      */
      console.log(err);
    }
  };

  return (
    <div className='bg-model'>
        
      <div>
        <div className="container-login100">
          <div className="wrap-login100">
            <div>
              <img src={PF+"birdyRBG.png"} alt="Birdy" className="logo"/>
            </div>

            <form onSubmit={handleClick}>
              <span className="login100-form-title">
                Connexion
              </span>

              <div className="wrap-input100 validate-input"/*  data-validate = "Valid email is required: ex@abc.xyz" */>
                <input className="input100" required type="text" ref={email} name="email" placeholder="Email"/>
                <span className="focus-input100"></span>
               
              </div>

              <div className="wrap-input100 validate-input" data-validate = "Password is required">
                <input className="input100" required ref={password} type="password" name="pass" placeholder="Mot de passe"/>
                <span className="focus-input100"></span>
                
              </div>
              {/* ici on effectue une verification si la recherche est en cours si c'est le cas le bouton sera
            desactiver et l'icone de chargement sera afficher dans le cas contraire on aura
            notre simple bouton de log in*/}

              <div className="container-login100-form-btn">
                <button className="login100-form-btn" type="submit" disabled={isFetching}>
                  {isFetching ? (
                  <CircularProgress color="white" size="20px" />
                    ) : (
                  "Connexion"
                    )}
                </button>
              </div>

              

              <div>
                <Link className="txt2" to='./register' style={{ textDecoration: "none"  }}>
                  <button className="logRegisterButton">
                    {isFetching ? (
                      <CircularProgress color="white" size="20px" />
                    ) : (
                      "Inscription"
                    )}
                  </button>
                  
                </Link>
              </div>
              
              <div >
                
                <Link className="txt2" to="#">
                  Mot de passe oublie?
                </Link>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
