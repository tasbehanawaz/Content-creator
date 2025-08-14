import { Metadata } from 'next';
import Link from 'next/link';

import { Container } from '@/components/container';
import { getBlogPosts } from '@/features/blog/controllers/get-blog-posts';
import { BlogPost } from '@/features/blog/types';

export const metadata: Metadata = {
  title: 'Blog - Websonic',
  description: 'Latest insights, tutorials, and updates from the Websonic team.',
  openGraph: {
    title: 'Blog - Websonic',
    description: 'Latest insights, tutorials, and updates from the Websonic team.',
    type: 'website',
  },
};

// Cache blog list for 5 minutes
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <Container className='py-16'>
      <div className='max-w-4xl mx-auto'>
        <div className='mb-12 text-center'>
          <h1 className='text-4xl font-bold mb-4'>Blog</h1>
          <p className='text-xl text-gray-600'>
            Latest insights, tutorials, and updates from the Websonic team.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className='text-center py-12'>
            <p className='text-muted-foreground'>No blog posts published yet.</p>
          </div>
        ) : (
          <div className='grid gap-8'>
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </Container>
  );
}

function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <article className='border-b border-border pb-8 last:border-b-0'>
      <div className='flex flex-col gap-4'>
        <div className='flex items-center gap-4 text-sm text-muted-foreground'>
          {post.published_at && (
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          )}
          {post.author && <span>by {post.author}</span>}
          {post.category && (
            <span className='px-2 py-1 bg-primary/10 text-primary rounded-full text-xs'>
              {post.category}
            </span>
          )}
        </div>

        <Link href={`/blog/${post.slug}`} className='group'>
          <h2 className='text-2xl font-bold group-hover:text-primary transition-colors'>
            {post.title}
          </h2>
        </Link>

        {post.excerpt && (
          <p className='text-muted-foreground leading-relaxed'>{post.excerpt}</p>
        )}

        {post.tags && post.tags.length > 0 && (
          <div className='flex flex-wrap gap-2'>
            {post.tags.map((tag) => (
              <span
                key={tag}
                className='px-3 py-1 bg-primary/10 text-primary rounded-full text-sm'
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className='text-primary hover:text-primary/80 font-medium inline-flex items-center gap-1'
        >
          Read more →
        </Link>
      </div>
    </article>
  );
}