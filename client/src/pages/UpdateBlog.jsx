import {useState, useEffect, useContext} from "react";
import Layout from "../components/Layout.jsx";
import TextInput, {TextBoxInput, UploadInput} from "../components/TextInput.jsx";
import {FullPageErrorMessage} from "../components/Messages.jsx";
import {BaseButton, SubmitButton} from "../components/Buttons.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import BlogPreview from "../components/BlogPreview.jsx";
import {useParams, useNavigate} from "react-router-dom";
import {UtilContext} from "../context/UtilContext.jsx";
import {AuthContext} from "../context/AuthContext.jsx";
import {getBlog, checkBlogName, updateBlog} from "../services/api.js";
import {validateFile, validateString} from "../services/validate.js";

export default function UpdateBlog() {
    const {blogSlug} = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [pageLoading, setPageLoading] = useState(true);
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [banner, setBanner] = useState(null);
    const [ok, setOk] = useState(true);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const {setErrMessage, setSuccessMessage} = useContext(UtilContext);
    const {user} = useContext(AuthContext);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; //2MB

    useEffect(() => {
        load();
    }, [blogSlug]);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview); //Must remove the preview Object after use.
        };
    }, [preview]);

    async function load() {
        try {
            const result = await getBlog(blogSlug);

            const normalizeText = (text) => text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

            if (result.status === "ok") {    //BE CARFUL HOW YOU HANDLE BANNER URL. REMEMBER: AFTER SUBMISSION, THE URL GETS MODIFIED. MAKE SURE IT DOESN@T GET MODIFIED TWICE
                const data = result.payload;
                setBlog(data.blog);
                setName(data.blog.blogName);
                setDesc(normalizeText(data.blog.description) || "");
            } else if (result.status === "err") {
                const err = result.payload;
                if (err === "404") {
                    setErrMessage("Code: 404 Couldn't find blog.");
                } else {
                    setErrMessage("Something went wrong. Please try again later");
                }
                navigate("/create");
            }
        } catch {
            setErrMessage("Something went wrong. Please try again later")
            navigate("/create");
        } finally {
            setPageLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        try {
             if (!name) {
                return setErrMessage("Blog name is required");
            }

            if (!ok && name !== blog.blogName) {
                if (!validateString(name)) {
                return setErrMessage("Blog name should only contain letters, numbers, spaces, underscores, and hyphens")
                }

                const res = await checkBlogName(name, blog.id);
                if (res) {
                    setOk(false);
                    return setErrMessage("Blog name is already taken. Please choose another one");
                } else setOk(true);
            }

            const formData = new FormData();

            if (name && name !== blog.blogName) {
                formData.append("blogName", name);
            }
            formData.append("description", desc);
            if (banner) {
                const validate = validateFile(banner, MAX_FILE_SIZE);
                if (!validate) {
                    return setErrMessage(`Banner image must be under ${MAX_FILE_SIZE / (1024 * 1024)}MB`);
                }
                formData.append("banner", banner);
            }

            const submitRes = await updateBlog(blogSlug, formData, setProgress);

            if (submitRes.status === "ok" && submitRes.payload === true) {       //When the user changes the blogName, blogSlug also gets changed. Must update redirect URL too.
                setSuccessMessage("Blog successfully updated");
                navigate(`/blogs/${blogSlug}`);
            } else if (submitRes.status === "ok") {
                navigate(`/blogs/${submitRes.payload}`);
            } else if (submitRes.status === "err") {
                throw submitRes.payload
            }

        } catch (err) {
            setErrMessage(err || "Something went wrong. Please try again")
        } finally {
            setSubmitting(false);
        }
    }

    function handleFileChange(file) {
        setBanner(file);
        setPreview(file ? URL.createObjectURL(file) : null);      // Maybe this is needed no more?
    }

    if (pageLoading || !user || !blog) return (     // This "loading" scene must come first. For the scenes to get loaded in the right order.
        <Layout>
            <div><LoadingSpinner/></div>
        </Layout>
    )

    if (user && blog && user.id !== blog.owner.id) {
        return (
            <Layout>
                <FullPageErrorMessage err="You do not have permission to edit this Blog"/>
                <BaseButton to="/">Return to Top</BaseButton>
            </Layout>
        )
    }

    return (
        <Layout>
            <div className="mx-auto max-w-[78rem] lg:grid grid-cols-[30rem_minmax(0,4fr)] gap-2">
                <BlogPreview blog={blog} preview={preview} descText={desc} name={name}/>
                <form onSubmit={handleSubmit} className="p-3">
                    <TextInput label="Blog Name" value={name || ""} maxL={50} currentL={name.length} onChange={(e) => {
                            setName(e.target.value);
                            setOk(false);
                        }
                    }/>
                    <TextBoxInput rows="5" cols="40" label="Description" name="description" value={desc || ""} maxL={1500} currentL={desc.length} onChange={(e) => setDesc(e.target.value)}/>
                    <UploadInput mode="blog" accept="image/*" label="Banner" onChange={handleFileChange} maxFileSize={MAX_FILE_SIZE}/>
                    <div className="flex items-center">
                        <SubmitButton prompt="Update" disable={submitting}/>
                        {submitting && <ProgressRing progress={progress} />}
                    </div>
                </form>
            </div>
        </Layout>
    )
}