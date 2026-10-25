import type { FC } from 'react';

interface OrganizationSchemaProps {
  type: 'organization';
}

interface LocalBusinessSchemaProps {
  type: 'localBusiness';
  city: string;
  cityTurkish: string;
}

interface FAQSchemaProps {
  type: 'faq';
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

type StructuredDataProps = OrganizationSchemaProps | LocalBusinessSchemaProps | FAQSchemaProps;

/**
 * Composant pour injecter des données structurées Schema.org dans le <head>
 * Améliore le référencement et l'affichage dans les résultats de recherche Google
 */
const StructuredData: FC<StructuredDataProps> = (props) => {
  let schema: any = {};

  if (props.type === 'organization') {
    schema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": "https://kapkurtar.com/#organization",
      "name": "KapKurtar",
      "url": "https://kapkurtar.com",
      "logo": "https://kapkurtar.com/images/logo-round.webp",
      "description": "Gıda israfını önleyen KapKurtar, restoran, fırın ve marketlerin günün sonunda kalan ürünlerini indirimli fiyatlarla sunar.",
      "foundingDate": "2024",
      "areaServed": [
        {
          "@type": "City",
          "name": "İstanbul",
          "addressCountry": "TR"
        },
        {
          "@type": "City",
          "name": "Ankara",
          "addressCountry": "TR"
        },
        {
          "@type": "City",
          "name": "İzmir",
          "addressCountry": "TR"
        },
        {
          "@type": "City",
          "name": "Antalya",
          "addressCountry": "TR"
        },
        {
          "@type": "City",
          "name": "Bursa",
          "addressCountry": "TR"
        }
      ]
    };
  } else if (props.type === 'localBusiness') {
    schema = {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "name": `KapKurtar ${props.cityTurkish}`,
      "description": `${props.cityTurkish} bölgesinde gıda israfını önleyen KapKurtar ile indirimli yemek fırsatları.`,
      "url": `https://kapkurtar.com/${props.city}`,
      "priceRange": "₺₺",
      "areaServed": {
        "@type": "City",
        "name": props.cityTurkish,
        "addressCountry": "TR"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": `${props.cityTurkish} Yemek Fırsatları`,
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "FoodEvent",
              "name": "İndirimli Yemek"
            }
          }
        ]
      }
    };
  } else if (props.type === 'faq') {
    schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": props.questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": q.answer
        }
      }))
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default StructuredData;
