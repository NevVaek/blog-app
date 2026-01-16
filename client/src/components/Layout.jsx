import HeaderBar from "./HeaderBar.jsx";
import {CreatePostButton} from "./Buttons.jsx";

export default function Layout({children}) {
    return (
        <div className="h-screen bg-black">
            <HeaderBar />
            <div className="mt-16 bg-gray-900 text-gray-300 pl-3 pt-6 p-4 min-h-full">
                {children}
            </div>
        </div>
    );
}

export function PageTitle({prompt, blogSlug, displayB}) {
    return (
        <div className="max-w-[58rem]">
            <div className="flex justify-between items-center h-14">
                <h1 className="m-2 text-lg">{prompt}</h1>
                {displayB && prompt === "Top Posts" && <CreatePostButton blogSlug={blogSlug}/>}
            </div>
            <hr className="m-1 ml-1"/>
        </div>
    );
}