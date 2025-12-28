import {useState, useEffect, useRef, useContext} from "react";
import {validateFile} from "../services/validate.js";
import {UtilContext} from "../context/UtilContext.jsx";

export default function TextInput({label, name, type= "text", value, onChange, placeHolder, onBlur, maxL, currentL}) {
    return (
            <div className="mb-5 grid grid-cols-[100px_1fr] sm:grid-cols-[150px_1fr] sm:gap-3">
            <label htmlFor={label} className="text-lg text-gray-300">{label}</label>
            <input type={type}
                   id={label}
                   value={value}
                   name={name}
                   onChange={onChange}
                   placeholder={placeHolder}
                   onBlur={onBlur}
                   maxLength={maxL}
                   className="w-56 sm:w-64 rounded-md border border-fuchsia-50 pl-2 text-lg text-gray-300 outline-none bg-transparent"/>
                {maxL ? <WordCounter maxLength={maxL} length={currentL}/> : <></>}
            </div>
    );
}

export function TextBoxInput({label, name, cols, rows, value, onChange, placeHolder, onBlur, maxL, currentL}) {
    return (
        <div className="mb-5">
            <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[150px_1fr] sm:gap-3">
            <label htmlFor={label}>{label}</label>
            <textarea name={name}
                      id={label}
                      cols={cols}
                      rows={rows}
                      wrap="hard"
                      value={value}
                      onChange={onChange}
                      placeholder={placeHolder}
                      onBlur={onBlur}
                      maxLength={maxL}
                      className="w-56 sm:w-auto resize-none rounded-md border border-fuchsia-50 px-2 text-gray-300 outline-none bg-transparent"
            ></textarea>
                {maxL ? <WordCounter maxLength={maxL} length={currentL}/> : <></>}
        </div>
        </div>
    );
}

export function UploadInput({label, name, value, onChange, accept, maxFileSize}) {
    const [file, setFile] = useState(null);
    const [filename, setFileName] = useState("");
    const fileInputRef = useRef(null);
    const {setErrMessage} = useContext(UtilContext);

    useEffect(() => {
        onChange(file);
    }, [file]);

    function handleFileChange(e) {
        if (!e) return;
        const selected = e.target.files[0];

        const validate = validateFile(selected, maxFileSize);
        if (validate !== true) {
            return setErrMessage(validate);
        }

        setFile(selected);
        setFileName(selected.name);
    }

    function clearImage() {
        onChange(null);
        setFile(null)
        setFileName("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }

    return (
        <div className="mb-5 grid grid-cols-[100px_1fr] sm:grid-cols-[150px_1fr] sm:gap-3">
            <label htmlFor={label}>{label}</label>
            <input type="file"
                   ref={fileInputRef}
                   id={label}
                   name={name}
                   value={value}
                   onChange={handleFileChange}
                   accept={accept} className="hidden"/>
            <div className="flex flex-col align-left">
                <label htmlFor={label} className="w-56 sm:w-auto cursor-pointer inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 truncate max-w-xl">
                    Upload banner | Selected: {filename? filename : "None"}
                </label>
                <button type="button" onClick={clearImage} className="border rounded-lg w-36 mr-auto mt-3">Clear Image</button>
            </div>
        </div>
    );
}

export function WordCounter({length, maxLength}) {
    return (
        <div className="w-56 text-sm text-gray-400 text-right sm:w-auto col-start-2">
            {length} / {maxLength}
        </div>
    )
}
