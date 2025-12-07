import {UtilContext} from "../context/UtilContext.jsx";
import {useContext} from "react";

const API_URL = "http://localhost:3000";

export async function loginUser(data) {
    const res = await fetch(`${API_URL}/auth/login/lgin`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
        credentials: "include",
    });
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Login failed")
    }

    return await res.json();
}


export function useLogoutUser() {
    const {setErrMessage} = useContext(UtilContext);

    const logoutUser = async() => {
        const res = await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });

        if (!res.ok) {
            const errData = await res.json();
            setErrMessage(errData.message);
        }
    }
    return logoutUser;
}

export async function register(data) {
    const res = await fetch(`${API_URL}/auth/register/sinup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    });
    console.log(res ? res : "Nothing received");
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Signup Failed");
    }
    return true;
}

export async function getCurrentUser() {
    const res = await fetch(`${API_URL}/account/me`, {credentials: "include",
    });

    if (!res.ok) return null;
    return await res.json();
}

export async function checkSession() {
    const res = await fetch(`${API_URL}/account/session`, {
        credentials: "include"
    });
    return await res.json();
}

export async function checkUsername(username) {
    const res = await fetch(`${API_URL}/account/check/${username}`);

    if (!res.ok) return false;
    return await res.json();
}

export async function getBlogs() {
    const res = await fetch(`${API_URL}/blogs`);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData || "Failed to fetch blogs")
    }
    const data =  await res.json();
    return data.blogs;
}

export async function getBlogPosts(blogSlug, page = 1, limit = 10) {
    const res = await fetch(`${API_URL}/${blogSlug}/posts?page=${page}&limit=${limit}`);
    if (!res.ok) {
        throw new Error(res.statusCode.toString());
    }
    return await res.json();
}

export async function getPost(blogSlug, postId){
    const res = await fetch(`${API_URL}/${blogSlug}/posts/${postId}`);
    if (!res.ok) {
        throw new Error(res.statusCode || "Fetch failed");
    }
    return await res.json()
}


// Add other API calls here (create blog, create post, etc.)