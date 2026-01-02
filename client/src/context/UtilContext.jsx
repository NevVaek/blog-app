import {createContext, useEffect, useState} from "react";

export const UtilContext = createContext();

export function UtilProvider({children}) {
    const [messages, setMessages] = useState([]);


    function setSuccessMessage(msg) {
        const id = crypto.randomUUID();
        const data = {
            id: id,
            type: "success",
            text: msg
        }

        setMessages(prev => [...prev, data]);

        setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== id));}, 3000);
    }

    function setErrMessage(msg) {
        const id = crypto.randomUUID();
        const data = {
            id: id,
            type: "error",
            text: msg
        }

        setMessages(prev => [...prev, data]);
        setTimeout(() => {
            setMessages(prev => prev.filter(m => m.id !== id));}, 3000);
    }

    return (
        <UtilContext.Provider value={{setErrMessage, setSuccessMessage, messages}}>
            {children}
        </UtilContext.Provider>
    );
}