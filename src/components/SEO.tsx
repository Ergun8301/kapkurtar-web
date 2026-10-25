import type { FC } from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: string;
}

/**
 * Composant SEO réutilisable pour optimiser les meta tags de chaque page
 * Gère les meta tags standards, Open Graph et Twitter Cards
 */
const SEO: FC<SEOProps> = ({
  title,
  description,
  canonical,
  keywords = 'ucuz yemek, indirimli yemek, fazla gıda, gıda israfı, KapKurtar, yemek fırsatları',
  ogImage = 'https://kapkurtar.com/images/logo-footer.webp',
  ogType = 'website'
}) => {
  const siteUrl = 'https://kapkurtar.com';
  const fullCanonical = canonical ? `${siteUrl}${canonical}` : siteUrl;

  return (
    <Helmet>
      {/* Meta tags standards */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="tr_TR" />
      <meta property="og:site_name" content="KapKurtar" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullCanonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Langue */}
      <html lang="tr" />
    </Helmet>
  );
};

export default SEO;
