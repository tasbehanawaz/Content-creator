import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Container } from '@/components/container';
import { BlogStructuredData } from '@/features/blog/components/blog-structured-data';
import { MarkdownRenderer } from '@/features/blog/components/markdown-renderer';
import { getBlogPost, getBlogPostSlugs } from '@/features/blog/controllers/get-blog-posts';
import { BlogPost } from '@/features/blog/types';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || post.published_at || undefined,
      authors: post.author ? [post.author] : undefined,
      tags: post.tags || undefined,
      images: post.og_image ? [{ url: post.og_image }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.og_image ? [post.og_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <Container className='py-16'>
      <BlogStructuredData post={post} />
      <div className='max-w-4xl mx-auto'>
        <article>
          <BlogPostHeader post={post} />
          <BlogPostContent post={post} />
        </article>
      </div>
    </Container>
  );
}

function BlogPostHeader({ post }: { post: BlogPost }) {
  return (
    <header className='mb-12'>
      <div className='mb-6'>
        <div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
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

        <h1 className='text-4xl font-bold mb-4'>{post.title}</h1>

        {post.excerpt && (
          <p className='text-xl text-gray-600 leading-relaxed'>{post.excerpt}</p>
        )}
      </div>

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
    </header>
  );
}

function BlogPostContent({ post }: { post: BlogPost }) {
  return <MarkdownRenderer content={post.content} />;
}