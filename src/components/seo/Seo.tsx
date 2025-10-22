import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
  keywords?: string[];
}

export const Seo = ({
  title = 'Tech Wallpapers & Cyberpunk Visuals | CrackingWall',
  description = 'Download and explore high-quality tech wallpapers, cyberpunk art, glitch visuals, and hacker aesthetics. Dive into the digital underground with CrackingWall.',
  image = '/og-image.webp',
  article = false,
  keywords = ['tech wallpapers', 'hacker wallpapers', 'cyberpunk', 'glitch art', 'dark tech', 'terminal aesthetic', 'hacker culture']
}: SeoProps) => {
  const { pathname } = useLocation();
  const siteUrl = 'https://crackingwall.com';
  const url = `${siteUrl}${pathname}`;
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const schemaOrgWebPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: siteUrl,
    name: title,
    description,
    publisher: {
      '@type': 'Organization',
      name: 'CrackingWall',
      logo: `${siteUrl}/logo.png`
    }
  };

  const schemaOrgImageGallery = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: title,
    url,
    description,
    inLanguage: 'en',
    keywords: keywords.join(', '),
    creator: {
      '@type': 'Organization',
      name: 'CrackingWall',
      url: siteUrl
    }
  };

  return (
    <HelmetProvider>
      <Helmet>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords.join(', ')} />
        <link rel="canonical" href={url} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content={article ? 'article' : 'website'} />
        <meta property="og:url" content={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={title} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify(schemaOrgWebPage)}
        </script>
        
        {!article && (
          <script type="application/ld+json">
            {JSON.stringify(schemaOrgImageGallery)}
          </script>
        )}

        {/* Preconnect and Preload */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://your-supabase-url.supabase.co" />
        <link rel="dns-prefetch" href="https://your-supabase-url.supabase.co" />
      </Helmet>
    </HelmetProvider>
  );
};

export default Seo;
