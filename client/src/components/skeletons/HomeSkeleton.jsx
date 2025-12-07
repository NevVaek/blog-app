import Layout, {PageTitle} from "../Layout.jsx";

export default function HomeSkeleton() {
  return (

      <Layout>
            <PageTitle prompt="Top Blogs -Discover Your Next New Favourite!"></PageTitle>
            <div>
              {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="block max-w-11/12 rounded-lg border bg-gray-800 border-gray-700 mb-6 animate-pulse"
        >
          {/* Banner */}
          <div className="h-30 w-full bg-gray-700 rounded-lg"></div>

          {/* Text Container */}
          <div className="rounded-md bg-gray-900 p-3">
            {/* Blog Name */}
            <div className="h-5 w-2/3 bg-gray-700 rounded mb-3"></div>

            {/* ShowcaseUser layout imitation */}
            <div className="flex items-center gap-3 mb-3">
              <div className="h-6 w-6 rounded-full bg-gray-700"></div>
              <div className="h-4 w-24 bg-gray-700 rounded"></div>
            </div>

            {/* Followers */}
            <div className="h-3 w-20 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
            </div>
        </Layout>
  );
}
