import { useState, useEffect, useRef } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
//load icon
import Spinner from "../components/Spinner";
//firestore storage for uploading images
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
  } from "firebase/storage";
import { doc, updateDoc, serverTimestamp, getDoc } from "firebase/firestore";
// db 
import { db } from "../firebase.config";
import { v4 as uuidv4 } from "uuid";
//error/success notifications
import { toast } from "react-toastify";

function EditListing() {
    const [geolocationEnabled, setGeolocationEnabled] = useState(false);
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(false);
    const [formData, setFormData] = useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: "",
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: [],
        latitude: 0,
        longitude: 0,
    })
    //destructuring formData
    const {type, 
           name, 
           bedrooms, 
           bathrooms, 
           parking, 
           furnished, 
           regularPrice, 
           offer, 
           address, 
           discountedPrice, 
           images, 
           latitude, 
           longitude, 
        } = formData;

    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);
    const params = useParams();

//redirect if listing is not user's
useEffect(() => {
    if(listing && listing.userRef !== auth.currentUser.uid){
        toast.error("You can not edit that listing")
        navigate("/")
    }
})

//fetches listing to edit
    useEffect(()=> {
        setLoading(true)
        const fetchUserListings = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnapShot = await getDoc(docRef);
            
            if (docSnapShot.exists()) {
                setListing(docSnapShot.data());
                //console.log(docSnapShot.data().imageUrls);
                setFormData({ ...docSnapShot.data(), address: docSnapShot.data().location})
                //console.log(images)
                setLoading(false);
            } else {
                navigate("/");
                toast.error("Listing does not exist");
            }
        } 
        fetchUserListings();
        
    },[params.listingId, navigate])
    
    const oldImages = formData.imageUrls;
    
//sets userRef to logged in user
    useEffect(()=>{
        if(isMounted) {
            onAuthStateChanged(auth, (user) => {
                if(user) {
                    setFormData({...formData, userRef: user.uid})
                } else {
                    navigate("/sign-in")
                }
            })
        }
        return ()=>{
            isMounted.current = false
        }
    }, [isMounted])

    const onSubmit = async (e) =>{
        e.preventDefault();
        setLoading(true)

//check input data
    
    if (discountedPrice >= regularPrice){
        setLoading(false);
        toast.error("Discounted must be less than regular price");
        return
    }
    
    if (images && images.length > 6){
            setLoading(false)
            toast.error("Max 6 images")
            return
    } 
    
    

//store images in db function
    const storeImage = async (image) => {

    return new Promise((resolve, reject)=>{
        const storage = getStorage();
        const fileName = `${auth.currentUser.uid}-${uuidv4()}-${image.name}`;
        //console.log(fileName);

//create reference to storage  
        const storageRef = ref(storage, "images/" + fileName);
        //console.log(storageRef);
        const uploadTask = uploadBytesResumable(storageRef, image);
//upload progress indication        
        uploadTask.on(
            'state_changed', 
            (snapshot) => {
            const progress = 
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;      
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case 'paused':
                    console.log('Upload is paused');
                    break;
                case 'running':
                    console.log('Upload is running');
                    break;
                    default:
                        break
            }
        }, 
        (error) => {
          console.log(error)
          reject(error)    
        }, 
        () => {
// handle successful uploads on complete
// for instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        resolve(downloadURL)
        });
      });
    });
    }
    
//array of Uploaded imgs
    let imageUrls = await Promise.all(
        [...images].map((image) => storeImage(image))
      ).catch(() => {
        setLoading(false)
        toast.error('Images not uploaded')
        return
      })
      
      imageUrls = [ ...imageUrls, ...oldImages]
      
      const formDataCopy = {
        ...formData,
        imageUrls,
        timestamp: serverTimestamp()
      }
      
      console.log(formDataCopy);
      formDataCopy.location = address
      delete formDataCopy.images;
      
      !formDataCopy.offer && delete formDataCopy.discountedPrice;
      
//update listing
      const docRef = doc(db, "listings", params.listingId)
      console.log(docRef);
      await updateDoc(docRef, formDataCopy)
      setLoading(false)
      toast.success("Listing saved");
      navigate(`/category/${ formDataCopy.type }/${docRef.id}`)
    }

    const onMutate = (e) =>{
        let boolean = null;

        if (e.target.value === "true"){
            boolean = true
        }

        if (e.target.value === "false"){
            boolean = false
        }

        if(e.target.files){
            setFormData((prevState) => ({
                ...prevState,
                images: e.target.files,
            }))
        }
        if(!e.target.files){
            setFormData((prevState) => ({
                ...prevState,
                [e.target.id]: boolean ?? e.target.value,
            }))
        }
    }

    if (loading){
    return <Spinner />
    }
    
return (
    
    <div className="profile">
        <header>
            <p className="pageHeader">Edit listing</p>
        </header>

        <main>
            <form onSubmit={onSubmit}>
{/* sell or rent? */} 
            <label className="formLabel">Sell / Rent</label>
                <div className="formButtons">
                <button 
                    type="button" 
                    className= { type === "sale" 
                    ? "formButtonActive" 
                    : "formButton" }
                    id="type"
                    value="sale"
                    onClick={ onMutate }>
                    Sell
                </button>

                <button 
                    type="button" 
                    className= { type === "rent" 
                    ? "formButtonActive" 
                    : "formButton" }
                    id="type"
                    value="rent"
                    onClick={ onMutate }>
                    Rent
                </button>
                </div>

{/* listing title */} 
                <label className="formLabel">Title</label>
                
                    <input
                    type="text" 
                    className= "formInputName"
                    id="name"
                    value={name}
                    onChange={ onMutate }
                    maxLength="32"
                    minLength="10"
                    required />                

{/* # of bedrooms */} 
                <div className="formRooms flex">
                <div>
                <label className="formLabel">Bedrooms</label>             
                <input
                    type="number" 
                    className= "formInputSmall"
                    id="bedrooms"
                    value={bedrooms}
                    onChange={ onMutate }
                    min="1"
                    max="50"
                    required />
                </div>
                </div>

{/* # of bathrooms */}    
                <div>           
                <label className="formLabel">Bathrooms</label>             
                
                <input
                    type="number" 
                    className= "formInputSmall"
                    id="bathrooms"
                    value={bathrooms}
                    onChange={ onMutate }
                    min="1"
                    max="50"
                    required />
                </div>                 
            

{/* Parking? */}
            <label className="formLabel">Parking spot</label>
        <div className="formButtons">
            <button
                    type="button" 
                    className= { parking 
                    ? "formButtonActive" 
                    : "formButton" }
                    id="parking"
                    value={true}
                    onClick={ onMutate }
                   >
                    Yes
            </button>
            <button
                    type="button" 
                    className= { !parking
                    && parking !== null 
                    ? "formButtonActive" 
                    : "formButton" }
                    id="parking"
                    value={false}
                    onClick={ onMutate }>
                    No
            </button>
        </div>
{/* Furnished? */}
        <label className="formLabel">Furnished</label>
        <div className="formButtons">
            <button
                    type="button" 
                    className= { furnished 
                    ? "formButtonActive" 
                    : "formButton" }
                    id="furnished"
                    value={true}
                    onClick={ onMutate }
                    >
                    Yes
            </button>
            <button
                    type="button" 
                    className= { !furnished 
                    && furnished !== null 
                    ? "formButtonActive" 
                    : "formButton" }
                    id="furnished"
                    value={false}
                    onClick={ onMutate }
                    >
                    No
            </button>
        </div> 
{/* address */}
          <label className="formLabel">Address</label>
          <textarea
              className="formInputAddress"
              type="text"
              id="address"
              value={address}
              onChange={ onMutate }
              required
          /> 
{/* geolocation */}
        {!geolocationEnabled && (
            <div className='formLatLng flex'>
              <div>
                <label className='formLabel'>Latitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='latitude'
                  value={latitude}
                  onChange={onMutate}
                  required
                />
              </div>
              <div>
                <label className='formLabel'>Longitude</label>
                <input
                  className='formInputSmall'
                  type='number'
                  id='longitude'
                  value={longitude}
                  onChange={onMutate}
                  required
                />
              </div>
            </div>
          )}
{/* offer */} 
            <label className="formLabel">Offer</label>
            <div className="formButtons">
            <button
                    type="button" 
                    className= { offer 
                    ? "formButtonActive" 
                    : "formButton" }
                    id="offer"
                    value={true}
                    onClick={ onMutate }
                    >
                    Yes
            </button>
            <button
                    type="button" 
                    className= { !offer 
                    && offer !== null 
                    ? "formButtonActive"
                    : "formButton" }
                    id="offer"
                    value={false}
                    onClick={ onMutate }
                    >
                    No
            </button>
        </div>
{/* regular/discounted price */}
        
                <label className='formLabel'>Regular Price</label>
                <div className="formPriceDiv">
                <input
                  className='formInputSmall'
                  type='number'
                  id='regularPrice'
                  value={regularPrice}
                  onChange={onMutate}
                  min="50"
                  max="750000000"
                  required
                />
                               
                {type === "rent" && <p className="formPriceText">$ / Month</p>}
        </div>
        {offer && (
            <>
                <label className="formLabel">Discounted Price</label>
                <input
                    className="formInputSmall"
                    type='number'
                    id='discountedPrice'
                    value={discountedPrice}
                    onChange={onMutate}
                    min="50"
                    max="750000000"
                    required={offer}
                />
            </>
        )}
{/* images */}
        <label className='formLabel'>Images</label>
          <p className='imagesInfo'>
            The first image will be the cover (max 6).
          </p>
          <input
            className='formInputFile'
            type='file'
            id='images'
            onChange={onMutate}
            max='6'
            accept='.jpg,.png,.jpeg'
            multiple
            //required
          />
          <button type='submit' className='primaryButton createListingButton'>
            Edit Listing
          </button>

            </form>
        </main>
    </div>       
    )
}

export default EditListing;