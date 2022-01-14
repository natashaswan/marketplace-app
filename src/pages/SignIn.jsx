import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIon } from "../assets/svg/keyboardArrowRightIcon.svg";
import visibilityIcon from "../assets/svg/visibilityIcon.svg";
import OAuth from "../components/OAuth";


//notification library from react-toastify
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

//signing-in function from firebase
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"

function SignIn () {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(
    {
      email: "",
      password: ""
    }
  )

  const {email, password} = formData 

  function onChangeHandler(e){
    setFormData((prevState)=>({
      ...prevState,
      [e.target.id]: e.target.value,
    })
    )}

  const navigate = useNavigate();

  async function onSubmitHandler(e){
    e.preventDefault();
    try{
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      email, 
      password);

    if (userCredential.user){
      navigate("/")
    }
    
  } catch(error){
    toast.error("No user found");
  }
  }

    return (
      <>
        <div className="pageContainer">
        <header>
          <p className="pageHeader">Welcome Back!</p>
        </header>

        <form onSubmit={ onSubmitHandler }>
        <div>
          <input
            type="email"
            className="emailInput"
            placeholder="email"
            id="email"
            value={ formData.email }
            onChange={onChangeHandler}
          />
          <div className="passwordInputDiv">
          <input
            type={ showPassword ? "text" : "password" }
            className="passwordInput"
            placeholder="password"
            id="password"
            value={ formData.password }
            onChange={onChangeHandler}
          />
          <img src={ visibilityIcon } 
               alt="show password" 
               className="showPassword"
               onClick={ () => setShowPassword((prevState) => !prevState) }
          />
          </div>
         
        </div>
          <Link to="/forgot-password"
          className="forgotPasswordLink">
            Forgot Password
          </Link> 

          <div className="signInBar">
            <p>Sign In</p>
            <button className="signInButton">
              <ArrowRightIon fill="white" width="34px" height="34px"/>
            </button>
          </div>
        </form>
        <OAuth />

        <Link to="/sign-up" className="registerLink"> Sign up instead </Link>
        </div>
      </>     
      
      
    );    
}
  export default SignIn;