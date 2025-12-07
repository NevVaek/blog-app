import Layout from "../Layout.jsx";

export default function PostSkeleton() {
    return (
        <Layout>
            <div>
                <div className="block max-w-11/12 animate-pulse">
                    <div className="overflow-hidden rounded-lg">
                        <div className="p-2">

                            {/* Title */}
                            <div className="h-6 w-2/3 bg-gray-700 rounded mb-4"></div>

                            {/* Author */}
                            <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-gray-700 rounded-full mr-3"></div>
                                <div className="h-4 w-24 bg-gray-700 rounded"></div>
                            </div>

                            {/* Image Carousel Skeleton */}
                            <div className="relative w-full max-w-xl mx-auto mb-6">

                                {/* Placeholder image */}
                                <div className="w-full h-64 bg-gray-700 rounded-xl"></div>

                                {/* Left arrow */}
                                <div className="
                                    absolute top-1/2 left-2 -translate-y-1/2
                                    bg-gray-800/40 p-3 rounded-full">
                                </div>

                                {/* Right arrow */}
                                <div className="
                                    absolute top-1/2 right-2 -translate-y-1/2
                                    bg-gray-800/40 p-3 rounded-full">
                                </div>

                                {/* Dot indicators */}
                                <div className="flex justify-center mt-2 space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                                    <div className="w-3 h-3 rounded-full bg-gray-600"></div>
                                </div>
                            </div>

                            {/* Body text */}
                            <div className="space-y-3">
                                <div className="h-3 w-full bg-gray-700 rounded"></div>
                                <div className="h-3 w-5/6 bg-gray-700 rounded"></div>
                                <div className="h-3 w-4/6 bg-gray-700 rounded"></div>
                                <div className="h-3 w-3/6 bg-gray-700 rounded"></div>
                                <div className="h-3 w-full bg-gray-700 rounded"></div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
