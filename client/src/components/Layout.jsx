import HeaderBar from "./HeaderBar.jsx";


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

export function PageTitle({prompt}) {
    return (
        <div className="max-w-[70rem]">
            <h1 className="m-2 text-lg">{prompt}</h1>
            <hr className="m-4 ml-1"/>
        </div>
    );
}