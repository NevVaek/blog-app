import axios from "axios";

const API_URL = "http://localhost:3000";

export async function loginUser(data) {
    const res = await fetch(`${API_URL}/auth/login/lgin`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
        credentials: "include",
    });
    const resData = await res.json();
    if (!res.ok) {
        return {status: "err", payload: resData.message};
    }
    return {status: "ok", payload: resData};
}


export function useLogoutUser() {

    const logoutUser = async() => {
        const res = await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        const resData = await res.json()
        if (!res.ok) {
            return {status: "err", payload: resData.message}
        }
        return {status: "ok", payload: resData.message}
    }
    return logoutUser;
}

export async function register(data) {
    const res = await fetch(`${API_URL}/auth/register/sinup`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {"Content-Type": "application/json"}
    });
    if (!res.ok) {
        const err = await res.json();
        return {status: "err", payload: err.message};
    }
    return {status: "ok", payload: true};
}

export async function getCurrentUser() {
    const res = await fetch(`${API_URL}/account/me`, {credentials: "include"});

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
    const res = await fetch(`${API_URL}/account/check/${username}`); //THIS LOOKS WRONG. SEND THE USERNAME IN A PROPER JSON PACKAGE

    if (!res.ok) return false;
    const checkResult = await res.json();
    return checkResult.result;
}

export async function checkBlogName(blogName, id=null){
    const res = await fetch(`${API_URL}/check`, {
        method: "POST",
        body: JSON.stringify({blogName: blogName, blogId: id ? id : null}),
        headers: {"Content-Type": "application/json"}
    });
    if (!res.ok) return false
    const checkResult = await res.json();
    return checkResult.result;
}

export async function getBlogs() {
    const res = await fetch(`${API_URL}/blogs`);
    const data = await res.json();
    if (!res.ok) {
        return {status: "err", payload: data.message}
    }
    return {status: "ok", payload: data.blogs}
}

export async function getUserBlogs() {
    const res = await fetch(`${API_URL}/blogs/user`, {credentials: "include"});
    const data = await res.json();

    if (!res.ok) {
        return {status: "err", payload: data.message}
    }
    return {status: "ok", payload: data.blogs}
}

export async function getUserBlogQuota() {
    const res = await fetch(`${API_URL}/blogs/user/blog-quota`, {credentials: "include"});
    const data = await res.json();

    if (!res.ok) {
        return {status: "err", payload: data.message}
    }
    return {status: "ok", payload: data.status}
}

export async function getBlog(blogSlug) {
    const res = await fetch(`${API_URL}/${blogSlug}`);
    if (!res.ok) {
        return {status: "err", payload: res.status.toString()};
    }
    const resData = await res.json();
    return {status: "ok", payload: resData};
}

export async function getBlogPosts(blogSlug, page = 1, limit = 10) {
    const res = await fetch(`${API_URL}/${blogSlug}/posts?page=${page}&limit=${limit}`);
    if (!res.ok) {
        return {status: "err", payload: res.status.toString()};
    }
    const resData = await res.json();
    return {status: "ok", payload: resData};
}

export async function getPost(blogSlug, postId){
    const res = await fetch(`${API_URL}/${blogSlug}/posts/${postId}`);
    if (!res.ok) {
        return {status: "err", payload: res.status.toString()};
    }
    const resData = await res.json();
    return {status: "ok", payload: resData}
}


export async function createBlog(formData, setState) {
    try {
        const res = await axios.post(`${API_URL}/create/new`, formData, {
            withCredentials: true,
            onUploadProgress: (e) => {
                const percent = Math.round((e.loaded * 100) / e.total);
                setState(percent);
            }
        });

        return {status: "ok", payload: res.data.newBlogSlug}
    } catch(err) {
        return {status: "err", payload: err.response.data.message}
    }
}

export async function updateBlog(blogSlug, formData, setState) {
    //const res = await fetch(`${API_URL}/create/update/${blogSlug}`, {
    //    method: "PATCH",
    //    body: formData,
    //    credentials: "include"
    //});

    //if (!res.ok) {
    //    const err = await res.json();
    //    return {status: "err", payload: err.message};
    //}

    //const resData = await res.json();
    //return {status: "ok", payload: resData.newBlogSlug}

    try {
        const res = await axios.patch(`${API_URL}/create/update/${blogSlug}`, formData, {
            withCredentials: true,
            onUploadProgress: (e) => {
                const percent = Math.round((e.loaded * 100) / e.total);
                setState(percent);
            }
        });

        return {status: "ok", payload: res.data.newBlogSlug}
    } catch(err) {
        return {status: "err", payload: err.response.data.message};
    }
}

export async function deleteBlog(blogSlug) {
    const res = await fetch(`${API_URL}/create/delete/${blogSlug}`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!res.ok) {
        const data = await res.json();
        return {status: "err", payload: data.message}
    }
    return {status: "ok"}
}

export async function deletePost(blogSlug, postId) {
    const res = await fetch(`${API_URL}/${blogSlug}/posts/${postId}/delete`, {
        method: "DELETE",
        credentials: "include"
    });
    if (!res.ok) {
        const data = await res.json();
        return {status: "err", payload: data.message}
    }
    return {status: "ok"}
}


// Add other API calls here (create blog, create post, etc.)