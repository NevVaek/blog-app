import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageCarousel({ images = [] }) {
    const [index, setIndex] = useState(0);

    if (!images.length) return null;

    const prev = () => {
        setIndex((index - 1 + images.length) % images.length);
    };

    const next = () => {
        setIndex((index + 1) % images.length);
    };

    return (
        <div className="relative w-full max-w-xl mx-auto">
            {/* Image */}
            <img
                src={images[index]}
                alt={`image-${index}`}
                className="w-full object-contain rounded-xl"
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
                            onClick={() => setIndex(i)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
