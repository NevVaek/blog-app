
export function ErrorMessage({err}) {
    return (
        <div className="absolute top-0 bg-gray-800 text-gray-300 border border-red-500 rounded-bl-2xl rounded-br-2xl p-4">
                {err}
        </div>
    )
}

export default function DefaultErrorMessage({err}) {
    return (
        <div className="w-full bg-red-500 p-0.5 pl-3">
            {err}
        </div>
    );
}

export function ErrorCodeMessage({type, code}) {
        return (
        <div className=" bg-gray-900 pt-2 pl-3 text-gray-300 min-h-full">
            <div className="w-full h-80 flex justify-center items-center font-bold text-2xl"> {code === 404 ? `Oops! ${type} doesn't seem to exist` : "Oops! Something went wrong! Please try again later"}
            </div>
        </div>
    );

}