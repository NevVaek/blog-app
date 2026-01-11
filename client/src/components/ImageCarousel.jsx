import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageCarousel({ images = [] }) {
    const [expand, setExpand] = useState(false);
    const [index, setIndex] = useState(0);

    if (!images.length) return null;

    const prev = (e) => {
        e.stopPropagation();
        setIndex((index - 1 + images.length) % images.length);
    };

    const next = (e) => {
        e.stopPropagation();
        setIndex((index + 1) % images.length);
    };

    return (
        <div>
        <div className="relative w-full max-w-3xl h-[35rem] mx-auto flex flex-col justify-center items-center bg-black rounded-xl" onClick={(e) => {e.stopPropagation(); setExpand(true)}}>
            {/* Image */}
            <img
                src={images[index]}
                alt={`image-${index}`}
                className="w-full h-full object-contain rounded-xl"
                loading="lazy"
            />

            {/* Left arrow */}
            {images.length > 1 && (
                <button
                    onClick={prev}
                    className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 hover:bg-black/60
                               text-white p-2 rounded-full"
                >
                    <ChevronLeft size={20} />
                </button>
            )}

            {/* Right arrow */}
            {images.length > 1 && (
                <button
                    onClick={next}
                    className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 hover:bg-black/60
                               text-white p-2 rounded-full"
                >
                    <ChevronRight size={20} />
                </button>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
                <div className="flex justify-center mt-2 space-x-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                                i === index ? "bg-gray-900" : "bg-gray-400"
                            }`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIndex(i);}
                            }
                        />
                    ))}
                </div>
            )}
        </div>
        {expand && (
            <div
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
                onClick={(e) => {e.stopPropagation(); setExpand(false)} }
            >
            <img
            src={images[index]}
            alt="Full image"
            className="max-w-[90vw] max-h-[90vh] object-contain cursor-zoom-out"
            />
        </div>
        )}
            </div>

    );
}
