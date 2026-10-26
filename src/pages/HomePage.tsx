import { useState } from 'react';
import SEO from '../components/SEO';
import StructuredData from '../components/StructuredData';
import HeroBanner from '../components/HeroBanner';
import HowItWorks from '../components/HowItWorks';
import FeaturedOffers from '../components/FeaturedOffers';
import ImpactSection from '../components/ImpactSection';
import ForMerchantsSection from '../components/ForMerchantsSection';
import DownloadAppModal from '../components/DownloadAppModal';
import { Smartphone } from 'lucide-react';

const HomePage = () => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  return (
    <div>
      <SEO
        title="KapKurtar - Gıda israfını önle, indirimli yemek bul"
        description="KapKurtar ile yakınınızdaki restoran, fırın ve marketlerin günün sonunda kalan ürünlerini indirimli fiyatlarla rezerve edin. Gıda israfını önleyin, tasarruf edin!"
        canonical="/"
        keywords="ucuz yemek, indirimli yemek, fazla gıda, gıda israfı, KapKurtar, yemek fırsatları, Türkiye"
      />
      <StructuredData type="organization" />
      <HeroBanner />

      {/* Section HowItWorks */}
      <div className="bg-kk-paper">
        <HowItWorks />
      </div>

      {/* Section FeaturedOffers */}
      <div className="bg-kk-paper">
        <FeaturedOffers onOpenDownloadModal={() => setShowDownloadModal(true)} />
      </div>

      {/* Section ImpactSection */}
      <div className="bg-kk-paper">
        <ImpactSection />
      </div>

      {/* CTA Download Section - fond sombre */}
      <div className="bg-kk-night text-white py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-kk-mint rounded-full p-4">
              <Smartphone className="w-12 h-12 text-kk-night" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-4">
            KapKurtar Uygulamasını İndirin
          </h2>
          <p className="text-lg text-kk-muted mb-8 max-w-2xl mx-auto">
            Gerçek zamanlı bildirimler alın ve yakınınızdaki hiçbir teklifi kaçırmayın
          </p>
          <button
            onClick={() => setShowDownloadModal(true)}
            className="kk-btn-primary px-8 py-4 text-lg shadow-lg"
          >
            Şimdi İndir
          </button>
        </div>
      </div>

      {/* Section ForMerchants */}
      <div className="bg-kk-paper">
        <ForMerchantsSection />
      </div>

      {/* Download App Modal */}
      <DownloadAppModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
};

export default HomePage;