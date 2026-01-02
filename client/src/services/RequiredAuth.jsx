import {Navigate, Outlet, useLocation} from "react-router-dom";
import {useContext, useEffect} from "react";
import {AuthContext} from "../context/AuthContext.jsx";
import {UtilContext} from "../context/UtilContext.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";


export default function RequireAuth() {
    const {user, loading, initial} = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner/>
    }

    if (!loading && !user) {
        if (initial) {
            return (
                <Navigate to="/"/>
            )
        }

        return (
            <Navigate to="/login" replace state={{from: location}}/>
        );
    }
    return <Outlet/>;
}

export function RequireGuest() {
    const {user, initial, loading} = useContext(AuthContext);
    const {setErrMessage} = useContext(UtilContext);
    const location = useLocation();

    useEffect(() => {
        if (!loading && user && !initial) {
            setErrMessage("You are already logged in");
        }
    }, [loading, user]);

    if (loading) return <LoadingSpinner/>

    if (user) {
        const redirectTo = location.state?.from?.pathname || "/";
        return <Navigate to={redirectTo} replace />;
    }
    return <Outlet/>
}