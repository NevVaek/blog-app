import {useContext, useState, useEffect} from "react";
import Layout from "../components/Layout.jsx";
import TextInput, {TextBoxInput, UploadInput} from "../components/TextInput.jsx";
import {SubmitButton} from "../components/Buttons.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import BlogPreview from "../components/BlogPreview.jsx";
import {useNavigate} from "react-router-dom";
import {UtilContext} from "../context/UtilContext.jsx";
import {AuthContext} from "../context/AuthContext.jsx";
import {checkBlogName, createBlog, getUserBlogQuota} from "../services/api.js";
import {validateFile, validateString} from "../services/validate.js";

export default function CreateBlog() {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [banner, setBanner] = useState(null);
    const [ok, setOk] = useState(true);
    const [preview, setPreview] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const {setErrMessage, setSuccessMessage} = useContext(UtilContext);
    const {user, loading} = useContext(AuthContext);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; //2MB

    useEffect(() => {
        load();
    }, []);

    async function load() {
        try {
            const result = await getUserBlogQuota();
            const data = result.payload;

            if (data === "reject") {
                setErrMessage("5 Blog limit already reached for this account.");
                navigate("/create");
            }
        } catch {
            setErrMessage("Something went wrong. Please try again later")
        }
    }

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview); //Must remove the preview Object after use.
        };
    }, [preview]);

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        setErrMessage(null);

        try {
            if (!name) {
                return setErrMessage("Blog name is required");
            }

            if (!ok) {
                if (!validateString(name)) {
                return setErrMessage("Blog name should only contain letters, numbers, spaces, underscores, and hyphens")
                }

                const res = await checkBlogName(name);
                if (res) {
                    setOk(false);
                    return setErrMessage("Blog name is already taken. Please choose another one");
                } else setOk(true);
            }

            const formData = new FormData();

            formData.append("blogName", name);
            formData.append("description", desc);

            if (banner) {
                const validate = validateFile(banner, MAX_FILE_SIZE);
                if (validate !== true) {
                    return setErrMessage(validate);
                }
                formData.append("banner", banner);
            }

            const submitRes = await createBlog(formData, setProgress); // FFIX THIISS

            if (submitRes.status === "ok") {       //URL needs to include the blogSlug of the new blog name.
                setSuccessMessage("Blog successfully created");
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

    if (!user) return (     // This "loading" scene must come first. For the scenes to get loaded in the right order.
        <Layout>
            <div><LoadingSpinner/></div>
        </Layout>
    )

    return (
        <Layout>
            <div className="mx-auto max-w-[78rem] lg:grid grid-cols-[30rem_minmax(0,4fr)] gap-2">
                <BlogPreview user={user} preview={preview} descText={desc} name={name || "Blog Name"}/>
                <form onSubmit={handleSubmit} className="p-3">
                    <TextInput label="Blog Name" value={name || ""} maxL={50} currentL={name.length} placeHolder={"Blog name"} onChange={(e) => {
                            setName(e.target.value);
                            setOk(false);
                        }
                    }/>
                    <TextBoxInput rows="5" cols="40" label="Description" name="description" maxL={1500} currentL={desc.length} placeHolder={"Welcome to my blog!"} onChange={(e) => setDesc(e.target.value)}/>
                    <UploadInput accept="image/*" label="Banner" onChange={handleFileChange} maxFileSize={MAX_FILE_SIZE}/>
                    <div className="flex items-center">
                        <SubmitButton prompt="Create" disable={submitting}/>
                        {submitting && <ProgressRing progress={progress} />}
                    </div>
                </form>
            </div>
        </Layout>
    )
}