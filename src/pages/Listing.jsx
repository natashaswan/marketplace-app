import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase.config";
import { BsShareFill } from 'react-icons/bs';
import shareIcon from "../assets/svg/shareIcon.svg";
// slider
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
//error notification
import { toast } from "react-toastify";
//map 
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
//spinner when loading
import Spinner from "../components/Spinner";
import ExploreSlider from "../components/ExploreSlider";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function Listing() {
    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [shareLinkCopied, setShareLinkCopied] = useState(false);
    
    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(()=>{
        const fetchListing = async () => {
            const docRef = doc(db, "listings", params.listingId);
            const docSnap = await getDoc(docRef);

            if(docSnap.exists()) {
                console.log(docSnap.data());
                setListing(docSnap.data());
                setLoading(false)
            }
        }
        fetchListing()
    }, [navigate, params.listingId])
    
    if(loading){
        return <Spinner />
    }
    return (
        <main>
            <Swiper slidesPerView={1} pagination={{clickable: true}}>
                { listing.imageUrls.map((url,index) => (
                    <SwiperSlide key={ index }>
                        <div 
                            style={{
                            background: `url(${listing.imageUrls[index]}) center no-repeat`,
                            backgroundSize: "cover",
                            }} 
                            className="swiperSlideDiv"
                            >
                        </div>
                    </SwiperSlide>
                )) }
            </Swiper>

        {/* share listing icon */}
            <div className="shareIconDiv" onClick={()=>{
                navigator.clipboard.writeText(window.location.href)
                setShareLinkCopied(true)
                setTimeout(() => {
                    setShareLinkCopied(false)
                }, 2000)
            } }>
                <BsShareFill />
            </div>

            {shareLinkCopied && <p className="linkCopied">Link Copied!</p>}
        
        {/* price in listing */}
        <div className="listingDetails">
            <p className="listingName">
                {listing.name} - ${listing.offer
                ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            </p>
        
        {/* location in listing */}
            <p className="listingLocation">{ listing.location }</p>
       
        {/* rent? or sale? */}   
            <p className="listingType">
                For { listing.type === "rent" ? "Rent" : "Sale" }
            </p>

        {/* offer? */}
            {listing.offer && (
                <p className="discountPrice">
                    ${ listing.regularPrice - listing.discountedPrice }
                    discount
                </p>
            )}

        {/* number of bedrooms in listing */}
            <ul className="listingDetails">
                <li>
                    {  listing.bedrooms > 1 
                    ? `${ listing.bedrooms } Bedrooms`
                    : "1 Bedroom"}
                </li>

        {/* number of bathrooms in listing */}
                <li>
                    {  listing.bathrooms > 1 
                    ? `${ listing.bathrooms } Bathrooms`
                    : "1 Bathroom"}
                </li>
         {/* parking? */}
                <li>
                    {  listing.parking 
                    && "Parking spot" }
                </li>
         {/* furnished?*/}
                <li>
                    {  listing.furnished 
                    && "Furnished" }
                </li>
            </ul>
            
            <p className="listingLocationTitle">Location</p>
        {/*map*/}
            <div className='leafletContainer'>

          <MapContainer
            style={{ height: '100%', width: '100%' }}
            //center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url='https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png'
            />

            {/* <Marker
              position={[listing.geolocation.lat, listing.geolocation.lng]}
            >
              <Popup>{listing.location}</Popup>
            </Marker> */}

          </MapContainer>
        </div>
            
            { auth.currentUser?.uid !== listing.userRef && (
                <Link 
                    to={`/contact/${ listing.userRef }?
                    listingName=${ listing.name }`}
                    className="primaryButton">
                    Contact landlord
                </Link>
            )}
        </div>
        
        </main>
    )
}

export default Listing;
