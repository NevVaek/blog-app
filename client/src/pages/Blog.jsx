import Layout, {PageTitle} from "../components/Layout.jsx";
import {getBlogPosts, deleteBlog} from "../services/api.js";
import {useState, useEffect, useContext} from "react";
import {useParams, useNavigate} from "react-router-dom";
import {ShowcaseUser} from "../components/Displays.jsx";
import {ErrorCodeMessage, FullPageNoContent} from "../components/Messages.jsx"
import BlogSkeleton from "../components/skeletons/BlogSkeleton.jsx";
import DatePrompt from "../components/DatePrompt.jsx";
import DeleteConfirmation from "../components/DeleteConfirmation.jsx";
import {PostLikeButton} from "../components/Buttons.jsx";
import {AuthContext} from "../context/AuthContext.jsx";
import {UtilContext} from "../context/UtilContext.jsx";
import {FollowButton} from "../components/Buttons.jsx";
import DotMenu from "../components/DotMenu.jsx";
import ExpandableDesc from "../components/ExpandableDesc.jsx";
import ImageCarousel from "../components/ImageCarousel.jsx";

export default function Blog() {
    const {blogSlug} = useParams();
    const [page, setPage] = useState(1);
    const [blog, setBlog] = useState(null);
    const [posts, setPosts] = useState([]);
    const [totalPosts, setTotalPosts] = useState(0);
    const [err, setErr] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [loadMoreError, setLoadMoreError] = useState(null);
    const [loadingMore, setLoadingMore] = useState(false);
    const [owner, setOwner] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const navigate = useNavigate();
    const {loading, user} = useContext(AuthContext);
    const {setErrMessage, setSuccessMessage} = useContext(UtilContext);
    const limit = 10;

    useEffect(() => {
       loadPage(1);
    }, [blogSlug]);

    useEffect(() => {
        if (user && blog && user.id === blog.owner.id ) {
            setOwner(true);
        }
    }, [user, blog])

    async function loadPage(pg) {
        try {
            if (pg > 1) setLoadingMore(true);
            const result = await getBlogPosts(blogSlug, pg, limit);
            if (result.status === "ok") {
                const data = result.payload
                if (pg === 1) {
                    setBlog(data.blog);
                    setPosts(data.posts);
                } else {
                    setPosts(prev => [...prev, ...data.posts]);
                }
                setPage(pg)
                setTotalPosts(data.totalPosts);
            } else if (result.status === "err") {
                const code = result.payload
                if (pg === 1) {
                    if (code === "404") {
                        setErr(404);
                    } else {
                        setErr(500);
                    }
                } else {
                    setLoadMoreError(code);
                }
            }
        } catch (err) {
            setErrMessage(err);
        } finally {
            if (pg === 1) setPageLoading(false);
            if (pg > 1) setLoadingMore(false);

        }
    }

    async function handleDelete() {
        try {
            setDeleting(true);
            const result = await deleteBlog(blogSlug);
            if (result.status === "err") {
                throw new Error(result.payload);
            }
            setSuccessMessage("Blog successfully deleted");
            navigate("/");
        } catch (err) {
            setErrMessage(err);
        } finally {
            setDeleting(false);
            setShowDelete(false);
        }
    }

    if ( pageLoading && (!blog || loading)) return <BlogSkeleton/>

    if (err) return (
        <Layout>
            <ErrorCodeMessage type={"Blog"} code={err} url={"/"}/>
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
                                <div className="text-3xl mb-3 break-all">{blog.blogName}</div>
                                <DotMenu mode={owner ? "owner" : "blog"} link2={`/create/${blogSlug}/edit`} link3={() => setShowDelete(true)}/>
                            </div>
                            <div className="mb-4 w-full flex items-center justify-between">
                                <ShowcaseUser src={blog.owner.icon} displayName={blog.owner.username} alt="icon"/>
                                <div className="flex items-center w-32 justify-between">
                                    <div className="text-xs opacity-70">{blog.followers} Followers</div>
                                    <FollowButton/>
                                </div>
                            </div>
                            <ExpandableDesc text={blog.description} lines={3}/>
                        </div>
                        <div>
                            <PageTitle prompt="Top Posts" blogSlug={blogSlug} displayB={owner}/>
                            <div>
                                {Array.isArray(posts) && posts.length !== 0 ? posts.map(post => (
                                    <div onClick={ () => navigate(`/blogs/${blog.blogSlug}/posts/${post.id}`)} key={post.id} className="block m-2 max-w-4xl">
                                        <DatePrompt prompt="Posted" date={post.createdAt}/>
                                        <div className="text-lg mb-2 font-bold break-words">{post.title}</div>
                                        <div className="mb-3 flex items-center w-full justify-between">
                                            <ShowcaseUser src={post.author.icon} displayName={post.author.username} alt="icon"/>
                                            <PostLikeButton num={post.stars}/>
                                        </div>
                                        {post.images && post.images.length > 0 ? (
                                            <ImageCarousel images={post.images}/>
                                            ) : (<div className="break-words">{post.body}</div>)
                                        }
                                        <hr className="m-3 ml-1"/>
                                    </div>
                                )) : <FullPageNoContent mode="post" owner={owner}/>
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
                        <DeleteConfirmation open={showDelete} title="Delete Blog?" message="This action cannot be reversed" loading={deleting} onConfirm={handleDelete} onCancel={() => setShowDelete(false)}/>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
