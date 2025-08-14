import { Database } from '@/libs/supabase/types';

export interface BlogPostFrontmatter {
  title: string;
  description?: string;
  date?: string;
  published?: boolean;
  slug?: string;
  tags?: string[];
  author?: string;
  image?: string;
  readingTime?: number;
  category?: string;
  featured?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  socialImage?: string;
  lastModified?: string;
}

export interface FileBlogPost {
  slug: string;
  frontmatter: BlogPostFrontmatter;
  content: string;
  readingTime?: number;
  tableOfContents?: TableOfContentsItem[];
}

export interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
}

export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type BlogPostInsert = Database['public']['Tables']['blog_posts']['Insert'];
export type BlogPostUpdate = Database['public']['Tables']['blog_posts']['Update'];

export type BlogSyncLog = Database['public']['Tables']['blog_sync_log']['Row'];
export type BlogSyncLogInsert = Database['public']['Tables']['blog_sync_log']['Insert'];

export interface BlogPostWithContent extends BlogPost {
  readingTime?: number;
  tableOfContents?: TableOfContentsItem[];
}

export interface BlogSyncResult {
  success: boolean;
  postsProcessed: number;
  postsCreated: number;
  postsUpdated: number;
  errors?: string[];
}

export interface NotionBlock {
  id: string;
  type: string;
  [key: string]: unknown;
}