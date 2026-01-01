import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UtilContext } from "../context/UtilContext.jsx";
import {AuthContext} from "../context/AuthContext.jsx";

export default function ErrorCleaner() {
    const {setErrMessage} = useContext(UtilContext);
    const {setInitial} = useContext(AuthContext);
    const location = useLocation();

    useEffect(() => {
        setInitial(false);     // Clear error whenever URL changes
    }, [location.pathname]);

    return null;
}
