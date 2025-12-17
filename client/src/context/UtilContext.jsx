import {createContext, useEffect, useState} from "react";

export const UtilContext = createContext();

export function UtilProvider({children}) {
    const [errMessage, setErrMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
    if (errMessage) {
        const timer = setTimeout(() => setErrMessage(null), 3000);
        return () => clearTimeout(timer);
        }
    if (successMessage) {
        const timer = setTimeout(() => setSuccessMessage(null), 3000);
        return () => clearTimeout(timer);
    }

    }, [errMessage, successMessage]);

    return (
        <UtilContext.Provider value={{errMessage, setErrMessage, successMessage, setSuccessMessage}}>
            {children}
        </UtilContext.Provider>
    );
}