import {Link} from "react-router-dom";

export function ShowcaseUser({src, displayName, alt, link}) {
    return (
        <div className="mr-3 text-sm opacity-90">
            <Link to={link} className="flex">
                <img src={src} className="w-6 h-6 mr-2 rounded-full" alt={alt}/>{displayName}
            </Link>
        </div>
    );
}