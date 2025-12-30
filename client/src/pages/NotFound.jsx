import Layout from "../components/Layout.jsx";
import TextInput from "../components/TextInput.jsx";
import {BaseButton} from "../components/Buttons.jsx";
import NotFoundImage from "../assets/404Image.png"

export default function NotFound() {

    return (
        <div className="min-h-screen w-screen flex items-center flex-col bg-gray-800">
            <div className="mt-20 p-4 max-w-lg sm:w-6/12 sm:rounded-3xl sm:min-w-min sm:h-auto sm:p-4 sm:mt-48 flex flex-col items-center justify-center">
                <img src={NotFoundImage} alt="404 Image" className="border-8 rounded-full w-44 h-44 mb-3"/>
                <h2 className="font-handwritten text-3xl text-gray-300 mb-5">Page Not Found</h2>
                <div className="font-handwritten text-xl text-gray-300 mb-5 text-center">Welp! I might have misplaced my monocles. Sorry about that.</div>
                <BaseButton to={"/"} className="text-gray-200">Explore new blog communities</BaseButton>
            </div>
        </div>
    )
}