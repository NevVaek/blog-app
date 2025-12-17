import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { UtilContext } from "../context/UtilContext.jsx";

export default function ErrorCleaner() {
    const { setErrMessage} = useContext(UtilContext);
    const location = useLocation();

    useEffect(() => {
        setErrMessage(null);      // Clear error whenever URL changes
    }, [location.pathname]);

    return null;
}
