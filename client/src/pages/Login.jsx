import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";

import TextInput from "../components/TextInput.jsx"
import {ErrorMessage} from "../components/ErrorMessage.jsx";
import {SubmitButton} from "../components/Buttons.jsx";


export default function Login() {
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const result = await login({
            username: username,
            password: password});

        if (result === true) {
            navigate("/");
        } else {
            setError(result.message);
        }
    }

    return (
        <div className="h-screen w-screen flex justify-center items-center bg-gray-900">
            <div className="bg-gray-800 rounded-3xl w-6/12 max-w-lg min-w-min p-4">
                <h2 className="text-3xl text-gray-300 mb-10">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <TextInput label="Username" placeHolder="Username" onChange={e => setUsername(e.target.value)}/>
                    <TextInput label="Password" type="password" placeHolder="Password"
                               onChange={e => setPassword(e.target.value)}/>
                    <SubmitButton prompt="Login"/>
                </form>
            </div>
            {error && (
              <ErrorMessage err={error} />
            )}
        </div>
    )
}

