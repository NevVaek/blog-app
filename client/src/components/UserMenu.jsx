import {useContext} from "react";
import {Link} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";
import {UserMenuButton} from "./Buttons.jsx";
import ProfileIcon from "./icons/ProfileIcon.jsx";
import SettingsIcon from "./icons/SettingsIcon.jsx";
import ContentsIcon from "./icons/ContentsIcon.jsx";
import StarIcon from "./icons/StarIcon.jsx";
import LogoutIcon from "./icons/LogoutIcon.jsx";

export default function UserMenu({user}) {
    const {logout} = useContext(AuthContext);


    return (
        <div className="fixed right-3 top-16 w-56 max-h-fit bg-gray-800 p-3 pt-6 rounded-md z-40 flex flex-col items-center text-gray-300">
            <Link to={""} className="flex flex-col items-center rounded-md">
                <img src={user.icon} alt="icon" className="rounded-full w-24 h-24"/>
                <div className="font-bold text-center">{user.username}</div>
            </Link>
            <hr className="w-44 mt-3" />
            <div className="mt-2">
                <UserMenuButton prompt="Profile">
                    <ProfileIcon/>
                </UserMenuButton>
                <UserMenuButton prompt="Following">
                    <StarIcon size="30"/>
                </UserMenuButton>
                <UserMenuButton prompt="Contents" link={"/create"}>
                    <ContentsIcon/>
                </UserMenuButton>
                <UserMenuButton prompt="Account">
                    <SettingsIcon/>
                </UserMenuButton>
                <div className="my-12"></div>
                <UserMenuButton prompt="Logout" onClick={logout}>
                    <LogoutIcon/>
                </UserMenuButton>
            </div>
        </div>
    )
}