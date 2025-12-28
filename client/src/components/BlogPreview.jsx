import {ShowcaseUser} from "./Displays.jsx";
import ExpandableDesc from "./ExpandableDesc.jsx";
import defaultImg from "../assets/default.jpg"

export default function BlogPreview({name, descText, preview, blog=null, user=null}) {
    return (
        <div className="border p-3 rounded-lg">
            <div className="mb-2 text-xl">Preview</div>
            <div className="max-h-20 max-w-full m-2 overflow-hidden rounded-lg">
                <img src={preview || (blog ? blog.banner : defaultImg)} alt="preview" className="h-40 w-full object-cover object-center bg-gray-600"/>
            </div>
            <div className="rounded-md bg-gray-500 p-3 text-white">
                <div className="flex items-center justify-between">
                    <div className="text-xl mb-2 break-all">{name}</div>
                </div>
                <div className="mb-2 w-full flex items-center justify-between">
                    <ShowcaseUser mode="preview" src={blog ? blog.owner.icon : user.icon} displayName={blog ? blog.owner.username : user.username} alt="icon"/>
                </div>
                <ExpandableDesc text={descText} lines={3} txtSize="text-sm"/>
            </div>
            <div>
                <div>
                    <div className="mb-3">Top Posts<hr/></div>
                    <div className="m-2">
                        {/* Post title */}
                        <div className="h-6 w-40 bg-gray-700 rounded mb-3"></div>
                        {/* Post user */}
                        <div className="flex items-center mb-3">
                            <div className="w-6 h-6 bg-gray-700 rounded-full mr-3"></div>
                            <div className="h-4 w-24 bg-gray-700 rounded"></div>
                        </div>

                        {/* Post body/image */}
                        <div className="w-full h-32 bg-gray-700 rounded"></div>
                        <hr className="m-3 border-gray-700" />
                    </div>
                </div>
            </div>
        </div>
    );
}