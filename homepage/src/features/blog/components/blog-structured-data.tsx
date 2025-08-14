import { BlogPost } from '../types';

interface BlogStructuredDataProps {
  post: BlogPost;
}

export function BlogStructuredData({ post }: BlogStructuredDataProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    author: {
      '@type': 'Person',
      name: post.author || 'Websonic Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Websonic',
      logo: {
        '@type': 'ImageObject',
        url: 'https://your-domain.com/logo.png',
      },
    },
    image: post.og_image
      ? {
        '@type': 'ImageObject',
        url: post.og_image,
      }
      : undefined,
    articleBody: post.content,
    keywords: post.tags?.join(', '),
    articleSection: post.category,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://your-domain.com/blog/${post.slug}`,
    },
  };

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}