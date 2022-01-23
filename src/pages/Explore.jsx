import { Link } from "react-router-dom";
import rentCategoryImage from "../assets/jpg/rentCategoryImage.jpg";
import sellCategoryImage from "../assets/jpg/sellCategoryImage.jpg";
import ExploreSlider from "../components/ExploreSlider";

function Explore () {
    return (
      <div className="explore">
      <header>
        <p className="pageHeader"></p>
      </header>

      <main>
        <ExploreSlider />
        <p className="exploreCategoryHeading">Categories</p>
        <div className="exploreCategories">
          
          <Link to="/category/rent">
            <img
              src={ rentCategoryImage }
              alt="rent"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Places for rent</p>
          </Link>

          <Link to="/category/sale">
            <img
              src={ sellCategoryImage }
              alt="sell"
              className="exploreCategoryImg"
            />
            <p className="exploreCategoryName">Place for sale</p>
          </Link>
          
        </div>
      </main>
      <h1>explore page</h1>
      </div>
      
      
    );
  }
  
  export default Explore;
  