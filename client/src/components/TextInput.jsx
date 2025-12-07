
export default function TextInput({label, type= "text", value, onChange, placeHolder, onBlur}) {
    return (
        <div className="mb-5 grid grid-cols-[150px_1fr] gap-4">
            <label className="text-lg text-gray-300">{label}</label>
            <input type={type}
                   value={value}
                   onChange={onChange}
                   placeholder={placeHolder}
                   onBlur={onBlur}
                   className="w-64 rounded-md border border-fuchsia-50 pl-2 text-lg text-white outline-none bg-transparent"/>
        </div>
);
}