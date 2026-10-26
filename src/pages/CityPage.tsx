import React from 'react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import { ArrowRight, MapPin, Store, Utensils, ShoppingBag } from 'lucide-react';

interface CityPageProps {
  city: string;
  cityTurkish: string;
}

/**
 * Template de page ville réutilisable pour le SEO local
 * Optimisé pour les recherches géolocalisées type "ucuz yemek Istanbul"
 */
const CityPage: React.FC<CityPageProps> = ({ city, cityTurkish }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-kk-paper">
      {/* Meta tags SEO */}
      <SEO
        title={`${cityTurkish}'da Ucuz Yemek Fırsatları | KapKurtar`}
        description={`${cityTurkish}'da indirimli fiyatlarla yemek fırsatları. Restoranlar, fırınlar ve marketlerden fazla gıda. Gıda israfını önle, tasarruf et!`}
        canonical={`/${city}`}
        keywords={`${cityTurkish} ucuz yemek, ${cityTurkish} indirimli yemek, ${city} fazla gıda, ${city} restoran fırsatları`}
      />

      {/* Schema.org LocalBusiness */}
      <StructuredData type="localBusiness" city={city} cityTurkish={cityTurkish} />

      {/* Hero Section */}
      <div className="bg-kk-night text-white py-20 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-6">
              <MapPin className="w-16 h-16 p-3.5 rounded-full bg-kk-lime text-kk-night" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
              <span className="text-kk-lime">{cityTurkish}</span>'da Ucuz Yemek Fırsatları
            </h1>
            <p className="text-xl text-white/70 mb-8 max-w-3xl mx-auto">
              {cityTurkish}'daki restoranlar, fırınlar ve marketlerden indirimli fiyatlarla yemek fırsatları.
              Gıda israfını önle, cüzdanını koru!
            </p>
            <button
              onClick={() => navigate('/offers')}
              className="kk-btn-primary px-8 py-4 text-lg"
            >
              Fırsatları Keşfet
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>

      {/* Content Section - SEO Text */}
      <div className="bg-kk-paper py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none kk-card p-6 md:p-10">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight text-kk-night mb-6">
              {cityTurkish}'da KapKurtar ile Tasarruf Edin
            </h2>

            {/* TODO: Ajouter contenu unique pour chaque ville (200 mots minimum) */}
            <p className="text-gray-700 leading-relaxed mb-4">
              {cityTurkish}, Türkiye'nin en canlı şehirlerinden biri olarak binlerce restoran, fırın ve
              markete ev sahipliği yapmaktadır. Her gün bu işletmelerde satılmayan kaliteli ürünler
              maalesef çöpe gitmektedir. KapKurtar, bu soruna çözüm getirerek hem işletmelerin hem de
              tüketicilerin kazanmasını sağlamaktadır.
            </p>

            <p className="text-gray-700 leading-relaxed mb-4">
              {cityTurkish}'da KapKurtar ile her gün indirimli fiyatlarla sunulan fırsatlardan yararlanabilirsiniz.
              Akşam saatlerinde restoranlardan arta kalan lezzetli yemekler, fırınlardan taze ekmek ve
              pastalar, marketlerden son kullanma tarihi yaklaşan ancak tamamen taze ürünler sizi bekliyor.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Uygulamamızı indirerek {cityTurkish}'daki tüm fırsatları harita üzerinde görebilir, size en
              yakın teklifleri keşfedebilir ve birkaç tıkla rezervasyon yapabilirsiniz. Hem tasarruf edin
              hem de çevreye katkıda bulunun!
            </p>

            {/* Categories */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 not-prose">
              <div className="bg-kk-paper p-6 rounded-3xl text-center hover:shadow-md transition-shadow">
                <Utensils className="w-14 h-14 p-3 rounded-full bg-kk-mint text-kk-night mx-auto mb-4" />
                <h3 className="font-display font-extrabold text-lg text-kk-night mb-2">Restoranlar</h3>
                <p className="text-sm text-gray-600">
                  {cityTurkish}'daki restoranlardan günlük yemek fırsatları
                </p>
              </div>

              <div className="bg-kk-paper p-6 rounded-3xl text-center hover:shadow-md transition-shadow">
                <Store className="w-14 h-14 p-3 rounded-full bg-kk-mint text-kk-night mx-auto mb-4" />
                <h3 className="font-display font-extrabold text-lg text-kk-night mb-2">Fırınlar</h3>
                <p className="text-sm text-gray-600">
                  Taze ekmek ve pastalar için indirimli fırsatlar
                </p>
              </div>

              <div className="bg-kk-paper p-6 rounded-3xl text-center hover:shadow-md transition-shadow">
                <ShoppingBag className="w-14 h-14 p-3 rounded-full bg-kk-mint text-kk-night mx-auto mb-4" />
                <h3 className="font-display font-extrabold text-lg text-kk-night mb-2">Marketler</h3>
                <p className="text-sm text-gray-600">
                  Kaliteli ürünlerde indirimli fiyatlar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-kk-night text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
            {cityTurkish}'da Fırsatları <span className="text-kk-lime">Kaçırmayın</span>
          </h2>
          <p className="text-lg text-white/70 mb-8">
            Hemen başlayın, indirimli fiyatlarla tasarruf edin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/offers')}
              className="kk-btn-primary px-8 py-4"
            >
              Fırsatları Gör
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => navigate('/download')}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/20 text-white px-8 py-4 font-semibold hover:bg-white/20 transition-colors"
            >
              Uygulamayı İndir
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityPage;
