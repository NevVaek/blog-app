import {useContext, useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";
import { UtilContext } from "../context/UtilContext.jsx";
import {register, checkUsername} from "../services/api.js"

import TextInput from "../components/TextInput.jsx";
import {SubmitButton} from "../components/Buttons.jsx";
import {ErrorMessage} from "../components/Messages.jsx";

export default function Signup() {
    const {user} = useContext(AuthContext);
    const {setSuccessMessage} = useContext(UtilContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [ok, setOk] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;

        setSubmitting(true);
        setError("");
        try {
            if (!username || !email || !password) {
                return setError("All fields are required.");
            }
            if (!ok) {
                const res = await checkUsername(username);
                if (res) {
                    setOk(false);
                    return setError("Username already taken. Please choose another name before submitting");
                } else {
                    setOk(true);
                }
            }

            const result = await register({
                username: username,
                email: email,
                password: password
            });

            if (result.status === "ok") {
                if (result.payload === true) {
                    setSuccessMessage("Sign up successful. Please log in to start using your account")
                    navigate("/");
                }
            } else if (result.status === "err") {
                throw new Error(result.payload);
            }

        } catch (err) {
            setError(err);
        } finally {
            setSubmitting(false);   //Don't forget to set "submitting" false afterwards.
        }
    }

    return (
        <div className="min-h-screen w-screen flex items-center flex-col bg-gray-800 sm:bg-gray-900">
            <div className="bg-gray-800 mt-20 p-4 max-w-lg sm:w-6/12 sm:rounded-3xl sm:border sm:min-w-min sm:h-auto sm:p-4 sm:mt-48">
                <h2 className="text-3xl text-gray-300 mb-10">Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <TextInput label="Username" placeHolder="Username" onChange={(e) => {
                        setUsername(e.target.value);
                        setOk(false);
                        }
                    }/>
                    <TextInput label="Password" type="password" placeHolder="Password"
                               onChange={e => setPassword(e.target.value)}/>
                    <TextInput label="Email" type="email" placeHolder="example@mail.com" onChange={e => setEmail(e.target.value)}/>
                    <SubmitButton prompt="Register" disable={submitting}/>
                </form>
            </div>
            {error && (
              <ErrorMessage err={error}/>
            )}
        </div>
    );
}