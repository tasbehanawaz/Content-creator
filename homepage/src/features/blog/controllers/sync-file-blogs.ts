import { supabaseAdminClient } from '@/libs/supabase/supabase-admin';

import { BlogPostInsert, BlogSyncLogInsert, BlogSyncResult } from '../types';

import { getFileBlogPosts } from './get-file-blog-posts';

export async function syncFileBlogs(): Promise<BlogSyncResult> {
  const syncLog: BlogSyncLogInsert = {
    sync_type: 'file_to_database',
    status: 'in_progress',
    started_at: new Date().toISOString(),
    posts_processed: 0,
    posts_created: 0,
    posts_updated: 0,
    error_message: null,
  };

  try {
    const supabase = supabaseAdminClient;
    const filePosts = await getFileBlogPosts();

    if (!supabase) {
      throw new Error('Supabase admin client not configured');
    }

    let postsCreated = 0;
    let postsUpdated = 0;
    const errors: string[] = [];

    for (const filePost of filePosts) {
      try {
        // Map file-based blog post to database schema
        const blogPost: BlogPostInsert = {
          notion_page_id: `file_${filePost.slug}`, // Use file prefix to distinguish from Notion posts
          title: filePost.frontmatter.title,
          slug: filePost.slug,
          excerpt: filePost.frontmatter.description || null,
          content: filePost.content,
          notion_blocks: null, // Not applicable for file-based posts
          meta_title: filePost.frontmatter.seoTitle || null,
          meta_description: filePost.frontmatter.seoDescription || filePost.frontmatter.description || null,
          og_image: filePost.frontmatter.socialImage || filePost.frontmatter.image || null,
          author: filePost.frontmatter.author || null,
          tags: filePost.frontmatter.tags || null,
          category: filePost.frontmatter.category || null,
          published: filePost.frontmatter.published !== false,
          published_at: filePost.frontmatter.date || new Date().toISOString(),
          notion_last_edited_time: filePost.frontmatter.lastModified || filePost.frontmatter.date || null,
        };

        // Check if post already exists
        const { data: existingPost } = await supabase
          .from('blog_posts')
          .select('id, updated_at')
          .eq('notion_page_id', blogPost.notion_page_id)
          .single();

        if (existingPost) {
          // Update existing post
          const { error } = await supabase
            .from('blog_posts')
            .update(blogPost)
            .eq('notion_page_id', blogPost.notion_page_id);

          if (error) {
            errors.push(`Failed to update post ${filePost.slug}: ${error.message}`);
          } else {
            postsUpdated++;
          }
        } else {
          // Insert new post
          const { error } = await supabase
            .from('blog_posts')
            .insert(blogPost);

          if (error) {
            errors.push(`Failed to create post ${filePost.slug}: ${error.message}`);
          } else {
            postsCreated++;
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Error processing post ${filePost.slug}: ${errorMessage}`);
      }
    }

    // Update sync log
    syncLog.status = errors.length > 0 ? 'completed_with_errors' : 'completed';
    syncLog.completed_at = new Date().toISOString();
    syncLog.duration_ms = Date.now() - new Date(syncLog.started_at).getTime();
    syncLog.posts_processed = filePosts.length;
    syncLog.posts_created = postsCreated;
    syncLog.posts_updated = postsUpdated;
    syncLog.error_message = errors.length > 0 ? errors.join('; ') : null;

    await supabase.from('blog_sync_log').insert(syncLog);

    return {
      success: errors.length === 0,
      postsProcessed: filePosts.length,
      postsCreated,
      postsUpdated,
      errors: errors.length > 0 ? errors : undefined,
    };
  } catch (error) {
    // Log error sync
    syncLog.status = 'failed';
    syncLog.completed_at = new Date().toISOString();
    syncLog.duration_ms = Date.now() - new Date(syncLog.started_at).getTime();
    syncLog.error_message = error instanceof Error ? error.message : 'Unknown sync error';

    try {
      await supabaseAdminClient?.from('blog_sync_log').insert(syncLog);
    } catch (logError) {
      console.error('Failed to log sync error:', logError);
    }

    return {
      success: false,
      postsProcessed: 0,
      postsCreated: 0,
      postsUpdated: 0,
      errors: [error instanceof Error ? error.message : 'Unknown sync error'],
    };
  }
}

export async function getLastSyncStatus(): Promise<{ success: boolean; lastSync: string | null; errors?: string[] }> {
  try {
    const supabase = supabaseAdminClient;

    if (!supabase) {
      return { success: false, lastSync: null, errors: ['Supabase not configured'] };
    }

    const { data, error } = await supabase
      .from('blog_sync_log')
      .select('*')
      .eq('sync_type', 'file_to_database')
      .order('started_at', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
      return { success: false, lastSync: null, errors: [error.message] };
    }

    if (!data) {
      return { success: true, lastSync: null };
    }

    return {
      success: data.status === 'completed',
      lastSync: data.completed_at || data.started_at,
      errors: data.error_message ? [data.error_message] : undefined,
    };
  } catch (error) {
    return {
      success: false,
      lastSync: null,
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}
