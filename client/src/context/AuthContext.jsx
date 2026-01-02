
import {createContext, useState, useEffect, useContext} from "react";
import { loginUser, useLogoutUser, checkSession} from "../services/api";
import { UtilContext } from "./UtilContext.jsx";

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const {setSuccessMessage, setErrMessage} = useContext(UtilContext);
    const [user, setUser] = useState(null);
    const [initial, setInitial] = useState(false);
    const [loading, setLoading] = useState(true);
    const logoutUser = useLogoutUser();

    useEffect(() => {
        try {
         checkSession().then(data => {
             if (data.loggedIn) {
                 setUser(data.user);
             } else {
                 setUser(null);
             }
         });
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            setInitial(true);
            const userData = await loginUser(credentials);

            if (userData.status === "ok") {
                setUser(userData.payload.user);
                setSuccessMessage("Logged in successfully");
                return true;
            } else if (userData.status === "err") {
                setUser(null);
                return userData.payload;
            }

        } catch (err) {
            return err;
        }
    }

    const logout = async () => {
        const res = await logoutUser();
        if (res.status === "err") {
            setErrMessage(res.payload);
            return;
        }
        setUser(null);
        setInitial(true);
        setSuccessMessage("Logged out successfully");
    }

    return (
        <AuthContext.Provider value={{user, setUser, loading, initial, setInitial, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}