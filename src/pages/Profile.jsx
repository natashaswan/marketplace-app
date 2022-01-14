import { useState } from "react";
import { getAuth, updateProfile } from   "firebase/auth";
import { useNavigate } from "react-router-dom";

//fuctions to update user
import { updateDoc, doc } from "firebase/firestore";

//db
import { db } from "../firebase.config";

//notofications from toastify
import { toast } from "react-toastify";

function Profile () {
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);
  
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  const onLogout = () => {
     auth.signOut();
     navigate("/")
   }


    const onSubmit = async () =>{
     try{
      if(auth.currentUser.displayName !== name) {
        //update display name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        })
        //Update in firestore
        const userRef = doc(db, "users", auth.currentUser.uid)
        await updateDoc(userRef, {
          name: name
        })
      }

     }
     catch (erros){
      toast.error("Something went wrong")
     }
   }

    const onChange = (e) =>{
      setFormData((prevState)=>({
        ...prevState,
        [e.target.id]: e.target.value,
      }))
    }
    return (
      <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My profile</p>
        <button className="logOut" type="button" onClick={ onLogout }>Logout</button>
      </header>

        <main>
          <div className="profileDetailsHeader">
            <p className="profileDetailsText">Personal Details</p>
            
          </div>
              <div className="profileCard">
                <form>
                  <input
                    type="text"
                    id="name"
                    className= { !changeDetails ? "profileName" : "profileNameActive" }
                    disabled={!changeDetails}
                    value={ name }
                    onChange={ onChange }

                  />
                {/* fb does not allow to change email */}
                  <input
                    type="text"
                    id="email"
                    className= "profileEmailActive" 
                    disabled={true}
                    value={ email }
                    onChange={ onChange }

                  />
                </form>
              </div>
              <p className="changePersonalDetails"
              onClick={ ()=>{
                changeDetails && onSubmit()
                setChangeDetails((prevState)=> !prevState)
              } }>
              { changeDetails ? "done" : "update name" }
            </p>
        </main>
      </div>
      
      
    );
  }
  
  export default Profile;