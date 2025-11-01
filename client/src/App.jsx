import { useState, useEffect } from 'react'
import './App.css'

function App() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/posts")
            .then(res => res.json())
            .then(data => setPosts(data))
    }, []);

    return (
        <div>
            <h2>Fishcakes and 2L of Extra Virgin Oil</h2>
            {posts.map(p => (
                <article key={p.id}>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                </article>
            ))}
        </div>
    );
}

export default App
