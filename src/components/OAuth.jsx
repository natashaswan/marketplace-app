import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc,setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import googleIcon from "../assets/svg/googleIcon.svg";


function OAuth() {
    const navigate = useNavigate();
    const location = useLocation();

    //sign-in with google function
    const onGoogleClick = async () => {
        try{
          const auth = getAuth();
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const user = result.user;
          
          //getting the user info from db
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          //if user does not exist create user
          if(!docSnap.exists()){
              await setDoc(doc(db, "users", user.uid), {
                  name: user.displayName,
                  email: user.email,
                  timeStamp: serverTimestamp()

              })
          } navigate("/")
        }
        catch (error){
            error.toast("Error occured. Try again.")
        }
    }

    return (
        <div className="socialLogin">
            <p>
                Sign { location.pathname === "/sign-up" ? "up " : "in " }
                with 
            </p>
            <button className="socialIconDiv" onClick={ onGoogleClick }>
                <img className="socialIconImg" src={ googleIcon } alt="google" />
            </button>
        </div>
    )
}

export default OAuth;
