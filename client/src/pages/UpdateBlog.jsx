import {useState, useEffect, useContext} from "react";
import Layout from "../components/Layout.jsx";
import TextInput, {TextBoxInput, UploadInput} from "../components/TextInput.jsx";
import {FullPageErrorMessage} from "../components/Messages.jsx";
import {BaseButton, SubmitButton} from "../components/Buttons.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import {useParams, useNavigate} from "react-router-dom";
import {UtilContext} from "../context/UtilContext.jsx";
import {AuthContext} from "../context/AuthContext.jsx";
import {getBlog, checkBlogName, updateBlog} from "../services/api.js";
import {validateFile, validateString} from "../services/validate.js";
import {ShowcaseUser} from "../components/Displays.jsx";

export default function UpdateBlog() {
    const {blogSlug} = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState(null);
    const [desc, setDesc] = useState(null);
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

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    async function load() {
        try {
            const result = await getBlog(blogSlug);

            if (result.status === "ok") {    //BE CARFUL HOW YOU HANDLE BANNER URL. REMEMBER: AFTER SUBMISSION, THE URL GETS MODIFIED. MAKE SURE IT DOESN@T GET MODIFIED TWICE
                const data = result.payload;
                setBlog(data.blog);
                setName(data.blog.blogName);
                setDesc(data.blog.description || "");
            } else if (result.status === "err") {
                const err = result.payload;
                if (err === "404") {
                    setErrMessage("Code: 404 Couldn't find blog.");
                } else {
                    setErrMessage("Something went wrong. Please try again later");
                }
            }
        } catch {
            setErrMessage("Something went wrong. Please try again later")
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        setErrMessage(null);

        if (!name) {
            return setErrMessage("Blog name is required");
        }

        try {
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
                if (validate !== true) {
                    return setErrMessage(validate);
                }
                formData.append("banner", banner);
            }

            const submitRes = await updateBlog(blogSlug, formData, setProgress);

            if (submitRes.status === "ok" && submitRes.payload === true) {       //When the user changes the blogName, blogSlug also gets changed. Must update redirect URL too.
                setSuccessMessage("Blog successfully updated");
                navigate(`/${blogSlug}`);
            } else if (submitRes.status === "ok") {
                navigate(`/${submitRes.payload}`)
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

    if (loading || !user || !blog) return (     // This "loading" scene must come first. For the scenes to get loaded in the right order.
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
                <div className="border p-3 rounded-lg">
                    <div className="mb-2 text-xl">Preview</div>
                    <div className="max-h-20 max-w-full m-2 overflow-hidden rounded-lg">
                        <img src={preview || blog.banner} alt="preview" className="h-40 w-full object-cover object-center bg-gray-600"/>
                    </div>
                    <div className="rounded-md bg-gray-500 p-3 text-white">
                            <div className="flex items-center justify-between">
                                <div className="text-xl mb-2">{name}</div>
                            </div>
                            <div className="mb-2 w-full flex items-center justify-between">
                                <ShowcaseUser mode="preview" src={blog.owner.icon} displayName={blog.owner.username} alt="icon"/>
                            </div>
                            <div className="whitespace-pre-wrap text-sm">
                                {desc}
                            </div>
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
                <form onSubmit={handleSubmit} className="p-3">
                    <TextInput label="Blog Name" value={name || ""} onChange={(e) => {
                            setName(e.target.value);
                            setOk(false);
                        }
                    }/>
                    <TextBoxInput rows="5" cols="40" label="Description" name="description" value={desc || ""} onChange={(e) => setDesc(e.target.value)}/>
                    <UploadInput accept="image/*" label="Banner" onChange={handleFileChange} maxFileSize={MAX_FILE_SIZE}/>
                    <div className="flex items-center">
                        <SubmitButton prompt="Update" disable={submitting}/>
                        {submitting && <ProgressRing progress={progress} />}
                    </div>
                </form>
            </div>
        </Layout>
    )
}