import {useState, useEffect} from "react";

export default function Searchbar() {
    const [search, setSearch] = useState("");

    useEffect(() => {
        console.log(search);    //Temporary filler
    }, [search])

    const handleSubmit = async (e) => {
        e.preventDefault();
        //Temporary blank
    }

    return (
        <div className="w-6/12">
            <form onSubmit={handleSubmit} className="flex items-center border border-gray-300 rounded-3xl w-full min-w-min h-9 justify-between hover:bg-gray-800">
                <input type="text" onChange={e => setSearch(e.target.value)} placeholder="Search Something..." className=" text-gray-300 pl-3 outline-0 w-full bg-transparent focus:outline-none"/>
                <button type="submit" className="text-gray-300 mr-3 border-l pl-2">Search</button>
            </form>
        </div>
    );
}