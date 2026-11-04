import { saveBlogPost } from "../actions";

type BlogEditorPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published" | "archived";
  category?: { name: string } | { name: string }[] | null;
};

export function BlogEditor({ post }: { post?: BlogEditorPost }) {
  const isEditing = Boolean(post?.id);
  const category = Array.isArray(post?.category) ? post.category[0]?.name : post?.category?.name;

  return (
    <form action={saveBlogPost} className="admin-blog-editor">
      <h2>{isEditing ? "Edit blog post" : "Create a blog post"}</h2>
      {isEditing && <input type="hidden" name="id" value={post.id} />}
      <div className="admin-blog-fields">
        <div className="admin-blog-field admin-blog-field-full">
          <label htmlFor={isEditing ? `title-${post.id}` : "new-title"}>Post title *</label>
          <input id={isEditing ? `title-${post.id}` : "new-title"} name="title" required maxLength={240} defaultValue={post?.title ?? ""} placeholder="e.g. How healthcare practices can improve patient enquiries" />
        </div>
        <div className="admin-blog-field">
          <label htmlFor={isEditing ? `slug-${post.id}` : "new-slug"}>URL slug</label>
          <input id={isEditing ? `slug-${post.id}` : "new-slug"} name="slug" maxLength={200} defaultValue={post?.slug ?? ""} placeholder="auto-generated from title if blank" />
        </div>
        <div className="admin-blog-field">
          <label htmlFor={isEditing ? `category-${post.id}` : "new-category"}>Category</label>
          <input id={isEditing ? `category-${post.id}` : "new-category"} name="category" maxLength={100} defaultValue={category ?? ""} placeholder="Healthcare SEO" />
          <p className="admin-blog-help">A new category is created automatically if it does not exist.</p>
        </div>
        <div className="admin-blog-field admin-blog-field-full">
          <label htmlFor={isEditing ? `excerpt-${post.id}` : "new-excerpt"}>Excerpt</label>
          <textarea id={isEditing ? `excerpt-${post.id}` : "new-excerpt"} name="excerpt" maxLength={1000} defaultValue={post?.excerpt ?? ""} placeholder="A short summary shown on the blog listing." />
        </div>
        <div className="admin-blog-field admin-blog-field-full">
          <label htmlFor={isEditing ? `content-${post.id}` : "new-content"}>Article content (HTML) *</label>
          <textarea id={isEditing ? `content-${post.id}` : "new-content"} className="admin-blog-content" name="content" required maxLength={100000} defaultValue={post?.content ?? ""} placeholder="<p>Write your article content here...</p>" />
          <p className="admin-blog-help">Use basic HTML such as &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt; and &lt;li&gt; for article formatting.</p>
        </div>
        <div className="admin-blog-field admin-blog-field-full">
          <label htmlFor={isEditing ? `image-${post.id}` : "new-image"}>Cover image URL</label>
          <input id={isEditing ? `image-${post.id}` : "new-image"} name="cover_image_url" type="url" maxLength={2048} defaultValue={post?.cover_image_url ?? ""} placeholder="https://..." />
        </div>
        <div className="admin-blog-field">
          <label htmlFor={isEditing ? `seo-title-${post.id}` : "new-seo-title"}>SEO title</label>
          <input id={isEditing ? `seo-title-${post.id}` : "new-seo-title"} name="seo_title" maxLength={70} defaultValue={post?.seo_title ?? ""} placeholder="Optional, up to 70 characters" />
        </div>
        <div className="admin-blog-field">
          <label htmlFor={isEditing ? `seo-description-${post.id}` : "new-seo-description"}>SEO description</label>
          <input id={isEditing ? `seo-description-${post.id}` : "new-seo-description"} name="seo_description" maxLength={180} defaultValue={post?.seo_description ?? ""} placeholder="Optional, up to 180 characters" />
        </div>
        <div className="admin-blog-field">
          <label htmlFor={isEditing ? `status-${post.id}` : "new-status"}>Publication status</label>
          <select id={isEditing ? `status-${post.id}` : "new-status"} name="status" defaultValue={post?.status ?? "draft"}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div className="admin-blog-actions">
        <button className="admin-blog-primary" type="submit">{isEditing ? "Save changes" : "Create post"}</button>
      </div>
    </form>
  );
}
