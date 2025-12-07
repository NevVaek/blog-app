import {createContext, useEffect, useState} from "react";

export const UtilContext = createContext();

export function UtilProvider({children}) {
    const [errMessage, setErrMessage] = useState("");

    useEffect(() => {
    if (errMessage) {
        const timer = setTimeout(() => setErrMessage(null), 3000);
        return () => clearTimeout(timer);
        }
    }, [errMessage]);

    return (
        <UtilContext.Provider value={{errMessage, setErrMessage}}>
            {children}
        </UtilContext.Provider>
    );
}