import {useState, useEffect} from "react";

export function useTimeoutMessage(defaultDuration = 3000) {
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!message) return;

        const timeoutId = setTimeout(() => {
            setMessage("");
        }, defaultDuration);

        return () => clearTimeout(timeoutId);

    }, [message, defaultDuration]);

    return {
        message,
        showMessage: setMessage,
        clearMessage: () => setMessage("")
    }
}