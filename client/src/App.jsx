import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import Post from "./pages/Post.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import UpdateBlog from "./pages/UpdateBlog.jsx";
import CreateBlog from "./pages/CreateBlog.jsx";
import NotFound from "./pages/NotFound.jsx";
import UserContent from "./pages/UserContent.jsx";
import CreatePost from "./pages/CreatePost.jsx";

import ErrorCleaner from "./services/MessageCleaner.jsx";
import RequireAuth, {RequireGuest} from "./services/RequiredAuth.jsx";

function App() {
    return (
        <BrowserRouter>
            <ErrorCleaner/>
            <Routes>
                <Route element={<RequireGuest/>}>
                    <Route path="/login" element={<Login/>}/>
                    <Route path="/register" element={<Signup/>}/>
                </Route>
                <Route element={<RequireAuth/>}>
                    <Route path="/create/new" element={<CreateBlog/>}/>
                    <Route path="/create/:blogSlug/posts/new" element={<CreatePost/>}/>
                    <Route path="/create/:blogSlug/edit" element={<UpdateBlog/>}/>
                    <Route path="/create" element={<UserContent/>}/>
                </Route>
                <Route path="/blogs/:blogSlug/posts/:postId" element={<Post/>}/>
                <Route path="/blogs/:blogSlug" element={<Blog/>}/>
                <Route path="/" element={<Home/>} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App
