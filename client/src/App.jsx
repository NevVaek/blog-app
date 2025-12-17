import {BrowserRouter, Routes, Route} from "react-router-dom";
import Home from "./pages/Home.jsx";
import Blog from "./pages/Blog.jsx";
import Post from "./pages/Post.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import UpdateBlog from "./pages/UpdateBlog.jsx";

import ErrorCleaner from "./services/MessageCleaner.jsx";

function App() {
    return (
        <BrowserRouter>
            <ErrorCleaner/>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Signup/>}/>
                <Route path="/:blogSlug" element={<Blog/>}/>
                <Route path="/:blogSlug/:postId" element={<Post/>}/>
                <Route path="/create/:blogSlug/edit" element={<UpdateBlog/>}/>
            </Routes>
        </BrowserRouter>
    );
}

export default App
