import fs from 'fs';
import matter from 'gray-matter';
import path from 'path';

import { FileBlogPost } from '../types';

const BLOGS_DIRECTORY = path.join(process.cwd(), '..', 'content', 'blogs');

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

function generateSlugFromFilename(filename: string): string {
  return filename.replace(/\.md$/, '');
}

export async function getFileBlogPosts(limit?: number): Promise<FileBlogPost[]> {
  try {
    if (!fs.existsSync(BLOGS_DIRECTORY)) {
      console.warn(`Blogs directory not found: ${BLOGS_DIRECTORY}`);
      return [];
    }

    const files = fs.readdirSync(BLOGS_DIRECTORY);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const posts: FileBlogPost[] = [];

    for (const file of markdownFiles) {
      try {
        const filePath = path.join(BLOGS_DIRECTORY, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontmatter, content } = matter(fileContent);

        const slug = frontmatter.slug || generateSlugFromFilename(file);
        const readingTime = frontmatter.readingTime || calculateReadingTime(content);

        const post: FileBlogPost = {
          slug,
          frontmatter: {
            title: frontmatter.title || 'Untitled',
            description: frontmatter.description,
            date: frontmatter.date,
            published: frontmatter.published !== false,
            slug,
            tags: frontmatter.tags || [],
            author: frontmatter.author,
            image: frontmatter.image,
            readingTime: frontmatter.readingTime || readingTime,
            category: frontmatter.category,
            featured: frontmatter.featured,
            seoTitle: frontmatter.seoTitle,
            seoDescription: frontmatter.seoDescription,
            socialImage: frontmatter.socialImage,
            lastModified: frontmatter.lastModified,
          },
          content,
          readingTime: frontmatter.readingTime || readingTime,
        };

        if (post.frontmatter.published) {
          posts.push(post);
        }
      } catch (error) {
        console.error(`Error reading blog post ${file}:`, error);
      }
    }

    posts.sort((a, b) => {
      const dateA = new Date(a.frontmatter.date || 0);
      const dateB = new Date(b.frontmatter.date || 0);
      return dateB.getTime() - dateA.getTime();
    });

    return limit ? posts.slice(0, limit) : posts;
  } catch (error) {
    console.error('Error fetching file blog posts:', error);
    return [];
  }
}

export async function getFileBlogPost(slug: string): Promise<FileBlogPost | null> {
  try {
    if (!fs.existsSync(BLOGS_DIRECTORY)) {
      console.warn(`Blogs directory not found: ${BLOGS_DIRECTORY}`);
      return null;
    }

    const files = fs.readdirSync(BLOGS_DIRECTORY);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    for (const file of markdownFiles) {
      try {
        const filePath = path.join(BLOGS_DIRECTORY, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontmatter, content } = matter(fileContent);

        const fileSlug = frontmatter.slug || generateSlugFromFilename(file);

        if (fileSlug === slug) {
          const readingTime = frontmatter.readingTime || calculateReadingTime(content);

          return {
            slug: fileSlug,
            frontmatter: {
              title: frontmatter.title || 'Untitled',
              description: frontmatter.description,
              date: frontmatter.date,
              published: frontmatter.published !== false,
              slug: fileSlug,
              tags: frontmatter.tags || [],
              author: frontmatter.author,
              image: frontmatter.image,
              readingTime: frontmatter.readingTime || readingTime,
              category: frontmatter.category,
              featured: frontmatter.featured,
              seoTitle: frontmatter.seoTitle,
              seoDescription: frontmatter.seoDescription,
              socialImage: frontmatter.socialImage,
              lastModified: frontmatter.lastModified,
            },
            content,
            readingTime: frontmatter.readingTime || readingTime,
          };
        }
      } catch (error) {
        console.error(`Error reading blog post ${file}:`, error);
      }
    }

    return null;
  } catch (error) {
    console.error('Error fetching file blog post:', error);
    return null;
  }
}

export async function getFileBlogPostSlugs(): Promise<string[]> {
  try {
    if (!fs.existsSync(BLOGS_DIRECTORY)) {
      console.warn(`Blogs directory not found: ${BLOGS_DIRECTORY}`);
      return [];
    }

    const files = fs.readdirSync(BLOGS_DIRECTORY);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    const slugs: string[] = [];

    for (const file of markdownFiles) {
      try {
        const filePath = path.join(BLOGS_DIRECTORY, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data: frontmatter } = matter(fileContent);

        const slug = frontmatter.slug || generateSlugFromFilename(file);

        if (frontmatter.published !== false) {
          slugs.push(slug);
        }
      } catch (error) {
        console.error(`Error reading blog post ${file}:`, error);
      }
    }

    return slugs;
  } catch (error) {
    console.error('Error fetching file blog post slugs:', error);
    return [];
  }
}
