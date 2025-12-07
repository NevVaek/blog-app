import Layout from "../Layout.jsx";

export default function BlogSkeleton() {
    return (
        <Layout>
            <div>
                <div className="block max-w-11/12 animate-pulse">

                    {/* Banner */}
                    <div className="overflow-hidden rounded-lg">
                        <div className="h-40 w-full bg-gray-700 rounded-lg" />

                        {/* Blog Meta */}
                        <div className="rounded-md bg-gray-500 p-3 text-white mt-2">

                            {/* Blog Name */}
                            <div className="h-8 w-40 bg-gray-600 rounded mb-4"></div>

                            {/* Owner + followers */}
                            <div className="flex items-center mb-6">
                                {/* avatar */}
                                <div className="w-6 h-6 bg-gray-600 rounded-full mr-3"></div>

                                {/* username */}
                                <div className="h-4 w-24 bg-gray-600 rounded mr-4"></div>

                                {/* followers */}
                                <div className="h-3 w-16 bg-gray-600 rounded"></div>
                            </div>

                            {/* Description (3–5 lines) */}
                            <div className="space-y-2">
                                <div className="h-3 w-10/12 bg-gray-600 rounded"></div>
                                <div className="h-3 w-8/12 bg-gray-600 rounded"></div>
                                <div className="h-3 w-9/12 bg-gray-600 rounded"></div>
                                <div className="h-3 w-6/12 bg-gray-600 rounded"></div>
                            </div>
                        </div>

                        {/* Top Posts Title */}
                        <div className="mt-6">
                            <div className="m-2 h-6 w-32 bg-gray-700 rounded"></div>
                            <hr className="w-11/12 mb-4 border-gray-700" />
                        </div>

                        {/* Posts Skeleton */}
                        <div>
                            {[1, 2, 3].map(i => (
                                <div key={i} className="m-2">
                                    {/* Post title */}
                                    <div className="h-6 w-40 bg-gray-700 rounded mb-3"></div>

                                    {/* Post user */}
                                    <div className="flex items-center mb-3">
                                        <div className="w-6 h-6 bg-gray-700 rounded-full mr-3"></div>
                                        <div className="h-4 w-24 bg-gray-700 rounded"></div>
                                    </div>

                                    {/* Post body/image */}
                                    <div className="w-full h-32 bg-gray-700 rounded"></div>

                                    <hr className="m-3 border-gray-700" />
                                </div>
                            ))}
                        </div>

                        {/* Load more */}
                        <div className="flex justify-center mt-4 mb-10">
                            <div className="w-24 h-8 bg-gray-700 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}