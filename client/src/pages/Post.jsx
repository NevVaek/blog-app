import Layout, {PageTitle} from "../components/Layout.jsx";
import {useState, useEffect, useContext} from "react";
import {deletePost, getPost} from "../services/api.js";
import {ShowcaseUser} from "../components/Displays.jsx";
import ImageCarousel from "../components/ImageCarousel.jsx";
import {ErrorCodeMessage, FullPageNoContent} from "../components/Messages.jsx"
import PostSkeleton from "../components/skeletons/PostSkeleton.jsx";
import {PostLikeButton, FollowButton} from "../components/Buttons.jsx";
import DotMenu from "../components/DotMenu.jsx";
import DeleteConfirmation from "../components/DeleteConfirmation.jsx";
import {useParams, useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";
import {UtilContext} from "../context/UtilContext.jsx";

export default function Post() {
    const {blogSlug, postId} = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [post, setPost] = useState(null);
    const [err, setErr] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [owner, setOwner] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const {user, loading} = useContext(AuthContext);
    const {setErrMessage, setSuccessMessage} = useContext(UtilContext);

    useEffect(() => {
        load();
    },[blogSlug, postId]);

    useEffect(() => {
        if (user && blog && (user.id === blog.owner.id || user.id === blog.author.id)) {
            setOwner(true);
        }
    }, [user, blog, post]);

    async function load() {
        try {
            const result = await getPost(blogSlug, postId);

            if (result.status === "ok") {
                setBlog(result.payload.blog);
                setPost(result.payload.post);
            } else if (result.status === "err") {
                const code = result.payload;

                if (code === "404") {
                    setErr(404);
                } else {
                    setErr(500);
                }
            }
        } catch (err) {
            setErrMessage(err);
        } finally {
            setPageLoading(false);
        }
    }

    async function handleDelete() {
        try {
            setDeleting(true);
            const result = await deletePost(blogSlug, postId);
            if (result.status === "err") {
                throw new Error(result.payload);
            }
            setSuccessMessage("Post successfully deleted");
            navigate(`/blogs/${blogSlug}`);
        } catch (err) {
            setErrMessage(err);
        } finally {
            setDeleting(false);
            setShowDelete(false);
        }
    }

    if (pageLoading && (!blog || !post || loading)) return <PostSkeleton/>;

    if (err) return (
        <Layout>
            <ErrorCodeMessage type={"Post"} code={err} url={blog ? `/blogs/${blogSlug}` : "/"}/>
        </Layout>
    )

    return (
        <Layout>
            <div className="mx-auto max-w-[78rem] md:grid grid-cols-[minmax(0,4fr)_20rem] gap-2">
                <div className="flex items-center justify-between bg-black h-14 rounded-lg mb-4 p-2 md:hidden">
                    <div className="flex items-center">
                        <div className="mr-3 font-bold break-all">{blog.blogName}</div>
                        <div className="text-xs">{blog.followers} Followers</div>
                    </div>
                    <FollowButton/>
                </div>
                <div className="px-2 block max-w-4xl min-w-max border">
                    <div className="overflow-hidden rounded-lg">
                        <div className="min-h-44">
                            <div className="flex items-center justify-between">
                                <div className="text-2xl mb-2">{post.title}</div>
                                <DotMenu mode={owner ? "owner" : "user"} link2={`/create/${blogSlug}/edit`} link3={() => setShowDelete(true)}/>
                            </div>
                            <div className="flex items-center justify-between mb-3">
                                <ShowcaseUser src={post.author.icon} displayName={post.author.username} alt="icon"/>
                                <PostLikeButton num={post.stars}/>
                            </div>
                            {post.images?.length > 0 && (
                                <ImageCarousel images={post.images}/>
                            )}
                            {post.body && (
                                <div className="break-words">{post.body}</div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="border w-80 pb-3 rounded-lg bg-black hidden md:block">
                    <div>
                        <div className="h-20 w-70 m-2 overflow-hidden rounded-lg">
                            <img src={blog.banner ? blog.banner : "/src/assets/sample.jpg"} className="h-full w-full object-cover bg-gray-600" alt="banner"/>
                        </div>
                        <div className="px-3">
                            <div className="flex items-center justify-between mt-5">
                                <div className="font-bold break-all">{blog.blogName}</div>
                                <FollowButton/>
                            </div>
                            <div className="mb-4">{blog.followers} Followers</div>
                            <div className="mb-4 break-words">{blog.description}</div>
                            <ShowcaseUser src={post.author.icon} displayName={post.author.username} alt="icon"/>
                        </div>
                    </div>
                </div>
                <DeleteConfirmation open={showDelete} title="Delete Post?" message="This action cannot be reversed" loading={deleting} onConfirm={handleDelete} onCancel={() => setShowDelete(false)}/>
            </div>
        </Layout>
    )
}