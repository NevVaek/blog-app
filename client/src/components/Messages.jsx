import {Link} from "react-router-dom";

export function ErrorMessage({err}) {
    return (
        <div className="absolute top-5 sm:top-32 bg-gray-800 text-gray-300 border border-red-500 rounded-lg p-3">
                {err}
        </div>
    )
}

export function DefaultMessage({msg}) {
    if (msg.text === null) return

    return (
        <div
            key={msg.id}
            className={`mx-auto max-w-4xl my-1 rounded px-4 py-2 text-white
            ${msg.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
            {msg.text}
        </div>
    )
}

export function DefaultErrorMessage({err}) {
    return (
        <div className="absolute w-full bg-red-500 p-0.5 pl-3">
            {err}
        </div>
    );
}

export function DefaultSuccessMessage({msg}) {
    return (
        <div className="absolute w-full bg-green-500 p-0.5 pl-3">
            {msg}
        </div>
    );
}

export function ErrorCodeMessage({type, code, url}) {
        return (
        <div className=" bg-gray-900 w-full h-80 pt-2 pl-3 text-gray-300 min-h-full flex flex-col justify-center items-center">
            <div className=" font-bold text-2xl"> {code === 404 ? `Oops! ${type} doesn't seem to exist` : "Oops! Something went wrong! Please try again later"}</div>
            <Link to={url} className="mt-3 border rounded-lg p-2">Return</Link>
        </div>
    );
}

export function FullPageErrorMessage({err}) {
    return (
        <div className=" bg-gray-900 pt-2 pl-3 text-gray-300 min-h-full">
            <div className="w-full h-80 flex justify-center items-center font-bold text-2xl"> {err}
            </div>
        </div>
    );
}

export function FullPageNoContent({mode, owner}) {
    return (
        <div className=" bg-gray-900 pt-2 pl-3 text-gray-300 min-h-full">
            <div className="w-full h-80 flex justify-center items-center font-bold text-2xl">
                {mode === "blog" && !owner && "WELP, it's PITCH BLACK! Come back later or create your own blogs here."}
                {mode === "blog" && owner && "Nothing is more exciting than a blank canvas. Create your own blogs here."}
                {mode === "post" && !owner && "Hello, anybody home..? Come back later, they might be home by then."}
                {mode === "post" && owner && "Your room looks empty! Why don't you add some furnitures and lighten things up? Add posts here."}
                {mode === "err" && "Oops something broke. Refresh the page or try again later"}
            </div>
        </div>
    )
}