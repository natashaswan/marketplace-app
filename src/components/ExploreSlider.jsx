//react functions
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
//firebase functions
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { db } from "../firebase.config";
//carousel 
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
//load icon
import Spinner from "./Spinner";

SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function ExploreSlider() {
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState(null);

    const navigate = useNavigate();

    useEffect(()=>{

        const fetchListings = async () => {
            const listingsRef = collection(db, "listings");
            const q = query(listingsRef, orderBy("timestamp", "desc"),
            limit(5));
            const querySnapShot = await getDocs(q);
            
            let listings = [];

            querySnapShot.forEach((doc) => {
                return listings.push({
                    id: doc.id,
                    data: doc.data(),                
            });
        });

        setListings(listings);
        setLoading(false);
    };

    fetchListings();
}, []);

    if (loading) {
        return <Spinner />
    };

    if (listings.length === 0){
      return <>no images were uploaded for this listing</>
    }

    return (
        listings && (
            <>
              <p className='exploreHeading'>Recommended</p>
      
              <Swiper slidesPerView={1} pagination={{ clickable: true }}>
                {listings.map(({ data, id }) => (
                  <SwiperSlide
                    key={id}
                    onClick={() => navigate(`/category/${data.type}/${id}`)}
                  >
                    <div
                      style={{
                        background: `url(${data.imageUrls[0]}) center no-repeat`,
                        backgroundSize: 'cover',
                      }}
                      className='swiperSlideDiv'
                    >
                      <p className='swiperSlideText'>{data.name}</p>
                      <p className='swiperSlidePrice'>
                        ${data.discountedPrice ?? data.regularPrice}{' '}
                        {data.type === 'rent' && '/ month'}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </> 
          )
        )
      }
export default ExploreSlider;
