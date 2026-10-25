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

      {/* Section HowItWorks - fond turquoise clair */}
      <div className="bg-[#2DD4BF]/10">
        <HowItWorks />
      </div>

      {/* Section FeaturedOffers - fond blanc */}
      <div className="bg-white">
        <FeaturedOffers onOpenDownloadModal={() => setShowDownloadModal(true)} />
      </div>

      {/* Section ImpactSection - fond turquoise clair */}
      <div className="bg-[#2DD4BF]/10">
        <ImpactSection />
      </div>

      {/* CTA Download Section - fond crème */}
      <div className="bg-[#fffff0] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-[#00615f] rounded-full p-4">
              <Smartphone className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            KapKurtar Uygulamasını İndirin
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Gerçek zamanlı bildirimler alın ve yakınınızdaki hiçbir teklifi kaçırmayın
          </p>
          <button
            onClick={() => setShowDownloadModal(true)}
            className="bg-[#f75c00] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#FF7A29] transition-colors duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
          >
            Şimdi İndir
          </button>
        </div>
      </div>

      {/* Section ForMerchants - fond turquoise clair */}
      <div className="bg-[#2DD4BF]/10">
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