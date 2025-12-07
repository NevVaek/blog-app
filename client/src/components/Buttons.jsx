import {Link} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";
import {useContext, useState} from "react";
import StarIcon from "../components/icons/StarIcon.jsx";

function BaseButton({to, onClick, children, className=""}) {
    const Component = to ? Link : "button";

    return (
        <Component
            to={to}
            onClick={onClick}
            className={`border p-1.5 rounded-lg hover:bg-gray-700 ${className}`}
        >
            {children}
        </Component>
    );
}

export function LoginButton({className}) {
    return (
        <BaseButton to="/login" className={className}>
            Login
        </BaseButton>
    );
}

export function SignupButton({className}) {
    return (
        <BaseButton to="/register" className={className}>
            Signup
        </BaseButton>
    );
}

export function LogoutButton({className}) {
    const {logout} = useContext(AuthContext);
    return (
        <BaseButton onClick={logout} className={className}>
            Logout
        </BaseButton>
    );
}

export function SubmitButton({prompt}) {
    return (
        <button type="submit" className="mt-5 text-gray-300 text-sm border border-fuchsia-50 rounded-md p-2 hover:bg-gray-700">{prompt}</button>
    )
}

export function FollowButton({className}) {
    return (
        <BaseButton className={className}>
            Follow
        </BaseButton>
    )
}

export function PostLikeButton({num}) {
    const [follow, setFollow] = useState(false);

    return (
            <button className="w-10 justify-between flex items-center" onClick={(e) => {
                e.stopPropagation();
                setFollow(!follow);
            }}>
                <StarIcon filled={follow}/> {num}
            </button>
    )
}