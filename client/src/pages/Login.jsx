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
    const [submitting, setSubmitting] = useState(false);


    async function handleSubmit(e) {
            e.preventDefault();
            if (submitting) return;
        try{
            setSubmitting(true);
            setError("");

            const result = await login({
                username: username,
                password: password
            });

            if (result === true) {
                navigate("/");
            } else {
                setError(result);
            }
        } catch (err) {
            setError(err);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="bg-gray-800 min-h-screen w-screen flex items-center flex-col sm:bg-gray-900">
            <div className="bg-gray-800 mt-20 w-3/5 min-w-min p-4 sm:max-w-lg sm:border sm:mt-48 sm:rounded-3xl">
                <h2 className="text-3xl text-gray-300 mb-10">Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <TextInput label="Username" placeHolder="Username" onChange={e => setUsername(e.target.value)}/>
                    <TextInput label="Password" type="password" placeHolder="Password"
                               onChange={e => setPassword(e.target.value)}/>
                    <SubmitButton prompt="Login" disable={submitting}/>
                </form>
            </div>
            {error && (
              <ErrorMessage err={error} />
            )}
        </div>
    )
}

