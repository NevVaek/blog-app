import {useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";
import {register, checkUsername} from "../services/api.js"

import TextInput from "../components/TextInput.jsx";
import {SubmitButton} from "../components/Buttons.jsx";
import {ErrorMessage} from "../components/ErrorMessage.jsx";

export default function Signup() {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [ok, setOk] = useState(true);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!username || !email || !password) {
            return setError("All fields are required.");
        }
        if (!ok) {
            return setError("Username already taken. Please choose another name before submitting")
        }

        try {
            const result = await register({
                username: username,
                email: email,
                password: password
            });
            if (result === true) {
                navigate("/");
            }

        } catch (err) {
            console.log(err);
            setError(err);
        }
    }

    const handleUsernameCheck = async () => {
        if (!username) return;

        try {
            const res = await checkUsername(username);
            if (res.result) {
                setError("Username already taken");
                setOk(false);
            } else {
                setOk(true);
            }
        } catch (err) {
            console.log(err);
            setError(err);
        }
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-gray-900">
            <div className="bg-gray-800 rounded-3xl w-6/12 max-w-lg min-w-min p-4">
                <h2 className="text-3xl text-gray-300 mb-10">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <TextInput label="Username" placeHolder="Username" onChange={e => setUsername(e.target.value)} onBlur={handleUsernameCheck}/>
                    <TextInput label="Password" type="password" placeHolder="Password"
                               onChange={e => setPassword(e.target.value)}/>
                    <TextInput label="Email" type="email" placeHolder="example@mail.com" onChange={e => setEmail(e.target.value)}/>
                    <SubmitButton prompt="Register"></SubmitButton>
                </form>
            </div>
            {error && (
              <ErrorMessage err={error}/>
            )}
        </div>
    );
}