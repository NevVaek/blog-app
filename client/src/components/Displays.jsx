import {Link} from "react-router-dom";

export function ShowcaseUser({src, displayName, alt, link, mode}) {
    if (mode === "preview")  return (
        <div className="mr-3 opacity-90">
            <div className="flex text-xs">
                <img src={src} className="w-4 h-4 mr-2 rounded-full" alt={alt}/>{displayName}
            </div>
        </div>
    )

        return (
        <div className="mr-3 text-sm opacity-90">
            <Link to={link} className="flex">
                <img src={src} className="w-6 h-6 mr-2 rounded-full" alt={alt}/>{displayName}
            </Link>
        </div>
    );
}