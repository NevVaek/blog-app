import {useState, useRef, useEffect} from "react";
import DotMenuIcon from "./icons/DotMenuIcon.jsx";
import {Link} from "react-router-dom";

export default function DotMenu({mode, link1, link2, link3, className}) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect( () => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [open]);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={(e) => {
                e.stopPropagation();
                setOpen((o) => !o);
            }} className={`p-2 rounded-full hover:bg-gray-700 ${className}`}>
                <DotMenuIcon color="white"></DotMenuIcon>
            </button>

            {open && (
                <div
                    className="absolute right-0 mt-2 w-32 rounded-md bg-gray-800 border border-gray-600 shadow-lg z-50"
            onClick={(e) => e.stopPropagation()}>
                    {mode === "blog" && (
                        <Link to={link1} className="block w-full text-left px-3 py-2 hover:bg-gray-700">
                            Share
                        </Link>
                    )}
                    {mode === "owner" && (
                        <>
                            <Link to={link1} className="block w-full text-left px-3 py-2 hover:bg-gray-700">
                                Share
                            </Link>
                            <Link to={link2} className="block w-full text-left px-3 py-2 hover:bg-gray-700">
                                Edit
                            </Link>
                            <button onClick={link3} className="block w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700">
                                Delete
                            </button>
                        </>
                    )}
                    {mode === "ownerMenu" && (
                        <>
                            <Link to={link1} className="block w-full text-left px-3 py-2 hover:bg-gray-700">
                                Posts
                            </Link>
                            <Link to={link2} className="block w-full text-left px-3 py-2 hover:bg-gray-700">
                                Edit
                            </Link>
                            <button onClick={link3} className="block w-full text-left px-3 py-2 text-red-400 hover:bg-gray-700">
                                Delete
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}