import {AuthContext} from "../context/AuthContext.jsx";
import {UtilContext} from "../context/UtilContext.jsx";
import {useContext, useState, useRef, useEffect} from "react";
import SearchBar from "./Searchbar.jsx";
import {DefaultErrorMessage, DefaultSuccessMessage, DefaultMessage} from "./Messages.jsx";
import {LoginButton, SignupButton} from "./Buttons.jsx";
import {Link} from "react-router-dom";
import UserMenu from "./UserMenu.jsx";

export default function HeaderBar() {
    const {user, loading} = useContext(AuthContext);
    const {messages} = useContext(UtilContext);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const menuRef = useRef(null);

    useEffect( () => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowUserMenu(false);
            }
        }

        if (showUserMenu) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [showUserMenu]);

    return (
        <>
            <div className="fixed top-0 bg-black w-screen h-16 flex justify-between items-center px-2 z-50">
                <div >
                    <Link to="/" className="h-12 outline flex items-center sm:ml-2">
                        <p className="h-7 text-gray-300 text-xl">BLOGLOGO</p>
                    </Link>
                </div>
                <SearchBar/>

                <div className="mr-2 sm:mr-5 text-gray-300 flex items-center">
                    {loading && (
                        <div className="w-24 h-6 bg-gray-700 rounded animate-pulse"></div>
                    )}

                    {!loading && !user && (
                        <div className="flex"><LoginButton className="mr-3"/><SignupButton/></div>
                    )}

                    {!loading && user && (
                        <div ref={menuRef} className="flex items-center">
                            <button onClick={(e) => {e.stopPropagation(); setShowUserMenu((o) => !o)}} className="flex align-center mr-3 p-1 rounded-lg hover:bg-gray-900">
                                <img src={user.icon} className="w-8 h-8 mr-2 rounded-full" alt="icon"/>
                                <div className="hidden sm:block">{user.username}</div>
                            </button>
                            {!loading && user && showUserMenu && (
                                    <UserMenu user={user}/>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="fixed top-[64px] left-0 w-full z-50">
                {
                    messages.map(msg => (
                        <DefaultMessage msg={msg}/>
                    ))
                }
            </div>

        </>
    );

}


