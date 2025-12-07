import Layout, {PageTitle} from "../components/Layout.jsx";
import {getBlogPosts} from "../services/api.js";
import {useState, useEffect, useContext} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {ShowcaseUser} from "../components/Displays.jsx";
import {ErrorCodeMessage} from "../components/ErrorMessage.jsx"
import BlogSkeleton from "../components/skeletons/BlogSkeleton.jsx";
import DatePrompt from "../components/DatePrompt.jsx";
import {PostLikeButton} from "../components/Buttons.jsx";
import {AuthContext} from "../context/AuthContext.jsx";
import {UtilContext} from "../context/UtilContext.jsx";
import {FollowButton} from "../components/Buttons.jsx";
import DotMenu from "../components/DotMenu.jsx";

export default function Blog() {
    const {blogSlug} = useParams();
    const [page, setPage] = useState(1);
    const [blog, setBlog] = useState(null);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [err, setErr] = useState(null);
    const [loadMoreError, setLoadMoreError] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const navigate = useNavigate();
    const {loading} = useContext(AuthContext);
    const {setErrMessage} = useContext(UtilContext);
    const limit = 10;

    useEffect(() => {
       loadPage(1);
    }, [blogSlug]);

    async function loadPage(pg) {
        try {
            if (pg > 1) setLoadingMore(true);
            const result = await getBlogPosts(blogSlug, pg, limit);

            if (pg === 1) {
                setBlog(result.blog);
                setPosts(result.posts);
            } else {
                setPosts(prev => [...prev, ...result.posts]);
            }
            setPage(pg)
            setTotalPosts(result.totalPosts);
        } catch (code) {
            if (pg === 1) {
                if (code === "404") {
                    setErr(404);
                } else if (code === "500") {
                    setErr(500);
                }
            } else {
                setLoadMoreError(code);
            }
        } finally {
            if (pg > 1) setLoadingMore(false);
        }
    }
    if (!blog || loading) return <BlogSkeleton/>

    if (err) return (
        <Layout>
            <ErrorCodeMessage type={"Blog"} code={err}/>
        </Layout>
    );

    if (loadMoreError) {
        setErrMessage("Failed to load more posts")
    }

    return (
        <Layout>
            <div>
                <div className="mx-auto max-w-[75rem] block max-w-11/12">
                    <div className="overflow-hidden rounded-lg">
                    <div className="max-h-40 max-w-full m-2 overflow-hidden rounded-lg">
                            {blog.banner && <img src={blog.banner} className="h-40 w-full object-cover object-center bg-gray-600" alt="banner"/>}
                    </div>
                        <div className="rounded-md bg-gray-500 p-3 text-white">
                            <div className="flex items-center justify-between">
                                <div className="text-3xl mb-3">{blog.blogName}</div>
                                <DotMenu/>
                            </div>
                            <div className="mb-4 w-full flex items-center justify-between">
                                <ShowcaseUser src={blog.owner.icon} displayName={blog.owner.username} alt="icon"/>
                                <div className="flex items-center w-32 justify-between">
                                    <div className="text-xs opacity-70">{blog.followers} Followers</div>
                                    <FollowButton/>
                                </div>
                            </div>
                            <div className="whitespace-pre-wrap">
                                {blog.description}
                            </div>
                        </div>
                        <div>
                            <PageTitle prompt="Top Posts"/>
                            <div>
                                {posts.map(post => (
                                    <div onClick={ () => navigate(`/${blog.blogSlug}/${post.id}`)} key={post.id} className="block m-2 max-w-4xl">
                                        <DatePrompt prompt="Posted" date={post.createdAt}/>
                                        <div className="text-lg mb-2 font-bold">{post.title}</div>
                                        <div className="mb-3 flex items-center w-full justify-between">
                                            <ShowcaseUser src={post.author.icon} displayName={post.author.username} alt="icon"/>
                                            <PostLikeButton num={post.stars}/>
                                        </div>
                                        {post.images && post.images.length > 0 ? (
                                            <div className="flex justify-center">
                                                <img src={post.images[0]} alt="image1"/>
                                            </div>) : (<div>{post.body}</div>)
                                        }
                                        <hr className="m-3 ml-1"/>
                                    </div>
                                ))
                                }
                            </div>
                            {posts.length < totalPosts && (
                                <div className="flex justify-center">
                                <button
                                    disabled={loadingMore}
                                    onClick={() => loadPage(page + 1)}
                                    className="border rounded-lg p-1.5"
                                >
                                    {loadingMore && (
                                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    )}
                                    {loadMoreError ? "Retry" : "Load More"}
                                </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
