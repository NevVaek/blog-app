import {useState, useEffect, useRef, useContext} from "react";
import {validateFile} from "../services/validate.js";
import {UtilContext} from "../context/UtilContext.jsx";
import UpImageIcon from "./icons/UpImageIcon.jsx";
import GarbageIcon from "./icons/GarbageIcon.jsx";

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

export function UploadInput({mode, label, name, value, onChange, accept, maxFileSize, initial}) {
    const [file, setFile] = useState(mode === "post" ? [] : null);
    const [filename, setFileName] = useState("");
    const [fileNum, setFileNum] = useState(0);
    const [previews, setPreviews] = useState([]);
    const [first, setFirst] = useState(true);
    const fileInputRef = useRef(null);
    const {setErrMessage} = useContext(UtilContext);
    const maxFileNum = 5;
    const fileSizeInMB = maxFileSize / (1024 * 1024);

    useEffect(() => {
        if (initial) {
            setFile(initial);
            setPreviews(initial);
            setFileNum(initial.length);
        }
    }, []);

    useEffect(() => {
        return () => {
            previews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previews]);

    useEffect(() => {
        if (!first) {
            onChange(file);
        }
    }, [file]);

    function handleFileAdd(e) {
        if (!e) return;
        setFirst(false);

        if (mode === "blog") {
            const selected = e.target.files[0];

            const validate = validateFile(selected, maxFileSize);
            if (!validate) {
                return setErrMessage(`File must be under ${fileSizeInMB}MB.`);
            }

            setFile(selected);
            setFileName(selected.name);
        } else if (mode === "post") {
            const imgBasket = Array.from(e.target.files);
            const selected = imgBasket.filter((img) => validateFile(img, maxFileSize));

            if (imgBasket.length !== selected.length) {
                setErrMessage(`Images must each be under ${fileSizeInMB}MB. ${imgBasket.length - selected.length} file(s) rejected`);
            }

            if (selected.length > maxFileNum - fileNum) {
                selected.splice(maxFileNum - fileNum)
                if (selected.length === 0) return setErrMessage("Max image count already reached. Please remove images before uploading new ones")
                setErrMessage(`Max image count is 5. Only the first ${maxFileNum - fileNum} were uploaded`);
            }
            setFile(prev => [...prev, ...selected]);
            const prevURL = selected.map(e => URL.createObjectURL(e));
            setPreviews(prev =>  [...prev,  ...prevURL]);
            setFileNum(prev => prev + selected.length);
        }
    }

    function clearImage(e,  num) {
        e.stopPropagation();
        e.preventDefault();
        setFirst(false);
        if (mode === "blog") {
            onChange(null);
            setFile(null);
            setFileName("");

            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        } else if (mode === "post") {
            const newArr = file.filter(val => val !== file[num]);
            const newArr2 = previews.filter(val => val !== previews[num]);
            setFile(newArr);
            URL.revokeObjectURL(previews[num]);
            setPreviews(newArr2);
            setFileNum(prev => prev !== 0 ? prev - 1 : 0);
        }
    }

    if (mode === "post") return (
        <div className="mb-5 grid grid-cols-[100px_1fr] sm:grid-cols-[150px_1fr] sm:gap-3">
            <label htmlFor={label}>{label}</label>
            <input type="file"
                   ref={fileInputRef}
                   id={label}
                   name={name}
                   value={value}
                   onChange={handleFileAdd}
                   accept={accept} multiple className="hidden"/>
            <div className="flex flex-wrap w-94">
                {[0, 1, 2, 3, 4].map(num => (
                    <label key={num} htmlFor={label} className="w-28 h-28 sm:w-32 sm:h-32 cursor-pointer mr-2 mb-2 inline-block rounded-md bg-blue-600 overflow-hidden hover:bg-blue-700 flex justify-center items-center bg-cover bg-center group"
                    style={{ backgroundImage: previews[num] ? `url(${previews[num]})` : "none"}}>
                        {previews[num] ? <div className="w-full h-full hidden group-hover:block p-1"><button type="button" className="rounded-full w-10 h-10 bg-gray-200 bg-opacity-80 flex justify-center items-center" onClick={(e) => clearImage(e,num)}><GarbageIcon size={25}/></button></div> : <UpImageIcon/>}
                    </label>

                ))}
            </div>
        </div>
    )

    return (
        <div className="mb-5 grid grid-cols-[100px_1fr] sm:grid-cols-[150px_1fr] sm:gap-3">
            <label htmlFor={label}>{label}</label>
            <input type="file"
                   ref={fileInputRef}
                   id={label}
                   name={name}
                   value={value}
                   onChange={handleFileAdd}
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
