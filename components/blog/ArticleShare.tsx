interface ArticleShareProps {
  url: string;
  title: string;
}

export function ArticleShare({ url, title }: ArticleShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      ariaLabel: "Share on LinkedIn",
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      ariaLabel: "Share on X",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      ariaLabel: "Share on Facebook",
    },
  ];

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API not available; user can copy URL from address bar
    }
  };

  return (
    <div className="article-share">
      <span className="article-share__label">Share this article</span>
      <div className="article-share__links">
        {shareLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="article-share__link"
            aria-label={link.ariaLabel}
          >
            {link.name}
          </a>
        ))}
        <button
          type="button"
          className="article-share__link article-share__copy"
          onClick={copyToClipboard}
          aria-label="Copy link to clipboard"
        >
          Copy Link
        </button>
      </div>
    </div>
  );
}
