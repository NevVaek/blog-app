import Layout, {PageTitle} from "../components/Layout.jsx";
import {FullPageNoContent} from "../components/Messages.jsx";
import {useContext, useEffect, useState} from "react";
import {UtilContext} from "../context/UtilContext.jsx";
import {AuthContext} from "../context/AuthContext.jsx";
import {useNavigate} from "react-router-dom";
import {deleteBlog, getUserBlogs, getUserBlogQuota} from "../services/api.js";
import HomeSkeleton from "../components/skeletons/HomeSkeleton.jsx";
import {CreateBlogButton, BaseButton} from "../components/Buttons.jsx";
import DotMenu from "../components/DotMenu.jsx";
import {formatDate} from "../components/DatePrompt.jsx";
import DeleteConfirmation from "../components/DeleteConfirmation.jsx";

export default function UserContent() {
    const [blogs, setBlogs] = useState([]);
    const [contentLoading, setContentLoading] = useState(true);
    const {setErrMessage, setSuccessMessage} = useContext(UtilContext);
    const {loading} = useContext(AuthContext);
    const navigate = useNavigate();
    const [showDelete, setShowDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(true);
    const [deleteObj, setDeleteObj] = useState(null)
    const [deleting, setDeleting] = useState(false);
    const [errored, setErrored] = useState(false);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const result = await getUserBlogs();

            if (result.status === "ok") {
                setBlogs(result.payload);

                const checkResult = await getUserBlogQuota();
                const data = checkResult.payload;
                if ( data === "reject") {
                    setShowCreate(false);
                }
            } else if (result.status === "err") {
                setErrored(true);
                throw new Error(result.payload);
            }

        } catch {
            setErrored(true);
            setErrMessage("Something went wrong. Please try again later")
        } finally {
            setContentLoading(false);
        }
    }

    async function handleDelete(deleteObj) {
        try {
            setDeleting(true);
            const result = await deleteBlog(deleteObj);
            if (result.status === "err") {
                throw new Error(result.payload);
            }
            setBlogs(prev =>
                prev.filter(blog => blog.blogSlug !== deleteObj)
            );
            setShowCreate(true);
            setSuccessMessage("Blog successfully deleted");
        } catch (err) {
            setErrMessage(err);
        } finally {
            setDeleting(false);
            setDeleteObj(null);
            setShowDelete(false);
        }
    }

    if (loading || contentLoading) return <HomeSkeleton/>;

    return (
        <Layout>
           <div className="mx-auto max-w-[70rem]">
                <PageTitle prompt="Your Contents"></PageTitle>
                <div>
                    <div className="text-xl max-w-5xl mb-5 flex items-center justify-between">Blogs {showCreate && <CreateBlogButton/>}</div>
                    {Array.isArray(blogs) && blogs.length !== 0 ? blogs.map(blog => (
                        <div key={blog.id}
                             className="block md:flex max-w-5xl rounded-lg border border-gray-300 mb-6">
                                <div className="h-28 max-w-full md:h-full md:w-56 overflow-hidden rounded-lg border" onClick={() => navigate(`/blogs/${blog.blogSlug}`)}>
                                    <img
                                        src={blog.banner}
                                        className="h-full w-full md:h-48 md:w-48 object-cover" alt="banner"/>
                                </div>
                                <div className="rounded-md w-full bg-gray-500 p-3 text-white">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-around">
                                            <div className="text-xl font-bold break-words" onClick={() => navigate(`/blogs/${blog.blogSlug}`)}>{blog.blogName} </div>
                                            <div className="sm:hidden w-48 flex opacity-70 ml-3">Created <div className="text-xm ml-3">{formatDate(blog.createdAt) || 0}</div></div>
                                        </div>
                                        <DotMenu mode="ownerMenu" className="block md:hidden" link1={`/create/${blog.blogSlug}/posts/new`} link2={`/create/${blog.blogSlug}/edit`} link3={() => {setShowDelete(true); setDeleteObj(blog.blogSlug)} }/>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="px-3 min-w-24 text-lg border-r-1 flex flex-col items-center">Followers<div className="text-xl">{blog.followers}</div> </div>
                                            <div className="px-3 min-w-fit text-lg border-r-1 flex flex-col items-center">Total Stars<div className="text-xl">{blog.totalStars || 0}</div></div>
                                            <div className="px-3 min-w-fit text-lg border-r-1 flex flex-col items-center">Total Visits<div className="text-xl">{blog.totalVisits || 0}</div></div>
                                            <div className="hidden sm:flex px-3 text-lg border-r-1 flex-col items-center">Created<div className="text-xl">{formatDate(blog.createdAt) || 0}</div></div>
                                        </div>
                                        <div className="hidden md:flex w-24 h-36 flex-col justify-between">
                                            <BaseButton to={`/create/${blog.blogSlug}/posts/new`} onClick={(e) => e.stopPropagation()}>New Post</BaseButton>
                                            <BaseButton to={`/create/${blog.blogSlug}/edit`} onClick={(e) => e.stopPropagation()}>Edit</BaseButton>
                                            <BaseButton className="text-red-500 border-red-500" onClick={() => {setShowDelete(true); setDeleteObj(blog.blogSlug)}}>Delete</BaseButton>
                                        </div>
                                    </div>
                                </div>
                        </div>
                    )) : <div><FullPageNoContent mode={errored ? "err" : "blog"} owner={true}/></div>}
                </div>
               <DeleteConfirmation open={showDelete} title="Delete Blog?" message="This action cannot be reversed" loading={deleting} onConfirm={() => handleDelete(deleteObj)} onCancel={() => setShowDelete(false)}/>
            </div>
        </Layout>
    )
}