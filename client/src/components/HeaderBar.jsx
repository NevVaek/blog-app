import {AuthContext} from "../context/AuthContext.jsx";
import {UtilContext} from "../context/UtilContext.jsx";
import {useContext} from "react";
import SearchBar from "./Searchbar.jsx";
import {DefaultErrorMessage, DefaultSuccessMessage} from "./Messages.jsx";
import {LoginButton, SignupButton, LogoutButton} from "./Buttons.jsx";
import {Link} from "react-router-dom";

export default function HeaderBar() {
    const {user, loading} = useContext(AuthContext);
    const {errMessage, successMessage} = useContext(UtilContext);

    return (
        <>
            <div className="bg-black w-screen h-16 flex justify-between items-center px-2">
                <div >
                    <Link to="/" className="h-12 outline flex items-center sm:ml-2">
                        <p className="h-7 text-gray-300 text-xl">BLOGLOGO</p>
                    </Link>
                </div>
                <SearchBar/>

                <div className="mr-2 sm:mr-5 text-gray-300 flex items-center min-w-[120px]">
                    {loading && (
                        <div className="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>
                    )}

                    {!loading && !user && (
                        <div className="flex"><LoginButton className="mr-3"/><SignupButton/></div>
                    )}

                    {!loading && user && (
                        <div className="flex items-center"><Link to="/profile" className="flex align-center mr-3"><img src={user.icon} className="w-8 h-8 mr-2 rounded-full" alt="icon"/><div className="hidden sm:block">{user.username}</div></Link><LogoutButton className="hover:bg-gray-700"/></div>
                    )}
                </div>
            </div>
            {errMessage && (
              <DefaultErrorMessage err={errMessage}/>
            )}
            {successMessage && (
                <DefaultSuccessMessage msg={successMessage}/>
            )}
        </>
    );

}


