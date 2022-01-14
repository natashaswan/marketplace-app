import { Navigate, Outlet } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import Spinner from "./Spinner";

const PrivateRoute = () => {
    // own hook to check if user is logged in
    const { loggedIn, checkingStatus } = useAuthStatus();

    if(checkingStatus){
        return(
        <> 
         <Spinner/>
        </>
        )
    }

    return (loggedIn ? <Outlet/> : <Navigate to="/sign-in"/>)
}

export default PrivateRoute;
