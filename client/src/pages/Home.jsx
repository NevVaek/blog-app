import {useEffect, useState, useContext} from "react";
import {getBlogs} from "../services/api.js";
import Layout, {PageTitle} from "../components/Layout.jsx"
import HomeSkeleton from "../components/skeletons/HomeSkeleton.jsx";
import {FullPageNoContent} from "../components/Messages.jsx";
import {useNavigate} from "react-router-dom";
import {ShowcaseUser} from "../components/Displays.jsx";
import {UtilContext} from "../context/UtilContext.jsx";
import {AuthContext} from "../context/AuthContext.jsx";

export default function Home() {
    const [blogs, setBlogs] = useState([]);
    const [contentLoading, setContentLoading] = useState(true);
    const {setErrMessage} = useContext(UtilContext);
    const {loading} = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const result = await getBlogs();

            if (result.status === "ok") {
                setBlogs(result.payload);
            } else if (result.status === "err") {
                console.log("YAHH")
                throw new Error(result.payload);
            }

        } catch {
            setErrMessage("Something went wrong. Please try again later")
        } finally {
            setContentLoading(false);
        }
    }

    if (loading || contentLoading) return <HomeSkeleton/>;

    return (
        <Layout>
            <div className="mx-auto max-w-[70rem]">
                <PageTitle prompt="Top Blogs -Discover Your New Favourite Community!"/>
                <div>
                    {Array.isArray(blogs) && blogs.length !== 0 ? blogs.map(blog => (
                        <div key={blog.id} onClick={() => navigate(`/blogs/${blog.blogSlug}`)}
                             className="block max-w-4xl rounded-lg border border-gray-300 mb-6">
                                <div className="h-28 w-full overflow-hidden rounded-lg">

                                    <img
                                        src={blog.banner}
                                        className="h-full w-full object-cover" alt="banner"/>
                                </div>
                                <div className="rounded-md bg-gray-500 p-3 text-white">
                                    <div className="text-xl font-bold break-words">{blog.blogName}</div>
                                    <div className="flex items-center my-2">
                                        <ShowcaseUser src={blog.owner.icon} displayName={blog.owner.username} alt="icon"/>
                                        <div className="text-xs opacity-70">{blog.followers} Followers</div>
                                    </div>
                                    <div className="max-h-20 line-clamp-3">
                                        {blog.description}
                                    </div>
                                </div>
                        </div>
                    )) : <div><FullPageNoContent mode="blog"/></div>}
                </div>
            </div>
        </Layout>
    );
}