import slugify from "slugify";
import {blogModel} from "../dbmodels/blogPost.js"; // adjust the path as needed


async function migrateBlogSlugs() {
  try {

    // Find all blogs that are missing a blogSlug
    const blogs = await blogModel.find({ blogSlug: { $exists: false } });

    if (blogs.length === 0) {
      console.log("✨ All blogs already have slugs. Nothing to update.");
    }

    console.log(`🧭 Found ${blogs.length} blog(s) missing slugs.`);

    for (const blog of blogs) {
      blog.blogSlug = slugify(blog.blogName, { lower: true, strict: true });
      await blog.save();
      console.log(`✅ Added slug for "${blog.blogName}" → ${blog.blogSlug}`);
    }

    console.log("🎉 Migration complete!");

  } catch (err) {
    console.error("❌ Migration failed:", err);
  }
}

export default migrateBlogSlugs;
