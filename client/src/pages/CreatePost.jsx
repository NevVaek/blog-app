import {useContext, useState, useEffect} from "react";
import Layout from "../components/Layout.jsx";
import TextInput, {TextBoxInput, UploadInput} from "../components/TextInput.jsx";
import {SubmitButton} from "../components/Buttons.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {UtilContext} from "../context/UtilContext.jsx";
import {AuthContext} from "../context/AuthContext.jsx";
import {createPost, getBlog} from "../services/api.js";
import {validateFile, validateString} from "../services/validate.js";

export default function CreatePost() {
    const {blogSlug} = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [images, setImages] = useState([]);
    const [ok, setOk] = useState(true);
    const [previews, setPreviews] = useState([]);
    const [pageLoading, setPageLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const {setErrMessage, setSuccessMessage} = useContext(UtilContext);
    const {user, loading} = useContext(AuthContext);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; //2MB

    useEffect(() => {
        load();
    }, [blogSlug]);

    async function load() {
        try {
            const result = await getBlog(blogSlug);

            if (result.status === "ok") {
                const data = result.payload;
                setBlog(data.blog);
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
            setPageLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);

        try {
            if (!title) {
                return setErrMessage("Blog name is required");
            }

            if (!ok) {      //QUESTIONABLE CHECK LATER IF THIS IS REALLY NEEDED
                if (!validateString(title)) {
                return setErrMessage("Blog name should only contain letters, numbers, spaces, underscores, and hyphens")
                }
                setOk(true);
            }

            const formData = new FormData();
            let issues = false;

            formData.append("title", title);
            formData.append("body", body);

            if (images.length !== 0) {
                images.forEach( (img) => {
                    const validate = validateFile(img, MAX_FILE_SIZE);

                    if (validate !== true) {
                        const shortenedName = img.name.length > 15 ? img.name.slice(0, 15) + '...' : img.name;
                        issues = true;
                        setErrMessage(`Error for the image ${shortenedName}: ${validate}`);
                    }
                    formData.append("images", img);
                });
            }

            if (issues) return;

            const submitRes = await createPost(blogSlug, formData, setProgress);

            if (submitRes.status === "ok") {       //URL needs to include the blogSlug of the new blog name.
                setSuccessMessage("Post successfully created");
                navigate(`/blogs/${blogSlug}/posts/${submitRes.payload}`);
            } else if (submitRes.status === "err") {
                throw submitRes.payload;
            }

        } catch (err) {
            setErrMessage(err || "Something went wrong. Please try again")
        } finally {
            setSubmitting(false);
        }
    }

    function handleFileChange(files) {
        setImages(files);
    }

    if (loading && !user) return (     // This "loading" scene must come first. For the scenes to get loaded in the right order.
        <Layout>
            <div><LoadingSpinner/></div>
        </Layout>
    )

    return (
        <Layout>
            <div className="mx-auto max-w-[78rem] lg:grid grid-cols-[55rem_minmax(0,4fr)] gap-2">
                <form onSubmit={handleSubmit} className="p-3">
                    <TextInput label="Blog Name" value={title || ""} maxL={200} currentL={title.length} placeHolder={"Title"} onChange={(e) => {
                            setTitle(e.target.value);
                            setOk(false);
                        }
                    }/>
                    <TextBoxInput rows="5" cols="40" label="Body" name="body" maxL={40000} currentL={body.length} placeHolder={"Type something here..."} onChange={(e) => setBody(e.target.value)}/>
                    <UploadInput mode="post" accept="image/*" label="Image" onChange={handleFileChange} maxFileSize={MAX_FILE_SIZE}/>
                    <div className="flex items-center">
                        <SubmitButton prompt="Create" disable={submitting}/>
                        {submitting && <ProgressRing progress={progress} />}
                    </div>
                </form>
            </div>
        </Layout>
    )


}