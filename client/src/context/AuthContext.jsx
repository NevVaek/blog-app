
import {createContext, useState, useEffect} from "react";
import { loginUser, useLogoutUser, checkSession} from "../services/api";

export const AuthContext = createContext();

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
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
            const userData = await loginUser(credentials);

            if (userData.status === "ok") {
                setUser(userData.payload.user);
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
        await logoutUser();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{user, setUser, loading, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
}