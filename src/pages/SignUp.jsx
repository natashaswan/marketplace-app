import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import OAuth from "../components/OAuth";

//notification library from react-toastify
import { toast } from "react-toastify";


//writing data to db
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config"

// authenitcation functions from firebase
import { getAuth, 
  createUserWithEmailAndPassword, 
  updateProfile } 
from "firebase/auth";

//icons for UI
import { ReactComponent as ArrowRightIon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";

function SignUp () {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(
    {
      name: "",
      email: "",
      password: "",
    }
  )
  

  const { name, email, password } = formData;

  const onChangeHandler = (e) => {
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const navigate = useNavigate();

  const onSubmitHandler = async (e) => {
      e.preventDefault();      
      
      try{
        const auth = getAuth()
        const userCredential = await createUserWithEmailAndPassword
        (
          auth,
          email,
          password

        );
       
        const user = userCredential.user;

        updateProfile(auth.currentUser, {
          displayName: name,
          })
          

        //creating a variable to hold a copy of data
        const formDataCopy = {...formData}
        
        //deleteing password from the db
        delete formDataCopy.password;

        formDataCopy.timeStamp = serverTimestamp();
        
        await setDoc(doc(db, "users", user.uid), formDataCopy)
        
        navigate("/")
        } 

          catch (error){
            toast.error("Something went wrong with registration")
          }
    }

    return (
      <>
        <div className="pageContainer">
        <header>
          <p className="pageHeader">Sign Up</p>
        </header>

        <form onSubmit={ onSubmitHandler }>
        
          <input
            type="text"
            className="nameInput"
            placeholder="name"
            id="name"
            value={ name }
            onChange={onChangeHandler}
          />
          <input
            type="email"
            className="emailInput"
            placeholder="email"
            id="email"
            value={ email }
            onChange={onChangeHandler}
          />

          <div className="passwordInputDiv">
          <input
            type={ showPassword ? "text" : "password" }
            className="passwordInput"
            placeholder="password"
            id="password"
            value={ password }
            onChange={onChangeHandler}
          />
          <img 
              src={ visibilityIcon } 
              alt="show password" 
              className="showPassword"
              onClick={ () => setShowPassword((prevState) => !prevState) }
          />
          </div>      
            

          <div className="signUpBar" >
            <p className="signUpText">Sign Up</p>
            <button className="signUpButton">
              <ArrowRightIon fill="#fffff" width="34px" height="34px"/>
            </button>
          </div>

        </form>

        <OAuth/>
        <div>
        <Link to="/sign-in" className="registerLink"> Sign in instead </Link>
        </div>
        
      </div>
      </>     
      
      
    );    
}
  export default SignUp;