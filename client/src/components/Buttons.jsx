import {Link} from "react-router-dom";
import {useState} from "react";
import StarIcon from "../components/icons/StarIcon.jsx";

export function BaseButton({to, onClick, children, className=""}) {
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

export function SubmitButton({prompt, disable}) {
    return (
        <button type="submit" disabled={disable} className={`${disable ? "opacity-50 cursor-not-allowed" : ""} text-gray-300 text-lg border border-fuchsia-50 rounded-md p-2 hover:bg-gray-700`}>{disable ? "Sending.." : prompt}</button>
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
export function UserMenuButton({prompt, link="", onClick=null, children}) {
    if (link) return (
        <Link to={link} className="flex items-center rounded-md w-48 p-2 font-semibold hover:bg-gray-700">
            {children}
            <div className="ml-4">{prompt}</div>
        </Link>
    )
    return (
        <button onClick={onClick} className="flex items-center rounded-md w-48 p-2 font-semibold hover:bg-gray-700">
            {children}
            <div className="ml-4">{prompt}</div>
        </button>
    )
}