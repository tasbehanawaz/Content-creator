import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const html = marked(content, {
    breaks: true,
    gfm: true,
  });

  return (
    <div
      className={`prose prose-lg max-w-none
        prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
        prose-h1:text-4xl prose-h1:mb-6
        prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:border-b prose-h2:border-border prose-h2:pb-2
        prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
        prose-p:text-foreground/90 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-primary prose-a:hover:text-primary/80 prose-a:no-underline hover:prose-a:underline
        prose-strong:text-foreground prose-strong:font-semibold
        prose-ul:my-6 prose-ul:space-y-2 prose-li:text-foreground/90 prose-li:leading-relaxed
        prose-ol:my-6 prose-ol:space-y-2
        prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-pink-50 dark:prose-code:bg-pink-950/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
        prose-pre:bg-muted prose-pre:border prose-pre:border-border prose-pre:rounded-lg prose-pre:p-4 prose-pre:overflow-x-auto prose-pre:text-foreground
        prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-muted prose-blockquote:py-4 prose-blockquote:my-6 prose-blockquote:text-foreground/90
        prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8
        prose-hr:border-border prose-hr:my-12
        ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}