import axios from "axios";
import { useRef } from "react";
import "./register.css";
import { useHistory } from "react-router";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const firstname = useRef();
  const lastname = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;


  /* avant d'envoyer les données on doit tout d'abord verifier 
  que les mots de passes inserer sont bien identique */
  const handleClick = async (e) => {
    e.preventDefault();
    if (passwordAgain.current.value !== password.current.value) {
     
      passwordAgain.current.setCustomValidity("Passwords don't match!");
    } else {
      /* dans le cas ou tout les elements sont bien
      inserer il faudra cree une variable user qui possedera les attributs cree  */
      const user = {
        login: username.current.value,
        // email: email.current.value,
        password: password.current.value,
        confirmpassword: passwordAgain.current.value,
        lastname: lastname.current.value,
        firstname: firstname.current.value,
      };
      /* puis on utilise un post pour inscrire l'utilisateur puis on utilise 
      le hook history qui  nous permet de rediriger l'utilisateur vers la page de login */
      try {
        await axios.post("/api/user", user);
        history.push("/login");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className='bg-model'>
        
      <div>
        <div className="container-login100">
          <div className="wrap-login100">
            <div>
              <img src={PF+"birdyRBG.png"} className="logo" alt="Birdy"/>
            </div>

            <form onSubmit={handleClick}>
              <span className="login100-form-title">
                Inscription
              </span>

              <div className="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
                <input className="input100" type="email" ref={email} name="email" placeholder="Email"/>
                <span className="focus-input100"></span>
               
              </div>
              
              <div className="wrap-input100 validate-input">
                <input className="input100" type="text" ref={username} name="Login" placeholder="@Login"/>
                <span className="focus-input100"></span>
               
              </div>

              <div className="wrap-input100 validate-input">
                <input className="input100" type="text" ref={firstname} name="firstname" placeholder="Prénom"/>
                <span className="focus-input100"></span>
               
              </div>
              <div className="wrap-input100 validate-input">
                <input className="input100" type="text" ref={lastname} name="lastname" placeholder="Nom"/>
                <span className="focus-input100"></span>
              </div>

              <div className="wrap-input100 validate-input" data-validate = "Saisir un mot de passe">
                <input className="input100" type="password" ref={password} name="pass" placeholder="Mot de passe"/>
                <span className="focus-input100"></span>
                
              </div>
              <div className="wrap-input100 validate-input" data-validate = "Saisir un mot de passe">
                <input className="input100" type="password" ref={passwordAgain} name="pass" placeholder="Confirmer le mot de passe"/>
                <span className="focus-input100"></span>
                
              </div>
              
              <div className="container-login100-form-btn">
                <button className="login100-form-btn" type="submit">
                  Incription
                </button>
              </div>

             
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
