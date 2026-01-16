import {useContext, useState, useEffect} from "react";
import Layout from "../components/Layout.jsx";
import TextInput, {TextBoxInput, UploadInput} from "../components/TextInput.jsx";
import {SubmitButton} from "../components/Buttons.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ProgressRing from "../components/ProgressRing.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {UtilContext} from "../context/UtilContext.jsx";
import {AuthContext} from "../context/AuthContext.jsx";
import {updatePost, getPost} from "../services/api.js";
import {validateFile} from "../services/validate.js";

export default function UpdatePost() {
    const {blogSlug, postId} = useParams();
    const navigate = useNavigate();
    const [blog, setBlog] = useState(null);
    const [post, setPost] = useState(null);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [images, setImages] = useState([]);
    const [changedImg, setChangedImg] = useState(false)
    const [ok, setOk] = useState(true);
    const [pageLoading, setPageLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState(0);
    const {setErrMessage, setSuccessMessage} = useContext(UtilContext);
    const {user, loading} = useContext(AuthContext);

    const MAX_FILE_SIZE = 2 * 1024 * 1024; //2MB

    useEffect(() => {
        load();
    }, [blogSlug, postId]);

    async function load() {
        try {
            const result = await getPost(blogSlug, postId);
            const normalizeText = (text) => text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

            if (result.status === "ok") {
                const data = result.payload;
                setBlog(data.blog);
                setPost(data.post);
                setTitle(data.post.title)
                setBody(normalizeText(data.post.body) || "");
                setImages(data.post.images);
            } else if (result.status === "err") {
                const err = result.payload;
                if (err === "404") {
                    setErrMessage("Code: 404 Couldn't find Post.");
                } else {
                    setErrMessage("Something went wrong. Please try again later");
                }
                navigate("/create");
            }
        } catch {
            setErrMessage("Something went wrong. Please try again later");
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
            if (!title) {
                return setErrMessage("Post name is required");
            }

            if (!ok && title !== post.title) {      //QUESTIONABLE CHECK LATER IF THIS IS REALLY NEEDED
                if (title.length > 200) {
                return setErrMessage("Post title must be under 200 characters")
                }
                setOk(true);
            }

            const formData = new FormData();
            let issues = false;

            if (title !== post.title) {
                formData.append("title", title);
            }
            if (body !== post.body) {
                formData.append("body", body);
            }

            if (changedImg) {
                images.forEach( (img) => {
                    if (typeof img !== "string") {      // Filters out img objects that are string (string url of original post images)
                        const validate = validateFile(img, MAX_FILE_SIZE);

                        if (!validate) {
                            const shortenedName = img.name.length > 15 ? img.name.slice(0, 15) + '...' : img.name;
                            issues = true;
                            setErrMessage(`Error for the image ${shortenedName}: ${`Post images must each be under ${MAX_FILE_SIZE / (1024 * 1024)}MB`}`);
                        }
                        formData.append("images", img);
                    }
                });
                const deleted = post.images.filter((img) => {   // Adds deleted images to "deleted" basket
                    return !images.includes(img)
                });
                deleted.forEach((item) => formData.append("deletedImages", item));
            }

            if (issues) return;
            const submitRes = await updatePost(blogSlug, postId, formData, setProgress);    // Remember: For images, only sends the new images that were uploaded

            if (submitRes.status === "ok") {       //URL needs to include the blogSlug of the new blog name.
                setSuccessMessage("Post successfully updated");
                navigate(`/blogs/${blogSlug}/posts/${postId}`);
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
        setChangedImg(true);
    }

    if ( (loading && !user) || pageLoading) return (     // This "loading" scene must come first. For the scenes to get loaded in the right order.
        <Layout>
            <div><LoadingSpinner/></div>
        </Layout>
    )

    return (
        <Layout>
            <div className="mx-auto max-w-[78rem] lg:grid grid-cols-[55rem_minmax(0,4fr)] gap-2">
                <form onSubmit={handleSubmit} className="p-3">
                    <TextInput label="Post Title" value={title || ""} maxL={200} currentL={title.length} placeHolder={"Title"} onChange={(e) => {
                            setTitle(e.target.value);
                            setOk(false);
                        }
                    }/>
                    <TextBoxInput rows="5" cols="40" label="Body" value={body} name="body" maxL={40000} currentL={body.length} placeHolder={"Type something here..."} onChange={(e) => setBody(e.target.value)}/>
                    <UploadInput mode="post" accept="image/*" label="Image" onChange={handleFileChange} initial={images} maxFileSize={MAX_FILE_SIZE}/>
                    <div className="flex items-center">
                        <SubmitButton prompt="Update" disable={submitting}/>
                        {submitting && <ProgressRing progress={progress} />}
                    </div>
                </form>
            </div>
        </Layout>
    )
}