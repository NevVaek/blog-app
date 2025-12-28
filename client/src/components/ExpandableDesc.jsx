import {useState, useRef, useEffect} from "react";

export default function ExpandableDesc({text, lines=3, txtSize}) {
    const [expanded, setExpanded] = useState(false);
    const [isClamped, setIsClamped] = useState(false);
    const textRef = useRef(null);

    useEffect(() => {
        if (!textRef.current) return;

        const el = textRef.current;
        setIsClamped(el.scrollHeight > el.clientHeight);
    }, [text]);

    return (
        <div>
            <div ref={textRef} className={`break-words whitespace-pre-wrap ${txtSize} ${expanded ? "line-clamp-none" : `line-clamp-${lines}`}`}>
                {text}
            </div>

            {isClamped && (
                <button onClick={() => setExpanded(!expanded)} className="mt-1 text-sm text-blue-400 hover:underline">
                    {expanded ? "See less" : "See more"}
                </button>
            )}
        </div>
    );
}