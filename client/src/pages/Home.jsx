import {useEffect, useState, useContext} from "react";
import {getBlogs} from "../services/api.js";
import Layout, {PageTitle} from "../components/Layout.jsx"
import HomeSkeleton from "../components/skeletons/HomeSkeleton.jsx";
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
        getBlogs().then(setBlogs).catch(err => {
            setErrMessage(err);
        });
        setContentLoading(false);
    }, []);

    if (loading || contentLoading) return <HomeSkeleton/>;

    return (
        <Layout>
            <div className="mx-auto max-w-[70rem]">
                <PageTitle prompt="Top Blogs -Discover Your New Favourite Community!"></PageTitle>
                <div>
                    {Array.isArray(blogs) && blogs.map(blog => (
                        <div key={blog.id} onClick={() => navigate(`/${blog.blogSlug}`)}
                             className="block max-w-4xl rounded-lg border bg-amber-200 border-gray-300 mb-6" style={{backgroundColor: "red"}}>
                                <div className="h-28 w-full overflow-hidden rounded-lg">
                                    <img
                                        src={blog.banner}
                                        className="h-full w-full object-cover" alt="banner"/>
                                </div>
                                <div className="rounded-md bg-gray-500 p-3 text-white">
                                    <div className="text-xl font-bold">{blog.blogName}</div>
                                    <div className="flex items-center">
                                        <ShowcaseUser src={blog.owner.icon} displayName={blog.owner.username} alt="icon"/>
                                        <div className="text-xs opacity-70">{blog.followers} Followers</div>
                                    </div>
                                    <div className="max-h-20 line-clamp-3">
                                        {blog.description}
                                    </div>
                                </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}