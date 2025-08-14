import { BlogPost, FileBlogPost } from '../types';

import { getFileBlogPosts } from './get-file-blog-posts';

// Convert FileBlogPost to BlogPost format for compatibility
function convertFileBlogToDbFormat(filePost: FileBlogPost): BlogPost {
  return {
    id: `file_${filePost.slug}_${Date.now()}`, // Temporary ID for file-based posts
    notion_page_id: `file_${filePost.slug}`,
    title: filePost.frontmatter.title,
    slug: filePost.slug,
    excerpt: filePost.frontmatter.description || null,
    content: filePost.content,
    notion_blocks: null,
    meta_title: filePost.frontmatter.seoTitle || null,
    meta_description: filePost.frontmatter.seoDescription || filePost.frontmatter.description || null,
    og_image: filePost.frontmatter.socialImage || filePost.frontmatter.image || null,
    author: filePost.frontmatter.author || null,
    tags: filePost.frontmatter.tags || null,
    category: filePost.frontmatter.category || null,
    published: filePost.frontmatter.published !== false,
    published_at: filePost.frontmatter.date || null,
    notion_last_edited_time: filePost.frontmatter.lastModified || filePost.frontmatter.date || null,
    created_at: new Date().toISOString(),
    updated_at: filePost.frontmatter.lastModified || filePost.frontmatter.date || new Date().toISOString(),
    synced_at: new Date().toISOString(),
  };
}

export async function getBlogPosts(limit?: number): Promise<BlogPost[]> {
  try {
    const filePosts = await getFileBlogPosts(limit);
    return filePosts.map(convertFileBlogToDbFormat);
  } catch (error) {
    console.error('Error fetching blog posts from files:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      details: String(error)
    });
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const { getFileBlogPost } = await import('./get-file-blog-posts');
    const filePost = await getFileBlogPost(slug);

    if (filePost) {
      return convertFileBlogToDbFormat(filePost);
    }

    return null;
  } catch (error) {
    console.error('Error fetching blog post from files:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      details: String(error)
    });
    return null;
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  try {
    const { getFileBlogPostSlugs } = await import('./get-file-blog-posts');
    return await getFileBlogPostSlugs();
  } catch (error) {
    console.error('Error fetching blog post slugs from files:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      details: String(error)
    });
    return [];
  }
}