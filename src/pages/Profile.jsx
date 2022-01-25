//react functions
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
//firebase functions
import { getAuth, updateProfile } from   "firebase/auth";
import ListingItem from "../components/ListingItem";
//fuctions to update user
import { updateDoc, doc, collection, getDocs, where, orderBy, query, deleteDoc } from "firebase/firestore";
//db
import { db } from "../firebase.config";
//notifications from toastify
import { toast } from "react-toastify";
//imgs and icons
import arrowRight from "../assets/svg/keyboardArrowRightIcon.svg";
import homeIcon from "../assets/svg/homeIcon.svg";

function Profile () {
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
    
  const auth = getAuth();

  const [changeDetails, setChangeDetails] = useState(false);
  
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  });

  const { name, email } = formData;

  const navigate = useNavigate();

  useEffect(()=>{
    
    const fetchUserListings = async () => {
      const listingsRef = collection(db, "listings");

      const q = query(
        listingsRef,
        where("userRef", "==", auth.currentUser.uid),
        orderBy("timestamp", "desc")
      );

      const querySnap = await getDocs(q);

      const listings = [];

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data()
        })
      })
      setListing(listings);
      setLoading(false);
    }
    fetchUserListings();
  }, [auth.currentUser.uid])

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
        //update in firestore
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
    const onDelete = async (listingId)=> {
      if(window.confirm("Are you sure you want to delete?")) {
        await deleteDoc(doc(db, "listings", listingId));
        const updatedListings = listing.filter((listing) =>
        listing.id !== listingId);
        setListing(updatedListings);
        toast.success("Successfully deleted listing")
      }
    }

    const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)

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
               {/* change profile info */}
               <p className="changePersonalDetails"
              onClick={ ()=>{
                changeDetails && onSubmit()
                setChangeDetails((prevState)=> !prevState)
              } }>
              { changeDetails ? "done" : "update name" }
            </p>

              <Link to="/create-listing" className="createListing">
              <img src={homeIcon} alt="home" />
              <p>Sell or rent your home</p>
              <img src={ arrowRight } alt="arrow right"></img>

              </Link>
              {/* this user's listings */}
              {!loading && listing.length > 0 && (
                <>
                  <p className="listingText">
                    Your Listings
                  </p>
                  <ul className="lisingsList">
                    {listing.map((listing)=>(
                      <ListingItem 
                        key={ listing.id } 
                        listing={ listing.data } 
                        id={ listing.id } 
                        onDelete={ ()=>onDelete(listing.id)} 
                        onEdit={ ()=>onEdit(listing.id)}>
                      </ListingItem>
                    ))}
                  </ul>
                </>
              )}

             
        </main>
      </div>
      
      
    );
  }
  
  export default Profile;